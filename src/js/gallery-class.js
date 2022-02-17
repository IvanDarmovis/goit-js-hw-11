import Notiflix from 'notiflix';
import { getPhotos } from './api';
import { createMarkup } from './createMarkup';
import SimpleLightbox from 'simplelightbox';

export class Gallery {
  constructor(obj) {
    this.refs = obj;
    this.page = 1;
    this.searchItem = '';
    this.litebox = new SimpleLightbox('.gallery a');
  }

  async searchImg() {
    this.page = 1;
    this.searchItem = this.refs.input.value;
    const response = await getPhotos(this.searchItem, this.page);
    if (response.totalHits > 0) {
      Notiflix.Notify.success(`Hooray! We found ${response.totalHits} images.`);
      this.refs.imgContainer.innerHTML = createMarkup(response.hits);
      this.refs.showMoreBtn.classList.remove('hidden');
    } else {
      Notiflix.Notify.warning(
        'Sorry, there are no images matching your search query. Please try again.',
      );
      this.refs.input.value = '';
    }
    this.litebox.refresh();
  }

  async searchMoreImg() {
    try {
      this.page += 1;
      const response = await getPhotos(this.searchItem, this.page);
      if (this.refs.imgContainer.childElementCount < response.totalHits) {
        this.refs.imgContainer.insertAdjacentHTML('beforeend', createMarkup(response.hits));
        const { height: cardHeight } = document
          .querySelector('.gallery')
          .firstElementChild.getBoundingClientRect();

        window.scrollBy({
          top: cardHeight * 2,
          behavior: 'smooth',
        });
      }
    } catch {
      this.refs.showMoreBtn.classList.add('hidden');
      Notiflix.Notify.warning("We're sorry, but you've reached the end of search results.");
    }
    this.litebox.refresh();
  }

  infiniteScroll() {
    const height = document.body.offsetHeight;
    const screenHeight = window.innerHeight;
    const scrolled = window.scrollY;
    const limit = height - screenHeight / 4;
    const position = scrolled + screenHeight;

    if (position >= limit) {
      try {
        this.searchMoreImg();
      } catch {
        this.refs.showMoreBtn.classList.add('hidden');
        Notiflix.Notify.warning("We're sorry, but you've reached the end of search results.");
      }
    }
  }
}
