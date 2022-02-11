import axios from 'axios';
import SimpleLightbox from 'simplelightbox';
import template from './templates/card.hbs';
import './sass/main.scss';
import 'simplelightbox/dist/simple-lightbox.min.css';
import Notiflix from 'notiflix';
import throttle from 'lodash.throttle';

const API_KEY = '25607511-28b83b13f0e2975028585da7b';
const URL = `https://pixabay.com/api/?key=${API_KEY}&image_type=photo&orientation=horizontal&per_page=40`;

const refs = {
  input: document.querySelector('.search-form > input'),
  searchBtn: document.querySelector('.search-form > button'),
  showMoreBtn: document.querySelector('.load-more'),
  imgContainer: document.querySelector('.gallery'),
};

let page = 1;
let litebox;
let searchItem = '';

async function getPhotos(item, page) {
  const response = await axios.get(`${URL}&q=${item}&page=${page}`);
  return response.data;
}

refs.searchBtn.addEventListener('click', onSearch);
refs.showMoreBtn.addEventListener('click', onSearchMore);
refs.showMoreBtn.classList.add('hidden');

async function onSearch(ev) {
  ev.preventDefault();
  page = 1;
  searchItem = refs.input.value;
  const response = await getPhotos(searchItem, page);
  if (response.totalHits > 0) {
    Notiflix.Notify.success(`Hooray! We found ${response.totalHits} images.`);
    const markup = createMarkup(response.hits);
    refs.imgContainer.innerHTML = markup;
    refs.showMoreBtn.classList.remove('hidden');
    litebox = new SimpleLightbox('.gallery a');
  } else {
    Notiflix.Notify.warning(
      'Sorry, there are no images matching your search query. Please try again.',
    );
    refs.input.value = '';
  }
}

async function onSearchMore(ev) {
  if (ev) ev.preventDefault();
  try {
    page += 1;
    const response = await getPhotos(searchItem, page);
    if (refs.imgContainer.childElementCount < response.totalHits) {
      const markup = createMarkup(response.hits);
      refs.imgContainer.insertAdjacentHTML('beforeend', markup);
      litebox.refresh();
      const { height: cardHeight } = document
        .querySelector('.gallery')
        .firstElementChild.getBoundingClientRect();

      window.scrollBy({
        top: cardHeight * 2,
        behavior: 'smooth',
      });
    }
  } catch {
    refs.showMoreBtn.classList.add('hidden');
    Notiflix.Notify.warning("We're sorry, but you've reached the end of search results.");
  }
}

function createMarkup(arr) {
  return arr.map(el => template(el)).join('\n');
}

window.addEventListener('scroll', throttle(infiniteScroll, 300));

function infiniteScroll() {
  const height = document.body.offsetHeight;
  const screenHeight = window.innerHeight;
  const scrolled = window.scrollY;
  const limit = height - screenHeight / 4;
  const position = scrolled + screenHeight;

  if (position >= limit) {
    try {
      onSearchMore();
    } catch {
      refs.showMoreBtn.classList.add('hidden');
      Notiflix.Notify.warning("We're sorry, but you've reached the end of search results.");
    }
  }
}
