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

    // animation을 시작하는 것 자체
    play() {
        if (this.isAnimating) return
        this.isAnimating = true

        this.emit('beforePlayStart')

        const fromRect = this.DOM.from.getBoundingClientRect()
        const toRect = this.DOM.to.getBoundingClientRect()

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

        const fromPoint = this._position.from
        const toPoint = this._position.to

        // 시작지점 style 지정
        this.DOM.to.style.cssText = `
            position: absolute;
            left: 0;
            top: 0;
            opacity: 1;
            transition: none;
            transform: translate(${fromPoint.x}px, ${fromPoint.y}px) scale(${fromPoint.scale});
        `

        this.DOM.to.offsetHeight

        this._animate(toPoint)
        .then(() => {
            this.isAnimating = false
            this.isExpanded = true // preview가 열림

            this.emit('afterPlayEnd')
        })
    }

    // preview expand 될 때의 animate
    _animate({ x, y, scale }) {
        return new Promise((resolve, reject) => {
          const toEl = this.DOM.to
          toEl.style.transition = '.24s';
          toEl.style.transform = `translate(${x}px, ${y}px) scale(${scale})`
    
          // transition이 완료된 이후에 발생하는 이벤트, transition 완료를 감지
          toEl.addEventListener('transitionend', resolve, { once: true })
        })
    }    

}

export default SharedTransition