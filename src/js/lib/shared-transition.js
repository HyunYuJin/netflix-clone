import EventEmitter from 'events'

class SharedTransition extends EventEmitter{
    constructor(config) {
        super()

        this.DOM = {
            from: config.from,
            to: config.to
        }

        // transition 도중에 큰 작업이 일어나지 않도록 하기 위한 방지
        this.isAnimating = false
        // 완전히 열려있는지 확인
        this.isExpanded = false

        this.init()
    }

    init() {
        console.log('init class SharedTransition')
    }

    play() {
        if (this.isAnimating) return
        this.isAnimating = true

        this.emit('beforePlayStart')

        this._setup()

        const fromPoint = this._position.from
        const toPoint = this._position.to

        console.log(fromPoint, toPoint)
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
        this._rect = {
            from: this._getRect(this.DOM.from),
            to: this._getRect(this.DOM.to)
        }

        const fromRect = this._rect.from
        const toRect = this._rect.to

        this._position = {
            from: {
                scale: fromRect.width / toRect.width,
                x: (fromRect.width / 2) - (toRect.width / 2) + fromRect.left,
                y: fromRect.top
            },
            to: {
                scale: 1,
                x: toRect.left,
                y: toRect.top 
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