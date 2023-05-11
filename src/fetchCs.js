const BASE_URL = 'https://restcountries.com/v3.1';

export const fetchCountries = name => {
  const fields = 'name,capital,population,flags,languages';
  return fetch(`${BASE_URL}/name/${name}?fields=${fields}`).then(response => {
    return response.json();
  });
};
