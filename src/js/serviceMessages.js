import { Notify } from 'notiflix/build/notiflix-notify-aio';

function emptySearch() {
    Notify.failure(
      'The search string cannot be empty. Please specify your search query.');
}

function imagesNotFound() {
    Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.');
}

function imagesFound(total) {
    Notify.success(`Hooray! We found ${total} images.`);
}

function endOfSearch() {
    Notify.info(
      "We're sorry, but you've reached the end of search results.");
}

export {emptySearch, imagesNotFound, imagesFound, endOfSearch}
