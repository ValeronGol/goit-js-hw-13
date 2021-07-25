import axios from 'axios';

const API_KEY = '22579903-23cd6d72a32c76f3810c95a65';
axios.defaults.baseURL = 'https://pixabay.com/api/';

export default class ImagesApiService {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
    this.per_page = 40;
  }

  async fetchImages() {
    const response = await axios.get(
      `?key=${API_KEY}&q=${this.searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&page=${this.page}$per_page=${this.page}`,
    );

    if (response.data.hits.length === 0) {
      throw new Error();
    }

    return response.data;
  }

  incrementPage() {
    this.page += 1;
  }

  resetPage() {
    this.page = 1;
  }

  get query() {
    return this.searchQuery;
  }

  set query(newQuery) {
    this.searchQuery = newQuery;
  }
}
