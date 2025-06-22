import axios from 'axios';

const API_KEY = '50845071-46be9009d91c767b22c84ce04';
const BASE_URL = 'https://pixabay.com/api/';
const PER_PAGE = 15;

export async function getImagesByQuery(query, page = 1) {
  const response = await axios.get(BASE_URL, {
    params: {
      key: API_KEY,
      q: query,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
      per_page: PER_PAGE,
      page,
    },
  });
  return {
    images: response.data.hits,
    total: response.data.totalHits,
  };
}
