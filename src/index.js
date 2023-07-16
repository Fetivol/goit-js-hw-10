import { fetchBreeds, fetchCatByBreed } from './cat-api';
import Notiflix from 'notiflix';

const selectors = {
  breedEl: document.querySelector('.breed-select'),
  catInfoEl: document.querySelector('.cat-info'),
  errorEl: document.querySelector('.error'),
  loaderEl: document.querySelector('.loader'),
};

selectors.breedEl.addEventListener('change', catHandler);

function breedHandler() {
  fetchBreeds()
    .then(data => {
      showLoader();
      const selectorOptions = data
        .map(({ id, name }) => {
          return `<option value="${id}">${name}</option>`;
        })
        .join('');
      selectors.breedEl.insertAdjacentHTML('beforeend', selectorOptions);
      hideLoader();
    })
    .catch(error => {
      console.log(error);
      hideLoader();
      Notiflix.Notify.failure(selectors.errorEl.textContent);
    });
}

function catHandler() {
  showLoader();
  fetchCatByBreed(selectors.breedEl.value)
    .then(data => {
      let {
        url,
        breeds: {
          0: { description, temperament, name },
        },
      } = data[0];
      console.log(url, description, temperament, name);
      selectors.catInfoEl.innerHTML = `<div class="thumb">
          <img src="${url}" alt="${name}" class="image"></div>
          <h2 class="catName">${name}</h2>
          <p class="description"><b>Description:</b> ${description}</p>
          <p class="temperament"><b>Temperament:</b> ${temperament}</p>
          `;
      hideLoader();
    })
    .catch(error => {
      console.log(error);
      hideLoader();
      Notiflix.Notify.failure(selectors.errorEl.textContent);
    })
    .finally(() => {});
}

function showLoader() {
  selectors.catInfoEl.innerHTML = '';
  selectors.loaderEl.style.display = 'block';
}
function hideLoader() {
  selectors.loaderEl.style.display = 'none';
}

breedHandler();
