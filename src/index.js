import './css/styles.css';
import { fetchCountries } from './fetchCs';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix';

const DEBOUNCE_DELAY = 300;
const refs = {
  countryList: document.querySelector('.country-list'),
  countryInfo: document.querySelector('.country-info'),
  input: document.querySelector('#search-box'),
};
refs.input.addEventListener('input', debounce(inputHandler, DEBOUNCE_DELAY));

function inputHandler(e) {
  const searchValue = e.target.value;
  const trimmedSearchValue = searchValue.trim();

  if (trimmedSearchValue === '') {
    clearContent();
    return;
  }

  fetchCountries(trimmedSearchValue)
    .then(countries => {
      console.log(countries);
      if (countries.length === 1) {
        clearContent();
        return renderCountryInfo(countries[0]);
      }
      if (countries.length > 10) {
        clearContent();
        return Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
      }
      {
        clearContent();
        return renderCountriesList(countries);
      }
    })
    .catch(onFetchError);
}

function renderCountryInfo(country) {
  const countryLanguages = Object.values(country.languages);
  const countryLanguagesStr = countryLanguages.join(', ');
  const markup = `
    <div class="country-container">
    <img src="${country.flags.svg}" alt="${country.flags.alt}" class="country-flag">
    <h1 class="country-capital"> ${country.name.official} </h1>
    </div>
    <p> <span class="country-property"> Capital: </span> ${country.capital} </p>
    <p> <span class="country-property"> Population: </span> ${country.population} </p>
    <p> <span class="country-property"> Languages: </span> ${countryLanguagesStr} </p>
    `;
  refs.countryInfo.innerHTML = markup;
}

function renderCountriesList(countries) {
  const markup = countries
    .map(country => {
      return `
            <li class="country-list-item">
            <img src="${country.flags.svg}" alt="${country.flags.alt}" class="country-list-flag">
            ${country.name.official} 
            </li>
            `;
    })
    .join('');
  refs.countryList.innerHTML = markup;
}

function onFetchError() {
  Notify.failure('Oops, there is no country with that name');
}

function clearContent() {
  refs.countryList.innerHTML = '';
  refs.countryInfo.innerHTML = '';
}
