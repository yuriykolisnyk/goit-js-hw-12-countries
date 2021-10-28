import API from './fetchCountries.js';
import debounce from 'lodash/debounce';

import { error } from '@pnotify/core';
import '@pnotify/core/dist/PNotify.css';
import '@pnotify/core/dist/BrightTheme.css';

import cardCountries from '../templates/cardCountries.hbs';
import listCountries from '../templates/listCountries.hbs';

const inputEl = document.querySelector('.input');
const cardContainer = document.querySelector('.js-container');
let countryToSearch = '';

inputEl.addEventListener(
  'input',
  debounce(() => {
    onSearch();
  }, 500),
);

function onSearch() {
  countryToSearch = inputEl.value;
  if (!countryToSearch) {
    clearMarkup();
    return;
  }

  API.fetchCountries(countryToSearch).then(checkingNumberOfCountries).catch(onFetchError);
}

function checkingNumberOfCountries(countries) {
  if (countries.length > 10) {
    clearMarkup();
    tooManyCountries();
  } else if (countries.length <= 10 && countries.length > 1) {
    clearMarkup();
    renderMarkup(listCountries, countries);
  } else if (countries.length === 1) {
    clearMarkup();
    renderMarkup(cardCountries, countries[0]);
  } else {
    clearMarkup();
    noResult();
  }
}

function renderMarkup(template, countries) {
  const markup = template(countries);
  cardContainer.insertAdjacentHTML('beforeend', markup);
}

function clearMarkup() {
  cardContainer.innerHTML = '';
}

function noResult() {
  error({
    text: 'No matches found!',
    delay: 1500,
    closerHover: true,
  });
}

function tooManyCountries() {
  error({
    text: 'Too many matches found. Please enter a more specific query!',
    delay: 1500,
    closerHover: true,
  });
}

function onFetchError(error) {
  clearMarkup();
}
