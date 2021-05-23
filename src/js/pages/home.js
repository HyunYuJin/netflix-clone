import View from './view'
import template from '../../components/home.html'
import { tmdb } from '../api/index'
import {dialog} from '../../components/dialog'

class Home extends View {
    constructor() {
        super({ // 이걸로 부모에 접근할 수 있다. (부모 클래스 constructor에 접근하도록 한다.)
            innerHTML: template,
            className: 'home'
        })

        this.DOM = {
            mainBanner: this.$element.querySelector('.mainBanner'),
            slideBox: this.$element.querySelector('.slide-box'),
            slideList: this.$element.querySelectorAll('.slide-list'),
            slideContents: null,
            prevBtn: this.$element.querySelector('.prevBtn'),
            nextBtn: this.$element.querySelector('.nextBtn'),
        }

        this.slideWidth = 16.6666667
        this.slideLength = 0
        this.isDialog = null
    }

    mounted() {
        this._initDOM()
        this._requestPopular()
        this._renderGenre()
    }

    _initDOM() {
        for (let i = 0; i < this.DOM.slideList.length; i++) {
            this.DOM.slideList[i].insertAdjacentHTML('beforeend', `
                <div class="slide-content">
                    <a href="/">
                        <div class="init-div">&nbsp;</div>
                    </a>
                </div>
            `)
        }
    }

    _getSliderMouseEnter(slideContent, imgurl, { movie }) {
        slideContent.addEventListener('mouseenter', event => {
            let target = event.target
            console.log(target)

            if (!target.classList.contains('dialog-wrap')) {
                target.insertAdjacentHTML('beforeend', dialog.Dialog(event, imgurl, { movie }))
            }
        });
    }

    _getSliderMousLeave(slideContent) {
        slideContent.addEventListener('mouseleave', event => {
            const target = event.target
            const $dialogWrap = target.querySelector('.dialog-wrap')
            
            target.removeChild($dialogWrap)
        })
    }

    _getSliderClick(slideContent, imgurl, { movie }) {
        slideContent.addEventListener('click', event => {
            if (!this.DOM.mainBanner.classList.contains('full')) {
                // this.DOM.mainBanner.classList.add('full')
                this.DOM.mainBanner.insertAdjacentHTML('afterbegin', dialog.FullDialog(event, imgurl, { movie }))
                
                const $closeBtn = this.$element.querySelector('.close-btn')
                this._getSliderClickClose($closeBtn)
            }
        })
    }

    _getSliderClickClose(closeBtn) {
        closeBtn.addEventListener('click', () => {
            const $dialogWrap = this.DOM.mainBanner.querySelector('.dialog-wrap')
            this.DOM.mainBanner.removeChild($dialogWrap)
        })
    }

    _render (element, movieList) {
        while (element.hasChildNodes()) {
            element.removeChild(element.lastChild)
        }

        movieList.forEach((movie, index) => {
            const isLast = (index === movieList.length - 1)

            element.insertAdjacentHTML('beforeend', `
                <div class="slide-content" data-id="${movie.id}">
                    <a href="/">
                        <img class="lazy-load" data-src=${tmdb.BASE_IMAGE_URL + movie.backdrop_path} />
                    </a>
                </div>
            `)

            // 이미지 지연 로딩
            if (isLast) this.lazyLoad(this.$element.querySelectorAll('.lazy-load'))

            const children = element.children
            const slideContent = children[children.length - 1]
            const imgurl = tmdb.BASE_IMAGE_URL + movie.backdrop_path

            this._getSliderMouseEnter(slideContent, imgurl, { movie })
            this._getSliderMousLeave(slideContent)
            this._getSliderClick(slideContent, imgurl, { movie })
        })
    }

