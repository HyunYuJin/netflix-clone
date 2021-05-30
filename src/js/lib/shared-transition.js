import EventEmitter from 'events'

class SharedTransition extends EventEmitter{
    constructor(config) {
        super()

        this.DOM = {
            from: config.from,
            to: config.to
        }

        this._isAnimating = false
    }

    play() {
        if (this._isAnimating) return

        this._isAnimating = true

        this.emit('beforePlayStart')

        this._setup()

        const fromPos = this._pos.from
        const toPos = this._pos.to

        this.DOM.to.style.position = 'absolute'
        this.DOM.to.style.left = 0
        this.DOM.to.style.top = 0
        this.DOM.to.transition = 'none'
        this.DOM.to.opacity = 1
        this.DOM.to.style.transform = `translate(${fromPos.x}px, ${fromPos.y}px) scale(${fromPos.scale})`

        this._animate()
        .then(() => {
            this._isAnimating = false

            this.emit('afterPlayEnd')
        })
    }

    // mouseleave할 때 실행되는 함수
    reverse() {
        this.emit('beforeReverseStart')
        console.log('reverse')
    
        if (!this._isAnimating) this._setup()

        const fromPos = this._position.from
        const toPos = this._position.to

        this.DOM.to.style.position = 'absolute'
        this.DOM.to.style.left = 0
        this.DOM.to.style.top = 0
        this.DOM.to.style.transform = `translate(${toPos.x}px, ${toPos.y}px) scale(${toPos.scale})`

        this._animate()
        .then(() => {
            this._isAnimating = false

            this.emit('afterReverseEnd')
        })
    }

    _animate() {
        return new Promise((resolve, reject) => {
          const toEl = this.DOM.to
          console.log('_animate')
    
          // transition이 완료된 이후에 발생하는 이벤트, transition 완료를 감지
          toEl.addEventListener('transitionend', resolve, { once: true })
        })
    }    

    _setup() {
        // 문서의 루트 요소를 나타내는 Element를 반환
        const root = document.documentElement

        this._points = {
            from: this._getRect(this.DOM.from),
            to: this._getRect(this.DOM.to)
        }

        const fromPoint = this._points.from
        const toPoint = this._points.to

        this._pos = {
            from: {
                scale: fromPoint.width / toPoint.width,
                x: (fromPoint.width / 2) - (toPoint.width / 2) + fromPoint.left,
                y: fromPoint.top + root.scrollTop
            },
            to: {
                scale: 1,
                x: toPoint.left,
                y: toPoint.top + root.scrollTop 
            }
        }
    }

    _getRect(element) {
        // getBoundingClientRect: 요소의 위치 값 알아내기
        // 출력 결과: top, bottom, left, right, width, height, x, y
        const { width, height, left, top } = element.getBoundingClientRect()

        return { width, height, left, top }
    }
}

export default SharedTransition