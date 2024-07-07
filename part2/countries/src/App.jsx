import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SearchBar from './components/SearchBar';
import CountryList from './components/CountryList';
import CountryDetails from './components/CountryDetail';
import WeatherInfo from './components/WeatherInfo';

function App() {
  const [countries, setCountries] = useState([]);
  const [filteredCountries, setFilteredCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [weatherData, setWeatherData] = useState(null);

  useEffect(() => {
    axios.get('https://restcountries.com/v3.1/all')
      .then(response => {
        setCountries(response.data);
      })
      .catch(error => {
        console.error('Error fetching countries:', error);
      });
  }, [])

  const handleSearch = (query) => {
    const filtered = countries.filter(country => country.name.common.toLowerCase().includes(query.toLowerCase()));
    setFilteredCountries(filtered);
    setSelectedCountry(null);
    setWeatherData(null);
  }

  const handleCountryClick = (countryName) => {
    const selected = countries.find(country => country.name.common === countryName);
    setSelectedCountry(selected);
    fetchWeatherData(selected.name.common);
  }

  const fetchWeatherData = (countryName) => {
    console.log(countryName);
    const apiKey = import.meta.env.VITE_WEATHER_API_KEY;
    console.log(apiKey);
    axios.get(`https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${countryName}&aqi=no`)
      .then(response => {
        setWeatherData(response.data);
      })
      .catch(error => {
        console.error('Error fetching weather data:', error);
      });
  };
  
  return (
    <div>
      <SearchBar onSearch={handleSearch} />
      {filteredCountries.length > 0 && selectedCountry === null && (
        <CountryList countries={filteredCountries} handleCountryClick={handleCountryClick} />
      )}
      {selectedCountry && (
        <div>
          <CountryDetails country={selectedCountry} />
          {weatherData && <WeatherInfo weather={weatherData} />} {/* Agrega el componente WeatherInfo */}
        </div>
      )}
    </div>
  );
}

export default App;
