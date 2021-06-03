import View from './view'
import template from '../../components/home.html'
import { tmdb } from '../api/index'
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
                            <div class="slide-thumbnail">
                                <img class="lazy-load" data-src=${tmdb.BASE_IMAGE_URL + movie.backdrop_path} />
                            </div>
                        </a>
                    </div>
                `)
                
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

            let enterPreview = 0

            const mouseenterFn = (event) => {
                enterPreview = setTimeout(() => {
                    this._showSmallPreview(event)
                }, 400)
            }

            const mouseleaveFn = (event) => {
                if (enterPreview) clearTimeout(enterPreview)
            }

            // 모든 이미지에 mouseenter, mouseleave 이벤트 걸어주기
            images.forEach(item => {
                item.addEventListener('mouseenter', mouseenterFn)
                item.addEventListener('mouseleave', mouseleaveFn)
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
        const smallImageSrc = fromEl.getAttribute('src') // mouseenter한 img의 src 가져오기
        const largeImageSrc = smallImageSrc.replace('w500', 'original') // 고화질 img로 변경
        // const bounds = fromEl.getBoundingClientRect()

        const id = fromEl.closest('[data-id]').dataset.id
        const detailData = await tmdb.getMovieDetails(id)

        // metadata 정보 설정해주기
        this._setSmallPreviewMetadata(detailData)

        const sharedTransition = new SharedTransition({
            from: fromEl,
            to: toEl
        })

        // 원래 위치로 이동시켜주기
        const reverse = () => {
            sharedTransition.reverse()
        }

        const showPreview = () => {
            this._showPreview(toEl)
            // 1. 왜 여기서 해제해주고
            toEl.removeEventListener('mouseleave', reverse)
        }

        const beforePlayStart = () => {
            // 저화질 이미지 로드
            this.$refs.smallImage.src = smallImageSrc

            toEl.parentNode.classList.add('small-expanded')
            // 2. 여기서 다시 걸어주지?
            toEl.addEventListener('mouseleave', reverse, { once: true })
        }
        
        const afterPlayEnd = () => {
            // 고화질 이미지 로드
            this.$refs.largeImage.src = largeImageSrc
            this.$refs.details.addEventListener('click', showPreview, { once: true })
        }

        const beforeReverseStart = () => {
            toEl.parentNode.classList.remove('small-expanded')
        }

        const afterReverseEnd = () => {
            this.$refs.smallImage.src = ''
            this.$refs.largeImage.src = ''
        }

        sharedTransition.on('beforePlayStart', beforePlayStart)
        sharedTransition.on('afterPlayEnd', afterPlayEnd)
        sharedTransition.on('beforeReverseStart', beforeReverseStart)
        sharedTransition.on('afterReverseEnd', afterReverseEnd)
        sharedTransition.play()
    }
    
    async _showPreview(event) {
        const fromEl = event.target
        const toEl = this.$refs.preview

        // preview의 위치와 움직일 preview-inner를 저장해주어야하기 때문에 값을 넘겨주어야 한다.
        const sharedTransition = new SharedTransition({
            from: fromEl,
            to: toEl
        })

        // click한 이미지의 src 넘겨주기
        const beforePlayStart = () => {
            this.$refs.smallImage.src = fromEl.src
        }
        
        const afterPlayEnd = () => {
            this.$refs.largeImage.src = fromEl.src.replace('w500', 'original')
            // this.$refs.previewClose.addEventListener('click', reverse, { once: true })
        }

        sharedTransition.on('beforePlayStart', beforePlayStart)
        sharedTransition.on('afterPlayEnd', afterPlayEnd)
        sharedTransition.play()
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

    _setSmallPreviewMetadata(data) {
        const average = data.vote_average * 10
        const runtime = data.runtime
        const releaseDate = data.release_date
        const genres = data.genres
        
        this.$refs.average.insertAdjacentHTML('beforeend', `${average}% 일치`)
        this.$refs.runtime.insertAdjacentHTML('beforeend', `${runtime}분`)
        this.$refs.releaseDate.insertAdjacentHTML('beforeend', `${releaseDate}`)
        this.$refs.genres.insertAdjacentHTML('beforeend', genres.map(item => `<span>${item.name}</span>`).join())
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