    // 영화 인기 순위 API
    async _requestPopular() {
        await tmdb.getPopularMovie()
        .then(data => {
            // 인기가 많은 순서대로 정렬
            const movieList = data.results.sort((a, b) => b.popularity - a.popularity)
            const popular = this.$element.querySelector('.popular')
            this._render(popular, movieList)

            // this.DOM.slideList.style.width = this.slideWidth * movieList.length + '%'

            // movieList.forEach((movie, index) => {
            //     const isLast = (index === movieList.length - 1)

            //     const $sliderItem = document.createElement('div')
            //     $sliderItem.className = 'slide-content'
            //     $sliderItem.innerHTML = `<img class="lazy-load" data-src=${tmdb.BASE_IMAGE_URL + movie.backdrop_path} />`
            //     this.DOM.slideList.appendChild($sliderItem)
            //     $sliderItem.setAttribute('data-id', movie.id)

            //     // 마우스 hover 했을 때 영화에 대한 자세한 정보를 담고 있는 부분
            //     const $sliderItemDetail = document.createElement('div')
            //     $sliderItemDetail.className = 'slider-detail'
            //     $sliderItem.appendChild($sliderItemDetail)

            //     // original_title, overview, release_date
            //     const movieTitle = document.createElement('h4')
            //     const movieOverview = document.createElement('p')
            //     const movieReleaseDate = document.createElement('span')

            //     movieTitle.innerHTML = movie.original_title
            //     movieOverview.innerHTML = movie.overview
            //     movieReleaseDate.innerHTML = movie.release_date

            //     $sliderItemDetail.appendChild(movieTitle)
            //     $sliderItemDetail.appendChild(movieOverview)
            //     $sliderItemDetail.appendChild(movieReleaseDate)

            //     $sliderItem.addEventListener('mouseenter', () => {
            //         $sliderItemDetail.classList.add('hover')
            //         // this._videoPlay($sliderItemDetail[index].getAttribute('data-id'))
            //     })
            //     $sliderItem.addEventListener('mouseleave', () => {
            //         $sliderItemDetail.classList.remove('hover')
            //     })

            //     // 이미지 지연 로딩
            //     if (isLast) this.lazyLoad(this.$element.querySelectorAll('.lazy-load'))
            // })
            
            // this.DOM.slideContents = document.querySelectorAll('.slide-content')
            // const slideLength = this.DOM.slideContents.length

            // let currentIndex = 0
            // if (currentIndex === 0) {
            //     this.DOM.prevBtn.classList.add('hide')
            // }

            // // next Button
            // this.DOM.nextBtn.addEventListener('click', () => {
            //     if (currentIndex <= slideLength - 1) {
            //         this.DOM.prevBtn.classList.remove('hide')
            //         this.DOM.slideList.style.transform = 'translate3d(-' + (5 * (currentIndex + 1)) + '%, 0px, 0px)'
            //     }
                
            //     if (currentIndex == slideLength - 2) {
            //         currentIndex = 0
            //     } else {
            //         currentIndex++
            //     }

            //     console.log(currentIndex, slideLength - 1)
            // })
            
            // // prev Button
            // this.DOM.prevBtn.addEventListener('click', () => {
            //     if (currentIndex > 0) {
            //         this.DOM.slideList.style.transform = 'translate3d(-' + (5 * (currentIndex - 1)) + '%, 0px, 0px)'
            //     }
                
            //     if (currentIndex == 0) {
            //         currentIndex = slideLength - 1
            //     } else {
            //         currentIndex--
            //     }
                
            //     console.log(currentIndex, slideLength - 1)
            // })
        })
        .catch(err => {
            console.log('Fetch Error', err);
        })
    }

    async _renderGenre() {
        await tmdb.getGenre(16)
        .then(data => {
            const movieList = data.results.sort((a, b) => b.popularity - a.popularity)
            const kids = this.$element.querySelector('.kids')
            this._render(kids, movieList)
        })
    }

    // Youtube에서 제공하는 영화 예고편 요청
    _requestVideo(id) {
        const VIDEO_URL = 'https://www.youtube.com/embed/'
        tmdb.getVideo(id)
        .then(data => {
            if (data.results.length > 0) {
                const youtubeId = data.results[0].key
                this.DOM.mainBanner.innerHTML += `<iframe width="100%" height="100%" src="${VIDEO_URL + youtubeId}?autoplay=1"></iframe>`; 
            } else {
                this.DOM.mainBanner.innerHTML += `<div>재생할 예고편이 없습니다.</div>`;
            }
        })
        .catch(error => {
            console.log(error)
        })
    }
}

export default Home