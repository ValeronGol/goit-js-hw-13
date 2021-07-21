import './css/styles.css';
import API from './js/fetchImages';
import Notiflix from 'notiflix';
import cardsImagesTpl from './templates/cardImage.hbs';

const refs = {
  searchForm: document.querySelector('.search-form'),
  imagesContainer: document.querySelector('.gallery'),
  button: document.querySelector('.load-more'),
};
refs.searchForm.addEventListener('submit', onSearch);
async function onSearch(e) {
  e.preventDefault();
  const name = e.currentTarget.elements.searchQuery.value;
  console.log(name);
  try {
    const cards = await API.fetchImages(name);
    refs.button.classList.remove('is-hidden');
    clearimagesContainer();
    renderCardsimages(cards);
  } catch (error) {
    console.log(error);
  }
}
function renderCardsimages(cards) {
  const markup = cardsImagesTpl(cards);
  refs.imagesContainer.insertAdjacentHTML('beforeend', markup);
}
function clearimagesContainer() {
  refs.imagesContainer.innerHTML = '';
}
