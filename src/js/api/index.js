export const API_URL = 'https://api.themoviedb.org/3';
export const API_KEY = '0e6d860fdb93125a12911f42a73dd701'

// https://api.themoviedb.org/3/movie/popular?
// /movie/popular
export function requestPopular() {
    fetch(API_URL + '/movie/popular?api_key=' + API_KEY)
        .then(res => {
            return res.json();
        }).then(data => {
            const result = data.results.sort((a, b) => {
                return b.popularity - a.popularity
            })

            return result
        }).catch(err => {
            console.log('Fetch Error', err);
        });
}

// https://api.themoviedb.org/3/movie/550?api_key=0e6d860fdb93125a12911f42a73dd701