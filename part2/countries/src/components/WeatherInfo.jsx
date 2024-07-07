import React from 'react';

function WeatherInfo({ weather }) {
  return (
    <div>
      <h2>Weather in {weather.location.name}</h2>
      <p>Temperature: {weather.current.temp_c}°C</p>
      <p>Wind: {weather.current.wind_kph} kph</p>
      <img src={weather.current.condition.icon} alt="Weather icon" />
    </div>
  )
}

export default WeatherInfo;
