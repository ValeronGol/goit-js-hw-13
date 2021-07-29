import './css/styles.css';
import 'simplelightbox/dist/simple-lightbox.css';
import ImagesApiService from './js/apiService';
import LoadMoreBtn from './js/LoadMoreBtn';
import Notiflix from 'notiflix';
import cardsImagesTpl from './templates/cardImage.hbs';
import SimpleLightbox from 'simplelightbox';

const imagesApiService = new ImagesApiService();
let lightbox = new SimpleLightbox('.gallery a');
const loadMoreBtn = new LoadMoreBtn({
  selector: '[data-action="load-more"]',
  hidden: true,
});
const refs = {
  searchForm: document.querySelector('.search-form'),
  imagesContainer: document.querySelector('.gallery'),
  button: document.querySelector('.load-more'),
};
refs.searchForm.addEventListener('submit', onSearch);
loadMoreBtn.refs.button.addEventListener('click', fetchImages);

async function onSearch(e) {
  e.preventDefault();
  loadMoreBtn.hide();
  const searchValue = e.currentTarget.elements.searchQuery.value;
  imagesApiService.query = searchValue.trim();

  if (imagesApiService.query === '') {
    return Notiflix.Notify.failure('Please, enter something');
  }
  imagesApiService.resetPage();
  clearimagesContainer();
  loadMoreBtn.show();

  fetchImages();
}

async function fetchImages() {
  try {
    Notiflix.Loading.hourglass('Loading...');
    const cards = await imagesApiService.fetchImages();
    Notiflix.Loading.remove();
    const totalHits = cards.totalHits;
    const currentPage = imagesApiService.options.params.page;
    const perPage = imagesApiService.options.params.per_page;
    if (currentPage === 1) {
      Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
    }
    renderCardsimages(cards);
    lightbox.refresh();
    checkImagesCount(totalHits, currentPage, perPage);
    smoothScroll();
    imagesApiService.incrementPage();
  } catch (error) {
    console.log(error);
    loadMoreBtn.hide();
    Notiflix.Loading.remove();
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.',
    );
  }
}

function renderCardsimages(cards) {
  const markup = cardsImagesTpl(cards);
  refs.imagesContainer.insertAdjacentHTML('beforeend', markup);
}

function clearimagesContainer() {
  refs.imagesContainer.innerHTML = '';
}

function checkImagesCount(total, current, per) {
  if (current * per >= total) {
    Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
    loadMoreBtn.hide();
  } else {
    loadMoreBtn.show();
  }
}

function smoothScroll() {
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  if (imagesApiService.options.params.page !== 1) {
    window.scrollBy({
      top: cardHeight * 2,
      behavior: 'smooth',
    });
  }
}
