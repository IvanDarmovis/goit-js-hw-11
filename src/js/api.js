import axios from 'axios';

const API_KEY = '25607511-28b83b13f0e2975028585da7b';
const URL = `https://pixabay.com/api/?key=${API_KEY}&image_type=photo&orientation=horizontal&per_page=40`;

export async function getPhotos(item, page) {
  const response = await axios.get(`${URL}&q=${item}&page=${page}`);
  return response.data;
}
