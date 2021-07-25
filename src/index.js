import './css/styles.css';
import ImagesApiService from './js/apiService';
import LoadMoreBtn from './js/LoadMoreBtn';
import Notiflix from 'notiflix';
import cardsImagesTpl from './templates/cardImage.hbs';

const imagesApiService = new ImagesApiService();
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
    const currentPage = imagesApiService.page;
    const perPage = imagesApiService.per_page;
    if (imagesApiService.page === 1) {
      Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
    }
    renderCardsimages(cards);
    checkImagesCount(totalHits, currentPage, perPage);
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
