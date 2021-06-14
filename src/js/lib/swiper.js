import EventEmitter from 'events'

class Swiper extends EventEmitter {
    constructor(element, options) {
        super()

        this.DOM = { element: element }
        this.DOM.navigation = options.navigation || {}
        this.DOM.slides = Array.from(this.DOM.element.children)

        this.slideGroupCount = this._calcSlideGroup()
        this.slideGroupTotal = Math.ceil(this.DOM.slides.length / this.slideGroupCount)

        this.current = 0
        this.started = false
        this.slideWidth = 0
        this.isAnimating = false

        this._init()
    }

    // 자주 사용하는건 get, set으로 빼기
    get slideWidth() {
        return !this.started ? 0 : (100 / this.slideGroupCount)
    }

    set slideWidth(value) {
        return value
    }

    _init() {
        this._initEvents()
    }

    _initEvents() {
        this.DOM.navigation.prevEl.addEventListener('click', this.prev.bind(this))
        this.DOM.navigation.nextEl.addEventListener('click', this.next.bind(this))
    }

    _navigate(direction) {
        // 애니메이션 중에는 실행되지 않도록 처리해준다.
        if (this.isAnimating) {
            return
        }

        this.isAnimating = true

        let translateX = 0

        if (direction === 'next') {
            this.current = this.current < this.slideGroupTotal - 1 ? ++this.current : 0
            // 애니메이션 한번도 시작하지 않았으면 100% 했으면 200%
            translateX = this.slideWidth + (!this.started ? 100 : 200)
        } else {
            this.current = this.current > 0 ? --this.current : this.slideGroupTotal - 1
            translateX = this.slideWidth
        }

        this._animation(translateX)
        .then(() => {
            this._setInfiniteSwipe(!this.started ? '' : direction)
            this.emit('update', this.current)
            this.isAnimating = false
        })
    }

    _animation(translateX) {
        // 시점 맞춰주기
        return new Promise((resolve, reject) => {
            const element = this.DOM.element
            // left 이런거 건드리는건 성능에 안좋기 때문에 translate를 많이 사용한다.
            // translateX는 paint 과정만 있기 때문에 굉장히 빠르다.
            element.style.transition = '0.75s'
            element.style.transform = `translateX(-${ translateX }%)`
            
            // 계속 이벤트 주는거 false 될때까지 막아준다.
            element.addEventListener('transitionend', resolve, { once: true }) // 바로 removeEventListener를 해준다.
        })
    }

    _setInfiniteSwipe(direction) {
        const { element, slides } = this.DOM

        if (!direction) {
            const slide = slides[slides.length - 1]
            element.prepend(slide)

            this.started = true
            
            this.emit('started')
        } else {
            if (direction === 'next') {
                const slides = this._getFirstGroupSlides()
                element.append(...slides)
            } else {
                const slides = this._getLastGroupSlides()
                element.prepend(...slides)
            }

            const translateX = 100 + this.slideWidth
            element.style.transition = ''
            element.style.transform = `translateX(-${translateX}%)`
        }

        // DOM의 순서가 다르기 때문에 재할당을 해준다.
        this.DOM.slides = Array.from(this.DOM.element.children)
    }

    _getFirstGroupSlides() {
        const slides = this.DOM.slides
        return slides.filter((slide, index) => index < this.slideGroupCount)
    }

    _getLastGroupSlides() {
        const slides = this.DOM.slides.reverse()
        return slides.filter((slide, index) => index < this.slideGroupCount)
    }

    _calcSlideGroup() {
        // 전체 width -> 이만큼 슬라이드를 넘겨줄 것이다.
        const totalWidth = this.DOM.element.clientWidth

        // 슬라이드 하나하나의 크기 -> 가장 처음에 next하고 다시 prev하면 바로 뒤에 슬라이드 한장이 붙는다. 
        const slideWidth = this.DOM.slides[0].clientWidth

        console.log(Math.round(totalWidth / slideWidth))

        return Math.round(totalWidth / slideWidth)
    }

    next() {
        this._navigate('next')
    }

    prev() {
        this._navigate('prev')
    }

}

export default Swiper