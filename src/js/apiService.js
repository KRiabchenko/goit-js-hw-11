import axios from 'axios';
  
  axios.defaults.baseURL = 'https://pixabay.com/api/';
    

export class ApiService{

    #page = 1;
    #searchQuery = '';
    #perPage = 40;
    #totalHits = 0;
    #params = {
    params: {
      key: '30594322-2efeba6f22ad964c69d1079cd',
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: 'true',
    }, 
  }

  async getImages() {
    const url = `?q=${this.#searchQuery}&per_page=${this.#perPage}&page=${this.#page}`;
    const { data } = await axios.get(url, this.#params);
    return data;
    }

    set searchQuery(newQuery) {
        this.#searchQuery = newQuery;
    }

    get searchQuery() {
        return this.#searchQuery;
    }
    
    incrementPage() {
        this.#page += 1;
    }

    resetPage() {
        this.#page = 1;
    }

    calculateTotalPages(total) {
        this.#totalHits = Math.ceil(total / this.#perPage)
    }

    get isShowLoadMore() {
        return this.#page < this.#totalHits;
    }
}