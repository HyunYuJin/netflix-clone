class VideoPlayer {
    constructor() {
        this.DOM = {
            video: document.getElementById('video'),
            togglePlay: document.getElementById('togglePlay'),
            togglePlayButton: document.getElementById('togglePlay'),
            playButton: document.getElementById('play'),
            toggleMute: document.getElementById('toggleMute'),
            toggleMuteButton: document.getElementById('toggleMute'),
            muteButton: document.getElementById('muted'),
            videoDetailButton: document.getElementById('videoDetail') 
        }

        this.isPlaying = false
        this.isMuted = false
        this.timer = 0

        this.init()
    }

    init() {
        this.autoPlay()
        this.initEvent()
        // if (document.readyState === 'complete') {
        //     this.autoPlay()
        // }
    }

    initEvent() {
        // window.addEventListener('load', this.autoPlay.bind(this))
        this.DOM.togglePlay.addEventListener('click', this.togglePlay.bind(this))
        this.DOM.toggleMute.addEventListener('click', this.toggleMute.bind(this))
        this.DOM.videoDetailButton.addEventListener('click', (event) => this.showPreview(event))
    }

    autoPlay() {
        // autoplay는 음소거 상태일 때만 가능하다.
        // 음소거하고 자동재생을 할 수 있도록 해야한다.
        this.isMuted = false
        this.isPlaying = true

        this.onUnMuted()
        this.timer = setTimeout(() => {
            this.onPlay()
        }, 250)
    }

    showPreview(event) {
        const root = document.documentElement
        const fromEl = event.target // 상세정보
        const toEl = this.$refs.overlay

        console.log(toEl)
        
        const showDetailPreview = () => {
            this._showPreview(toEl)
        }
    }

    togglePlay() {
        if (this.isPlaying) {
            this.onPause()
        } else {
            this.onPlay()
        }
    }

    onPlay() {
        this.isPlaying = true

        this.DOM.playButton.classList.remove('play')
        this.DOM.playButton.classList.add('pause')
        
        this.DOM.video.play()
    }
    
    onPause() {
        this.isPlaying = false

        this.DOM.playButton.classList.remove('pause')
        this.DOM.playButton.classList.add('play')
        
        this.DOM.video.pause()
    }

    toggleMute() {
        if (this.isMuted) {
            this.onMuted()
        } else {
            this.onUnMuted()
        }
    }

    onMuted() {
        this.isMuted = false

        this.DOM.muteButton.classList.remove('unmuted')
        this.DOM.muteButton.classList.add('muted')

        this.DOM.video.muted = false
    }

    onUnMuted() {
        this.isMuted = true

        this.DOM.muteButton.classList.remove('muted')
        this.DOM.muteButton.classList.add('unmuted')

        this.DOM.video.muted = true
    }
}

export default VideoPlayer