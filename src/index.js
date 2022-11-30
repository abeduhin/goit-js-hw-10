import './css/styles.css';
import { fetchCountries } from './js/fetchCountries';
// імпортуємо функцію, яка робить HTTP-запит на ресурс name і повертає проміс з масивом країн - результатом запиту (з потрібними фільтрами)
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';
// Підключаємо бібліотекі

const inputEl = document.querySelector('#search-box');
const countryListEl = document.querySelector('.country-list');
const countryInfoEl = document.querySelector('.country-info');
// Звератаємось до потрібних елементів HTML

const DEBOUNCE_DELAY = 300;
// Присвюємо змінній значення (робити HTTP-запит через 300мс)

inputEl.addEventListener(
    'input',
    debounce(e => {
        const trimmedValue = inputEl.value.trim();
           cleanHtml();   
      if (trimmedValue !== '') {
          fetchCountries(trimmedValue).then(foundData => {      
  
          if (foundData.length > 10) {
            Notiflix.Notify.info(
              'Too many matches found. Please enter a more specific name.'
            );
          } else if (foundData.length === 0) {
            Notiflix.Notify.failure('Oops, there is no country with that name');
          } else if (foundData.length >= 2 && foundData.length <= 10) {
           
            renderCountryList(foundData);
          } else if (foundData.length === 1) {
      
            renderOneCountry(foundData);
          }
        });
      }
    }, DEBOUNCE_DELAY)
  );
  // Присвоюємо слухача події на input. Робимо санітизацію введеного рядка методом trim(убираємо пробіли). Якщо рядок не пустий. робимо HTTP-запит, якщо у відповіді більше 10. то виводим меседж Please enter a more specific name, якшо ничого - Oops, there is no country with that name, якщо від 2 до 10 виводим список країн, якшо 1 - то виводим інформацію про країну.
  
  function renderCountryList(countries) {
    const markup = countries
      .map(country => {
        return `<li>
        <img src="${country.flags.svg}" alt="Flag of ${
          country.name.official
        }" width="50" hight="40">
           <b>${country.name.official}</b>
                  </li>`;
      })
      .join('');
    countryListEl.innerHTML = markup;
  }
  // Функція яка виводить об'єднанний список країн (флаг, офіційна назва)
  
  function renderOneCountry(countries) {
        const markup = countries
          .map(country => {
            return `<li>
        <img src="${country.flags.svg}" alt="Flag of ${
              country.name.official
            }" width="50" hight="40">
           <b>${country.name.official}</b>
              <p><b>Capital</b>: ${country.capital}</p>
              <p><b>Population</b>: ${country.population}</p>
              <p><b>Languages</b>: ${Object.values(country.languages)} </p>
                  </li>`;
          })
          .join('');
        countryListEl.innerHTML = markup;
  }
  
  // Функція яка виводить інформацію про країну (флаг, офіційна назва,столиця, кількість населення, мова)
  function cleanHtml() {
    countryListEl.innerHTML = '';
    countryInfoEl.innerHTML = '';
  }
  // Функція яка очищає розмітку 