const API_URL = 'https://api.themoviedb.org/3';
const API_KEY = '0e6d860fdb93125a12911f42a73dd701'
const BASE_IMAGE_URL = 'https://image.tmdb.org/t/p/w500/'

export const tmdb = {
    API_URL,
    API_KEY,
    BASE_IMAGE_URL,

    // https://api.themoviedb.org/3/movie/popular?
    getPopularMovie () {
        return window.fetch(`${API_URL}/movie/popular?api_key=${API_KEY}`)
            .then(res => res.json())
    },

    // https://api.themoviedb.org/3/movie/{id}?
    getVideo(id) {
        return window.fetch(`${API_URL}/movie/${id}/videos?api_key=${API_KEY}`)
            .then(res => res.json())
    }
}

