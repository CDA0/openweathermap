#! /usr/bin/env node

const OpenWeatherMap = require('./omw');

if (process.argv.length < 3) {
  return console.log('Usage: ./cli.js <city>');
}

const appid = process.env.APPID || 'b2e84cc56524b139a761c420392095b8';

const owm = new OpenWeatherMap({ appid });

const city = process.argv[2];

function currentForecastOutput(data) {
  console.log(`Currently: ${Math.round(data.temperature)}, ${data.forecast}`);
}

function dailyForecastOutput(data) {
  Object.keys(data).forEach(day => {
    console.log(`${day}: ${Math.round(data[day].temperature)}, ${data[day].forecast}`);
  });
}

owm.fetchForecast(city).then(forecastData => {
  currentForecastOutput(owm.currentConditions(forecastData));
  dailyForecastOutput(owm.daily(forecastData));
}).catch(() => console.log('an error occurred, please retry'));
