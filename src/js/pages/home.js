import View from './view'
import template from '../../components/home.html'
import { tmdb } from '../api/index'
import { dialog } from '../../components/dialog'
import Swiper from '../lib/swiper'
import SharedTransition from '../lib/shared-transition'

class Home extends View {
    constructor() {
        super({ // 이걸로 부모에 접근할 수 있다. (부모 클래스 constructor에 접근하도록 한다.)
            innerHTML: template,
            className: 'home'
        })

        this.DOM = {
            mainBanner: this.$element.querySelector('.mainBanner'),
            slide: this.$element.querySelectorAll('.slide'),
            slideInner: this.$element.querySelector('.slide-inner'),
            slideContainer: this.$element.querySelectorAll('.slide-wrapper'),
            slideContents: null
        }
    }

    mounted() {
        this._initDOM()
        this._requestPopular()
        this._renderGenre()
    }

    _initDOM() {
        for (let i = 0; i < this.DOM.slideContainer.length; i++) {
            this.DOM.slideContainer[i].insertAdjacentHTML('beforeend', `
                <div class="slide-content">
                    <a href="/">
                        <div class="init-div">&nbsp;</div>
                    </a>
                </div>
            `)
        }
    }

    _onSliderMouseEnter(imgurl, { movie }, event) {
        let target = event.target

        if (!target.classList.contains('dialog-wrap')) {
            target.insertAdjacentHTML('beforeend', dialog.small(imgurl, { movie }, event))
        }
    }

    _onSliderMousLeave(event) {
        const target = event.target
        const $dialogWrap = target.querySelector('.dialog-wrap')
        
        target.removeChild($dialogWrap)
    }

    _onSliderClick(imgurl, { movie }, event) {
        if (!this.DOM.mainBanner.classList.contains('full')) {
            this.DOM.mainBanner.insertAdjacentHTML('afterbegin', dialog.large(imgurl, { movie }, event))

            const $closeBtn = this.$element.querySelector('.close-btn')
            
            $closeBtn.addEventListener('click', () => {
                this._onSliderClickClose()
            })
        }
    }

    _onSliderClickClose() {
        const $dialogWrap = this.DOM.mainBanner.querySelector('.dialog-wrap')
        this.DOM.mainBanner.removeChild($dialogWrap)
    }

    _render (element, movieList) {
        return new Promise((resolve, reject) => {
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
    
                const children = element.children
                const slideContent = children[children.length - 1]
                const imgurl = tmdb.BASE_IMAGE_URL + movie.backdrop_path
    
                // slideContent.addEventListener('mouseenter', this._onSliderMouseEnter.bind(this, imgurl, { movie }))
                // slideContent.addEventListener('mouseleave', this._onSliderMousLeave.bind(this))
                // slideContent.addEventListener('click', this._onSliderClick.bind(this, imgurl, { movie }))
                
                if (isLast) {
                    this._setupSwipe(element)
                    .then(() => resolve())
                }
            })
        })

    }

    _setupSwipe(element) {
        return new Promise((resolve, reject) => {
            // 이미지 지연 로딩
            const images = Array.from(element.querySelectorAll('[data-src]'))
            this.lazyLoad(images)

            const swiper = new Swiper(element, {
                navigation: {
                    prevEl: element.parentNode.querySelector('.prevBtn'),
                    nextEl: element.parentNode.querySelector('.nextBtn'),
                }
            })

            images.forEach(item=> {
                item.addEventListener('mouseenter', (event) => {
                    setTimeout(() => {
                        this._showSmallPreview(event)
                    }, 200)
                })

                item.addEventListener('mouseleave', (event) => {
                    clearTimeout(0)
                })
            })

            swiper.on('started', () => {
                element.parentNode.classList.add('started')
            })
            
            swiper.on('update', (index) => {
                console.log(swiper.current)
            })

            resolve()
        })
    }

    async _showSmallPreview(event) {
        const fromEl = event.target
        const toEl = this.$refs.preview
        const id = fromEl.closest('[data-id]').dataset.id
        const result = await tmdb.getMovieDetails(id)

        const st = new SharedTransition({
            from: fromEl,
            to: toEl,
            duration: '0.24s'
        })

        const { previewSmall } = this.$refs
        const smallSrc = fromEl.getAttribute('src') // mouseenter한 현재 이미지

        const beforePlayStart = () => {
            toEl.parentNode.classList.add('small-expanded')
            previewSmall.src = smallSrc

            toEl.addEventListener('mouseleave', () => {
                st.reverse()
                console.log('leave??????')
            }, { once: true }) // once: 이벤트를 한번만 호출하고 해제시키는 옵션
        }

        const afterReverseEnd = () => {
            previewSmall.src = ''
      
            toEl.parentNode.classList.remove('small-expanded')
        }

        st.on('beforePlayStart', beforePlayStart)
        st.on('afterReverseEnd', afterReverseEnd)
        st.play()
    }

    // 영화 인기 순위 API
    async _requestPopular() {
        await tmdb.getPopularMovie()
        .then(data => {
            // 인기가 많은 순서대로 정렬
            const movieList = data.results.sort((a, b) => b.popularity - a.popularity)
            const popular = this.$refs.popular
            this._render(popular, movieList)
        })
        .catch(err => {
            console.log('Fetch Error', err);
        })
    }

    async _renderGenre() {
        await tmdb.getGenre(16)
        .then(data => {
            const movieList = data.results.sort((a, b) => b.popularity - a.popularity)
            const kids = this.$refs.kids
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
                this.DOM.mainBanner.innerHTML += `<iframe width="100%" height="100%" src="${VIDEO_URL + youtubeId}?autoplay=1"></iframe>` 
            } else {
                this.DOM.mainBanner.innerHTML += `<div>재생할 예고편이 없습니다.</div>`
            }
        })
        .catch(error => {
            console.log(error)
        })
    }
}

export default Home