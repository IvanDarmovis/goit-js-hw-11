import './sass/main.scss';
import 'simplelightbox/dist/simple-lightbox.min.css';
import throttle from 'lodash.throttle';
import { Gallery } from './js/gallery-class';

const refs = {
  input: document.querySelector('.search-form > input'),
  searchBtn: document.querySelector('.search-form > button'),
  showMoreBtn: document.querySelector('.load-more'),
  imgContainer: document.querySelector('.gallery'),
};

const gallery = new Gallery(refs);

refs.searchBtn.addEventListener('click', onSearch);
refs.showMoreBtn.addEventListener('click', onSearchMore);
refs.showMoreBtn.classList.add('hidden');
window.addEventListener('scroll', throttle(gallery.infiniteScroll.bind(gallery), 300));

async function onSearch(ev) {
  ev.preventDefault();
  await gallery.searchImg();
}

async function onSearchMore(ev) {
  if (ev) ev.preventDefault();
  await gallery.searchMoreImg();
}
