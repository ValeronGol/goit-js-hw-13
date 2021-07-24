import './css/styles.css';
import ImagesApiService from './js/apiService';
import Notiflix from 'notiflix';
import cardsImagesTpl from './templates/cardImage.hbs';

const imagesApiService = new ImagesApiService();

const refs = {
  searchForm: document.querySelector('.search-form'),
  imagesContainer: document.querySelector('.gallery'),
  button: document.querySelector('.load-more'),
};
refs.searchForm.addEventListener('submit', onSearch);
async function onSearch(e) {
  e.preventDefault();
  clearimagesContainer();
  const searchValue = e.currentTarget.elements.searchQuery.value;
  imagesApiService.query = searchValue.trim();
  imagesApiService.resetPage();
  if (imagesApiService.query === '') {
    return Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.',
    );
  }
  try {
    const cards = await imagesApiService.fetchImages();
    const totalHits = cards.totalHits;

    if (imagesApiService.page === 1) {
      Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
    }
    refs.button.classList.remove('is-hidden');
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
