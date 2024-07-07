import React from 'react';

function CountryList({ countries, handleCountryClick }) {
  return (
    <div>
      {countries.map((country, index) => (
        <div key={index}>
          {country.name.common}
          <button onClick={() => handleCountryClick(country.name.common)}>Mostrar</button>
        </div>
      ))}
    </div>
  )
}

export default CountryList;
