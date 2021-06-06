import View from './view'
import template from '../../components/home.html'
import { tmdb } from '../api/index'
import Swiper from '../lib/swiper'
import SharedTransition from '../lib/shared-transition'
import { addStyle, emptyStyle, emptyChild, addClass, removeClass } from '../helper/utils'

class Home extends View {
    constructor() {
        super({ // 이걸로 부모에 접근할 수 있다. (부모 클래스 constructor에 접근하도록 한다.)
            innerHTML: template,
            className: 'home'
        })

        this.DOM = {
            slides: this.$element.querySelector('.slides'),
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

    // small preview의 위치
    _setSmallPreviewPos(event) {
        const root = document.documentElement
        const fromEl = event.target
        const toEl = this.$refs.preview
        const metaEl = this.$refs.metadata
        const bounds = fromEl.getBoundingClientRect()

        const winW = window.innerWidth  // 브라우저 창의 틀은 빼고 스크롤 크기를 포함한 크기
        const width = bounds.width * 1.5 // width를 1.5만큼 늘리기
        let height = bounds.height * 1.5 // height를 1.5만큼 늘리기
        
        height = height + metaEl.clientHeight // metaEl의 내부 높이를 픽셀로 반환

        let top = bounds.top - (height - bounds.height) / 2
        top = top + root.scrollTop

        let left = bounds.left - (width - bounds.width) / 2
        if (left <= 0) {
            left = bounds.left
        } else if ((left + width) >= winW) {
            left = bounds.right - width
        }

        addStyle(toEl, {
            position: 'absolute',
            left: 0,
            top: 0,
            transform: `translate(${Math.ceil(left)}px, ${Math.ceil(top)}px)`,
            width: `${Math.ceil(width)}px`,
            height: `${Math.ceil(height)}px`
        })
    }

    async _showSmallPreview(event) {
        const root = document.documentElement
        const fromEl = event.target
        const toEl = this.$refs.preview
        const id = fromEl.closest('[data-id]').dataset.id
        const detailData = await tmdb.getMovieDetails(id)
        
        // metadata 정보 설정해주기
        this._setSmallPreviewMetadata(detailData)
        // preview 위치 설정
        this._setSmallPreviewPos(event)

        const sharedTransition = new SharedTransition({
            from: fromEl,
            to: toEl
        })
        
        const smallImageSrc = fromEl.getAttribute('src') // mouseenter한 img의 src 가져오기
        const largeImageSrc = smallImageSrc.replace('w500', 'original') // 고화질 img로 변경

        // 원래 위치로 이동시켜주기
        const reverse = () => {
            sharedTransition.reverse()
        }

        const showPreview = () => {
            this._showPreview(toEl)
            toEl.removeEventListener('mouseleave', reverse)
        }

        const beforePlayStart = () => {
            // 저화질 이미지 로드
            this.$refs.smallImage.src = smallImageSrc

            
            toEl.parentNode.classList.add('small-expanded')
            toEl.addEventListener('mouseleave', reverse, { once: true })
        }
        
        const afterPlayEnd = () => {
            // 고화질 이미지 로드
            this.$refs.largeImage.src = largeImageSrc

            // Full preview 띄워주기
            this.$refs.details.addEventListener('click', showPreview, { once: true })

            // 동영상 로드
            this._loadYouTubeVideo(detailData.videos)
        }

        const beforeReverseStart = () => {
            toEl.parentNode.classList.remove('small-expanded')
            toEl.parentNode.classList.remove('expanded')
        }

        const afterReverseEnd = () => {
            this.$refs.smallImage.src = ''
            this.$refs.largeImage.src = ''

            if (this.DOM.slides.style.position === 'fixed') {
                emptyStyle(this.DOM.slides)
                root.scrollTop = this._beforeScrollTop
            }

            emptyChild(this.$refs.average)
            emptyChild(this.$refs.runtime)
            emptyChild(this.$refs.releaseDate)
            emptyChild(this.$refs.genres)
            emptyChild(this.$refs.youtubeVideo)

            this.$refs.youtubeVideo.insertAdjacentHTML('beforeend', '<div id="player"></div>')
            this.$refs.details.removeEventListener('click', showPreview)
            this._smallSharedTransition = null
        }

        sharedTransition.on('beforePlayStart', beforePlayStart)
        sharedTransition.on('afterPlayEnd', afterPlayEnd)
        sharedTransition.on('beforeReverseStart', beforeReverseStart)
        sharedTransition.on('afterReverseEnd', afterReverseEnd)
        sharedTransition.play()

        this._smallSharedTransition = sharedTransition
    }
    
    // Full preview
    async _showPreview(element) {
        const root = document.documentElement
        const fromEl = element
        const toEl = element
        const close = this.$refs.previewClose

        // preview의 위치와 움직일 preview-inner를 저장해주어야하기 때문에 값을 넘겨주어야 한다.
        const sharedTransition = new SharedTransition({
            from: fromEl,
            to: toEl
        })

        this._beforeScrollTop = root.scrollTop

        const reverse = () => {
            this._smallSharedTransition.reverse()
        }

        // click한 이미지의 src 넘겨주기
        const beforePlayStart = () => {
            toEl.parentNode.classList.remove('small-expanded')
            toEl.parentNode.classList.add('expanded')
            emptyStyle(toEl)

            addStyle(this.DOM.slides, {
                position: 'fixed',
                top: `${-this._beforeScrollTop}px`,
                paddingTop: '68px' 
            })

            console.log(this.$refs.overlay)
            addClass(this.$refs.overlay, 'show-video')
        }
        
        const afterPlayEnd = () => {
            emptyStyle(this.DOM.slides)

            close.addEventListener('click', reverse, { once: true })
        }

        sharedTransition.on('beforePlayStart', beforePlayStart)
        sharedTransition.on('afterPlayEnd', afterPlayEnd)
        sharedTransition.play()
    }

    // https://developers.google.com/youtube/iframe_api_reference?hl=ko
    _loadYouTubeScript () {
        return new Promise((resolve, reject) => {
            // Load the IFrame Player API code asynchronously.
            const firstScriptTag = document.getElementsByTagName('script')[0]
            const tag = document.createElement('script')
            tag.onload = () => window.YT.ready(resolve)
            tag.onerror = reject
            tag.src = 'https://www.youtube.com/player_api'

            firstScriptTag.parentNode.insertBefore(tag, firstScriptTag)
        })
    }

    // youtube 동영상 로드하기
    async _loadYouTubeVideo(videos) {
        const { results } = videos
        const youtubeVideo = this.$refs.youtubeVideo
        
        if (!results.length) return
        
        if (!window.YT) {
            await this._loadYouTubeScript()
        }

        const video = results.find(v => v.type === 'Teaser' || v.type === 'Trailer')
        if (!video) return

        const player = new window.YT.Player('player', {
            width: '100%',
            height: '100%',
            videoId: video.key,
            playerVars: {
                autoplay: 1,
                mute: 1,
                autohide: 1,
                modestbranding: 1,
                rel: 0,
                showinfo: 0,
                controls: 0,
                disablekb: 1,
                enablejsapi: 1,
                iv_load_policy: 3
            },
            events: {
                onReady: (event) => {
                    event.target.playVideo()
                },

                onStateChange: (event) => {
                    if (event.data === YT.PlayerState.PLAYING) {
                        addClass(youtubeVideo, 'show-video')
                    }
        
                    if (event.data === YT.PlayerState.UNSTARTED) {
                        removeClass(youtubeVideo, 'show-video')
                    }
                }
            }
        })
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

    _setSmallPreviewMetadata(data) {
        const average = data.vote_average * 10
        const runtime = data.runtime
        const releaseDate = data.release_date
        const genres = data.genres
        
        this.$refs.average.insertAdjacentHTML('beforeend', `${average}% 일치`) // 이거 왜 여러개?
        this.$refs.runtime.insertAdjacentHTML('beforeend', `${runtime}분`)
        this.$refs.releaseDate.insertAdjacentHTML('beforeend', `${releaseDate}`)
        this.$refs.genres.insertAdjacentHTML('beforeend', genres.map(item => `<span>${item.name}</span>`).join('')) // join('')을 사용해서 콤마 지우기
    }

    // Youtube에서 제공하는 영화 예고편 요청
    _requestVideo(id) {
        const VIDEO_URL = 'https://www.youtube.com/embed/'
        tmdb.getVideo(id)
        .then(data => {
            if (data.results.length > 0) {
                const youtubeId = data.results[0].key
                this.DOM.slides.innerHTML += `<iframe width="100%" height="100%" src="${VIDEO_URL + youtubeId}?autoplay=1"></iframe>` 
            } else {
                this.DOM.slides.innerHTML += `<div>재생할 예고편이 없습니다.</div>`
            }
        })
        .catch(error => {
            console.log(error)
        })
    }
}

export default Home