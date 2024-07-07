import React from 'react';

function CountryDetails({ country }) {
  return (
    <div>
      <h2>{country.name.common}</h2>
      <p>Capital: {country.capital}</p>
      <p>Área: {country.area} km²</p>
      <p>Idiomas:</p>
      <ul>
        {Object.values(country.languages).map((language, index) => (
          <li key={index}>{language}</li>
        ))}
      </ul>
      <img src={country.flags.png} alt="Flag" />
    </div>
  )
}

export default CountryDetails;
