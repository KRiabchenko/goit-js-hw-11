import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

import { refs } from './js/refs';
import { ApiService } from './js/apiService';
import { createMarkup } from './js/createMarkup';
import { emptySearch, imagesNotFound, imagesFound, endOfSearch } from './js/serviceMessages';


let simplelightbox = new SimpleLightbox('.gallery a', {
  captions: true,
  captionsData: 'alt',
  captionDelay: 250,
});
const apiService = new ApiService;


const options = {
    root: null,
    rootMargin: '100px',
    threshold: 1.0
};

const callback = async function (entries, observer) {
  entries.forEach(async entry => {
        if (entry.isIntersecting) {
            apiService.incrementPage();
            observer.unobserve(entry.target);

            try {
                const { hits } = await apiService.getImages();

                const markup = createMarkup(hits);
                refs.gallery.insertAdjacentHTML('beforeend', markup);

                if (apiService.isShowLoadMore) {
                  const target = document.querySelector('.gallery__link:last-child')
                  io.observe(target);
                }
              
            } catch (error) {
                console.log(error);
                imagesNotFound();
                clearPage();
            }
        }
        
    });
}

const io = new IntersectionObserver(callback, options);


async function onSearch(event) {
    event.preventDefault();

    const {
    elements: { searchQuery },
    } = event.currentTarget;
    const query = searchQuery.value.trim().toLowerCase();
    
    if (query === '') {
        emptySearch();
        return;
    }
    apiService.searchQuery = query;
    clearPage();

    try {
        const { hits, totalHits, total } = await apiService.getImages();
        if (hits.length === 0) {
            imagesNotFound();
            return;
        }
        const markup = createMarkup(hits);
        refs.gallery.insertAdjacentHTML('beforeend', markup);

        apiService.calculateTotalPages(totalHits);
        imagesFound(total);

        if (apiService.isShowLoadMore) {
            // refs.loadMore.classList.remove('is-hidden')
            const target = document.querySelector('.gallery__link:last-child');
            console.log(target);
            io.observe(target);
        }
        simplelightbox.refresh();
    } catch (error) {
        console.log(error);
        imagesNotFound();
        clearPage();  
    }
}


async function onLoadMore() {
    apiService.incrementPage();

    if (!apiService.isShowLoadMore) {
        refs.loadMore.classList.add('is-hidden')
        endOfSearch();
    }
    try {
        const { hits } = await apiService.getImages();
        const markup = createMarkup(hits);
        refs.gallery.insertAdjacentHTML('beforeend', markup);
        simplelightbox.refresh();
        scrollPage();
    
    }
    catch (error) {
        console.log(error);
        imagesNotFound();
        clearPage();
    }
}

function clearPage() {
    apiService.resetPage();
    refs.gallery.innerHTML = ''; 
    refs.loadMore.classList.add('is-hidden')
}

function scrollPage() {
  const { height: cardHeight } = document.querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}


refs.searchForm.addEventListener('submit', onSearch);
refs.loadMore.addEventListener('click', onLoadMore);



