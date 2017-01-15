import React, {Component} from 'react';
import $ from 'jquery';
import moment from 'moment';
import { Grid, Row, Col, Jumbotron, Button, Form, FormControl, InputGroup } from 'react-bootstrap';

export function Forecast(props) {
  const { dt, desc, onClick, day, temp, wind, prec } = props;
  let dayOrTime = null;
  if (dt.indexOf('-') > -1) {
    dayOrTime = moment(dt, 'YYYY:MM:DD').format('ddd');
  } else {
    dayOrTime = moment(dt, 'HH:mm:ss').format('ha')
  }
  return <tr onClick={onClick} data-day={dt}>
    <td>{dayOrTime}</td>
    <td>{desc}</td>
    <td>{temp}</td>
    <td>{wind}</td>
    <td>{prec}</td>
  </tr>
}

export class App extends Component {

    constructor(props) {
      super(props);

      this.state = {
        city: '',
        curentCity: null,
        days: [],
        data: [],
        details: [],
        loading: false
      }

      this.apiKey = props.config.apiKey;

      this.handleCityChange = this.handleCityChange.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
      this.handleDayClick = this.handleDayClick.bind(this);
    }

    handleDayClick(event) {
      event.preventDefault();
      this.setState({
        details: this.state.data.filter(x => x.dt_txt.indexOf($(event.currentTarget).data('day')) > -1),
      });
    }

    handleCityChange(event) {
      this.setState({ city: event.target.value });
    }

    handleSubmit(event) {
      event.preventDefault();
      this.setState({ loading: true })
      $.getJSON('http://api.openweathermap.org/data/2.5/forecast', {
        q: `${this.state.city},gb`,
        mode: 'json',
        appid: this.apiKey,
        units: 'metric'
      }).done(data => {
        this.setState({
          loading: false,
          data: data.list,
          details: [],
          days: data.list.filter(x => x.dt_txt.indexOf('12:00:00') > -1),
          city: '',
          currentCity: `${data.city.name}, ${data.city.country}`
        });
      }).fail(() => {
        console.log('fail')
      });
    }

    renderForecastTable() {
      return <table className="table table-hover">
        <caption>
          Click a row for 3 hourly forcast for given day.
        </caption>
        <thead>
          <tr>
            <th>Day</th>
            <th>Forecast</th>
            <th>Temp. (c)</th>
            <th>Wind (m/s)</th>
            <th>Rain (mm)</th>
          </tr>
        </thead>
        <tbody>
        {this.state.days.map(d => {
          return <Forecast
                     key={d.dt}
                     dt={d.dt_txt.split(' ')[0]}
                     desc={d.weather[0].description}
                     temp={d.main.temp}
                     wind={d.wind.speed}
                     prec={d.rain['3h'] || 0}
                     onClick={this.handleDayClick}
                     />
        })}
       </tbody>
     </table>
    }

    renderDetailsTable() {
      return <table className="table table-hover">
        <thead>
          <tr>
            <th>Time</th>
            <th>Forecast</th>
            <th>Temp. (c)</th>
            <th>Wind (m/s)</th>
            <th>Rain (mm)</th>
          </tr>
        </thead>
        <tbody>
        {this.state.details.map(d => {
          return <Forecast
                     key={d.dt}
                     dt={d.dt_txt.split(' ')[1]}
                     desc={d.weather[0].description}
                     temp={d.main.temp}
                     wind={d.wind.speed}
                     prec={d.rain['3h'] || 0}
                     />
        })}
       </tbody>
     </table>
    }

    render() {
      let forecast = null;
      let details = null;
      let loading = null;

      if (this.state.days.length) {
        forecast = this.renderForecastTable()
      }

      if (this.state.details.length) {
        details = this.renderDetailsTable()
      }

      if (this.state.loading) {
        loading = <h3>Loading</h3>
      }

      return (
        <div className="container">
          <Jumbotron>
            <h1>OpenWeatherMap</h1>
            <p>Simple React app to show 5 day forecast.</p>
            <Form inline onSubmit={this.handleSubmit}>
              <InputGroup>
                <FormControl type="text" placeholder="UK City" value={this.state.city} onChange={this.handleCityChange.bind(this)} />
                <InputGroup.Button>
                  <Button type="submit" value="Submit">Get Forecast</Button>
                </InputGroup.Button>
              </InputGroup>
            </Form>
          </Jumbotron>

          <Grid><Row><Col className="text-center"><h3>{this.state.currentCity}</h3></Col></Row></Grid>

          <Grid>
            <Row>
            {loading}
              <Col xs={6}>
                {forecast}
             </Col>

             <Col xs={6}>
                {details}
            </Col>
           </Row>
         </Grid>
        </div>
      );
    }
}

export default App;
