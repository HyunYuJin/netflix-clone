import View from './view'
import template from '../../components/home.html'
import { tmdb } from '../api/index'

class Home extends View {
    constructor() {
        super({
            innerHTML: template,
            className: 'home'
        }) // 이걸로 부모에 접근할 수 있다. (부모 클래스 constructor에 접근하도록 한다.)

        this.$mainBanner = this.$element.querySelector('.mainBanner')
        this.$slideList = this.$element.querySelector('.slide-list')
        this.$slideContents = null // 모든 item
        this.$prevBtn = this.$element.querySelector('.prevBtn')
        this.$nextBtn = this.$element.querySelector('.nextBtn')
        this.slideWidth = 16.6666667
        this.slideLength = 0
    }

    created() {
        console.log('created')
        this._requestPopular()
    }

    mounted() {
        console.log('mounted')
    }

    destroyed() {
        console.log('destroyed')
    }

    // Youtube에서 제공하는 영화 예고편 요청
    _requestVedio(id) {
        const VIDEO_URL = 'https://www.youtube.com/embed/'
        tmdb.getVideo(id)
        .then(data => {
            if (data.results.length > 0) {
                const youtubeId = data.results[0].key
                this.$mainBanner.innerHTML += `<iframe width="100%" height="100%" src="${VIDEO_URL + youtubeId}?autoplay=1"></iframe>`; 
            } else {
                this.$mainBanner.innerHTML += `<div>재생할 예고편이 없습니다.</div>`; 
            }
        })
        .catch(error => {
            console.log(error)
        })
    }

    // 영화 인기 순위 API
    _requestPopular() {
        tmdb.getPopularMovie()
        .then(data => {
            // 인기가 많은 순서대로 정렬
            const movieList = data.results.sort((a, b) => {
                return b.popularity - a.popularity
            })

            // movieList.forEach((key) => {
            //     this._requestVedio(key.id)
            // })

            // this.$slideList.style.width = this.slideWidth * movieList.length + 'px'
            this.$slideList.style.width = this.slideWidth * movieList.length + '%'

            movieList.forEach((movie) => {
                const $sliderItem = document.createElement('div')
                $sliderItem.className = 'slide-content'
                $sliderItem.innerHTML = `<img src=${tmdb.BASE_IMAGE_URL + movie.backdrop_path} />`
                // $sliderItem.style.backgroundImage = `url('${BASE_IMAGE_URL + movie.backdrop_path}')`
                this.$slideList.appendChild($sliderItem)
                $sliderItem.setAttribute('data-id', movie.id)

                // 마우스 hover 했을 때 영화에 대한 자세한 정보를 담고 있는 부분
                const $sliderItemDetail = document.createElement('div')
                $sliderItemDetail.className = 'slider-detail'
                $sliderItem.appendChild($sliderItemDetail)

                // original_title, overview, release_date
                const movieTitle = document.createElement('h4')
                const movieOverview = document.createElement('p')
                const movieReleaseDate = document.createElement('span')

                movieTitle.innerHTML = movie.original_title
                movieOverview.innerHTML = movie.overview
                movieReleaseDate.innerHTML = movie.release_date

                $sliderItemDetail.appendChild(movieTitle)
                $sliderItemDetail.appendChild(movieOverview)
                $sliderItemDetail.appendChild(movieReleaseDate)

                $sliderItem.addEventListener('mouseenter', () => {
                    $sliderItemDetail.classList.add('hover')
                })
                $sliderItem.addEventListener('mouseleave', () => {
                    $sliderItemDetail.classList.remove('hover')
                })
            })
            
            this.$slideContents = document.querySelectorAll('.slide-content')
            const slideLength = this.$slideContents.length

            let currentIndex = 0
            if (currentIndex === 0) {
                this.$prevBtn.classList.add('hide')
            }

            // next Button
            this.$nextBtn.addEventListener('click', () => {
                if (currentIndex <= slideLength - 1) {
                    this.$prevBtn.classList.remove('hide')
                    // this.$slideList.style.transform = 'translate3d(-' + (this.slideWidth * (currentIndex + 1)) + 'px, 0px, 0px)'
                    this.$slideList.style.transform = 'translate3d(-' + (5 * (currentIndex + 1)) + '%, 0px, 0px)'
                }
                
                if (currentIndex == slideLength - 2) {
                    currentIndex = 0
                } else {
                    currentIndex++
                }

                console.log(currentIndex, slideLength - 1)
            })
            
            // prev Button
            this.$prevBtn.addEventListener('click', () => {
                if (currentIndex > 0) {
                    // this.$slideList.style.transform = 'translate3d(-' + (this.slideWidth * (currentIndex - 1)) + 'px, 0px, 0px)'
                    this.$slideList.style.transform = 'translate3d(-' + (5 * (currentIndex - 1)) + '%, 0px, 0px)'
                }
                
                if (currentIndex == 0) {
                    currentIndex = slideLength - 1
                } else {
                    currentIndex--
                }
                
                console.log(currentIndex, slideLength - 1)
            })
        })
        .catch(err => {
            console.log('Fetch Error', err);
        })
    }
}

export default Home