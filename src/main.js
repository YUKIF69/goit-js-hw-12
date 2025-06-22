import '../src/css/style.css';
import { getImagesByQuery } from './js/pixabay-api.js';
import {
  createGallery,
  clearGallery,
  showLoader,
  hideLoader,
  showLoadMoreButton,
  hideLoadMoreButton,
} from './js/render-functions.js';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const form = document.querySelector('.form');
const input = document.querySelector('input[name="search-text"]');
const loadMoreBtn = document.querySelector('.load-more');

let currentQuery = '';
let currentPage = 1;
let totalHits = 0;

form.addEventListener('submit', handleSubmit);
loadMoreBtn.addEventListener('click', handleLoadMore);

async function handleSubmit(event) {
  event.preventDefault();
  currentQuery = input.value.trim();
  currentPage = 1;

  if (!currentQuery) {
    iziToast.error({
      title: 'Error',
      message: 'Please enter a search query.',
      position: 'topRight',
    });
    return;
  }

  showLoader();
  hideLoadMoreButton();
  clearGallery();

  try {
    const { images, total } = await getImagesByQuery(currentQuery, currentPage);
    totalHits = total;

    if (images.length === 0) {
      iziToast.warning({
        title: 'No Results',
        message: 'No images match your search. Try again!',
        position: 'center',
      });
      return;
    }

    createGallery(images);
    if (images.length < totalHits) {
      showLoadMoreButton();
    }
  } catch (error) {
    iziToast.error({
      title: 'Error',
      message: 'Something went wrong. Please try again later.',
      position: 'topRight',
    });
  } finally {
    hideLoader();
  }
}

async function handleLoadMore() {
  currentPage += 1;
  showLoader();
  hideLoadMoreButton();

  try {
    const { images } = await getImagesByQuery(currentQuery, currentPage);
    createGallery(images);

    smoothScroll();

    const totalLoaded = document.querySelectorAll('.gallery-item').length;
    if (totalLoaded >= totalHits) {
      iziToast.info({
        title: 'End of Results',
        message: "We're sorry, but you've reached the end of search results.",
        position: 'center',
      });
      hideLoadMoreButton();
    } else {
      showLoadMoreButton();
    }
  } catch (error) {
    iziToast.error({
      title: 'Error',
      message: 'Failed to load more images.',
      position: 'topRight',
    });
  } finally {
    hideLoader();
  }
}

function smoothScroll() {
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}
