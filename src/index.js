import axios from 'axios';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const refs = {
  searchForm: document.querySelector('#search-form'),
  input: document.querySelector('input'),
  gallery: document.querySelector('.gallery'),
  loadMoreBtn: document.querySelector('.load-more'),
};

const API_URL= 'https://pixabay.com/api';
const KEY = '28190509-ff23f124c1d07477982e37228';
const IMAGE_TYPE = 'photo';
const ORIENTATION = 'horizontal';
const SAFE_SEARCH = true;
const PER_PAGE = 40;

let page = 1;

refs.searchForm.addEventListener('submit', showImages);
refs.loadMoreBtn.addEventListener('click', addImages);

function checkPage() {
  if (page === 1) {
    refs.loadMoreBtn.classList.add('hidden');
  }
}

checkPage();

function resetPageCount() {
  page = 1;
}

function clearMarkup() {
  refs.gallery.innerHTML = ' ';
}

function getImages(e) {
  e.preventDefault();
  const requestValue = refs.input.value;

  getDatas(requestValue)
    .then(response => {
      receivedDatas(response);
    })
    .catch(error => console.log(error.message));
}

function showImages(e) {
  if (!refs.loadMoreBtn.classList.contains('hidden') && page > 1) {
    refs.loadMoreBtn.classList.add('hidden');
  }

  resetPageCount();
  clearMarkup();
  getImages(e);
}

function addImages(e) {
  getImages(e);
}

function receivedDatas(response) {
  const imageData = response.data.hits;
  createCards(imageData);
}

const axios = require('axios');

async function getDatas(searchword) {
  const wordForSearch = searchword.trim();
  try {
    const response = await axios.get(
      `${API_URL}/?key=${KEY}&q=${wordForSearch}&image_type=${IMAGE_TYPE}&orientation=${ORIENTATION}&safesearch=${SAFE_SEARCH}&page=${page}&per_page=${PER_PAGE}`
    );

    if (page === 1 && response.data.totalHits > 0) {
      Notify.success(
        `Hooray! We found ${response.data.totalHits} images`
      );
      refs.loadMoreBtn.classList.remove('hidden');
    }

    if (
      page >= response.data.totalHits / PER_PAGE &&
      response.data.totalHits > 0
    ) {
      Notify.warning(
        "We're sorry, but you've reached the end of search results."
      );
      refs.loadMoreBtn.classList.add('hidden');
    }

    if (response.data.hits.length === 0) {
      Notify.failure(
        'Sorry, there are no images matching your search query. Please try again'
      );
      return;
    }

    page += 1;
    return response;
  } catch (error) {
    console.error(error);
  }
}

function createCards(imagesData) {
  const cardMarkup = imagesData
    .map(
      ({
        largeImageURL,
        webformatURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => {
        return `
        <div class="photo-card">
        <a class="gallery-item" href="${largeImageURL}">
        <img src="${webformatURL}" alt="${tags}" loading="lazy" class="photo-card__image"/>
        <div class="info">
        <p class="info-item">
        <b>Likes: ${likes}</b>
        </p>
        <p class="info-item">
        <b>Views: ${views}</b>
        </p>
        <p class="info-item">
        <b>Comments: ${comments}</b>
        </p>
        <p class="info-item">
        <b>Downloads: ${downloads}</b>
        </p>
        </div>
        </div> 
        </a>
        `;
      }
    )
    .join('');
  
    refs.gallery.insertAdjacentHTML('beforeend', cardMarkup);
    new SimpleLightbox('.photo-card a', {
    captionsData: 'alt',
    captionDelay: 250,
});
}




















