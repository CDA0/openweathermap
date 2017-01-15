import React from 'react';
import expect from 'expect';
import { shallow } from 'enzyme';
import {App, Forecast} from '../src/App';

const config = { apiKey: '123' }

describe('App', () => {
  let app;

  beforeEach(() => {
    app = shallow(<App config={config}/>);
  });

  it('renders container div', () => {
    expect(app.find('div').props().className).toEqual('container');
  });

  it('renders title', () => {
    expect(app.find('h1').text()).toEqual('OpenWeatherMap');
  });

  it('renders subtitle', () => {
    expect(app.find('p').text()).toEqual('Simple React app to show 5 day forecast.');
  });

  it('renders the Form', () => {
    expect(app.find('Form').length).toBe(1);
  });

  it('does not render a table', () => {
    expect(app.find('table').length).toBe(0);
  });

  it('renders a table when data preset', () => {
    app.setState({ days: [
      {
        dt: '123',
        dt_txt: '2017-01-01',
        weather: [{ description: 'blah' }],
        main: { temp: 0 },
        wind: { speed: 1 },
        rain: { '3h': 0 }
      }
    ] });
    expect(app.find('table').length).toBe(1);
  });

  it('renders 2 tables when data preset', () => {
    app.setState({
      days: [
        {
          dt: '123',
          dt_txt: '2017-01-01',
          weather: [{ description: 'blah' }],
          main: { temp: 0 },
          wind: { speed: 1 },
          rain: { '3h': 0 }
        }
      ],
      details: [
        {
          dt: '123',
          dt_txt: '2017-01-01',
          weather: [{ description: 'blah' }],
          main: { temp: 0 },
          wind: { speed: 1 },
          rain: { '3h': 0 }
        }
      ]
    });
    expect(app.find('table').length).toBe(2);
  });
});

describe('Forecast', () => {
  let forecast;

  beforeEach(() => {
    forecast = shallow(<Forecast
      dt='2017-01-01'
      desc='rain'
      onClick='null'
      temp='22'
      wind='2'
      prec='1'/>);
  });

  it('renders a table row', () => {
    expect(forecast.find('tr').length).toEqual(1);
  });

  it('renders a table row with data', () => {
    expect(forecast.find('tr').props()['data-day']).toEqual('2017-01-01');
  });

  it('renders 5 td tags', () => {
    expect(forecast.find('td').length).toEqual(5);
  });
});
