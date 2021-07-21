const axios = require('axios');
const API_KEY = '22579903-23cd6d72a32c76f3810c95a65';
const BASE_URL = 'https://pixabay.com/api/';
const param = 'image_type=photo$orientation=horizontal&safesearch=true&page=1&per_page=40';

async function fetchImages(name) {
  try {
    const response = await axios.get(`${BASE_URL}?key=${API_KEY}&q=${name}&${param}`);
    return response;
  } catch (error) {
    console.error(error);
  }
}
export default { fetchImages };
