import View from './view'
import template from '../../components/home.html'
import dialog from '../../components/dialog.html'
import { tmdb } from '../api/index'

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

    _initEvent() {
        // this.DOM.slideList.addEventListener('mouseleave', (event) => {

        // })
     }

    // 이벤트 위임 방식 사용
    _getSliderMouseEnter(e) {
        const target = e.target
        const child = target.children

        for (let i = 0; i < child.length; i++) {
            child[i].addEventListener('mouseenter', (e) => {
                // e.target.classList.add('hover')
            })
            // child[i].insertAdjacentHTML('beforeend', dialog)
        }
    }

    // 이벤트 위임 방식 사용
    _getSliderMousLeave(e) {
        const target = e.target
        const child = target.children

        for (let i = 0; i < child.length; i++) {
            // dialog-wrap 지우기
            // child[i].removeChild(child[i].lastChild)

            child[i].addEventListener('mouseleave', (e) => {
                // e.target.classList.remove('hover')
            })
        }
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

            slideContent.addEventListener('mouseenter', event => {
                const target = event.target

                target.insertAdjacentHTML('beforeend', `
                    <div class="dialog-wrap">
                        <div class="dialog">
                            <div class="dialog-player-container">
                                <div class="video"></div>
                                <div class="video-img"><img src="${tmdb.BASE_IMAGE_URL + movie.backdrop_path}" alt="${movie.title} 이미지" /></div>
                                <div class="player-action-wrap">
                                    <a href="/"><svg xmlns='http://www.w3.org/2000/svg' class='ionicon' viewBox='0 0 512 512'><title>Caret Forward Circle</title><path d='M238.23 342.43l89.09-74.13a16 16 0 000-24.6l-89.09-74.13A16 16 0 00212 181.86v148.28a16 16 0 0026.23 12.29z' fill="#FFF" stroke='#FFF' /><path d='M448 256c0-106-86-192-192-192S64 150 64 256s86 192 192 192 192-86 192-192z' fill='none' stroke='#FFF' stroke-miterlimit='10' stroke-width='32'/></svg></a>
                                    <div><svg xmlns='http://www.w3.org/2000/svg' class='ionicon' viewBox='0 0 512 512'><title>Add Circle</title><path d='M448 256c0-106-86-192-192-192S64 150 64 256s86 192 192 192 192-86 192-192z' fill='none' stroke='#FFF' stroke-miterlimit='10' stroke-width='32'/><path fill='none' stroke='#FFF' stroke-linecap='round' stroke-linejoin='round' stroke-width='32' d='M256 176v160M336 256H176'/></svg></div>
                                    <div><svg xmlns='http://www.w3.org/2000/svg' class='ionicon' viewBox='0 0 512 512'><title>Thumbs Up</title><path d='M320 458.16S304 464 256 464s-74-16-96-32H96a64 64 0 01-64-64v-48a64 64 0 0164-64h30a32.34 32.34 0 0027.37-15.4S162 221.81 188 176.78 264 64 272 48c29 0 43 22 34 47.71-10.28 29.39-23.71 54.38-27.46 87.09-.54 4.78 3.14 12 7.95 12L416 205' fill='none' stroke='#FFF' stroke-linecap='round' stroke-linejoin='round' stroke-width='32'/><path d='M416 271l-80-2c-20-1.84-32-12.4-32-30h0c0-17.6 14-28.84 32-30l80-4c17.6 0 32 16.4 32 34v.17A32 32 0 01416 271zM448 336l-112-2c-18-.84-32-12.41-32-30h0c0-17.61 14-28.86 32-30l112-2a32.1 32.1 0 0132 32h0a32.1 32.1 0 01-32 32zM400 464l-64-3c-21-1.84-32-11.4-32-29h0c0-17.6 14.4-30 32-30l64-2a32.09 32.09 0 0132 32h0a32.09 32.09 0 01-32 32zM432 400l-96-2c-19-.84-32-12.4-32-30h0c0-17.6 13-28.84 32-30l96-2a32.09 32.09 0 0132 32h0a32.09 32.09 0 01-32 32z' fill='none' stroke='#FFF' stroke-miterlimit='10' stroke-width='32'/></svg></div>
                                    <div><svg xmlns='http://www.w3.org/2000/svg' class='ionicon' viewBox='0 0 512 512'><title>Thumbs Down</title><path d='M192 53.84S208 48 256 48s74 16 96 32h64a64 64 0 0164 64v48a64 64 0 01-64 64h-30a32.34 32.34 0 00-27.37 15.4S350 290.19 324 335.22 248 448 240 464c-29 0-43-22-34-47.71 10.28-29.39 23.71-54.38 27.46-87.09.54-4.78-3.14-12-8-12L96 307' fill='none' stroke='#FFF' stroke-linecap='round' stroke-linejoin='round' stroke-width='32'/><path d='M96 241l80 2c20 1.84 32 12.4 32 30h0c0 17.6-14 28.84-32 30l-80 4c-17.6 0-32-16.4-32-34v-.17A32 32 0 0196 241zM64 176l112 2c18 .84 32 12.41 32 30h0c0 17.61-14 28.86-32 30l-112 2a32.1 32.1 0 01-32-32h0a32.1 32.1 0 0132-32zM112 48l64 3c21 1.84 32 11.4 32 29h0c0 17.6-14.4 30-32 30l-64 2a32.09 32.09 0 01-32-32h0a32.09 32.09 0 0132-32zM80 112l96 2c19 .84 32 12.4 32 30h0c0 17.6-13 28.84-32 30l-96 2a32.09 32.09 0 01-32-32h0a32.09 32.09 0 0132-32z' fill='none' stroke='#FFF' stroke-miterlimit='10' stroke-width='32'/></svg></div>
                                </div>
                            </div>
                
                            <div class="close-btn">
                                <svg xmlns='http://www.w3.org/2000/svg' class='ionicon' viewBox='0 0 512 512'><title>Close</title><path fill='#FFF' stroke='#FFF' stroke-linecap='round' stroke-linejoin='round' stroke-width='32' d='M368 368L144 144M368 144L144 368'/></svg>
                            </div>
                
                            <div class="dialog-info">
                                <span>${movie.title}</span>
                                <div class="dialog-info-detail">
                                    <div>${movie.release_date}</div>
                                    <div>${movie.popularity}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                `)
            })

            slideContent.addEventListener('mouseleave', event => {
                const target = event.target
                const $dialogWrap = target.querySelector('.dialog-wrap')
                // target.removeChild(target.lastChild)
                target.removeChild($dialogWrap)
            })
        })

    }

    // 영화 인기 순위 API
    async _requestPopular() {
        await tmdb.getPopularMovie()
        .then(data => {
            // 인기가 많은 순서대로 정렬
            const movieList = data.results.sort((a, b) => b.popularity - a.popularity)
            console.log(movieList)
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