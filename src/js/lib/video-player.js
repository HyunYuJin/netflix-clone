class VideoPlayer {
    constructor() {
        this.DOM = {
            video: document.getElementById('video'),
            togglePlay: document.getElementById('togglePlay'),
            togglePlayButton: document.getElementById('togglePlay'),
            playButton: document.getElementById('play'),
            toggleMute: document.getElementById('toggleMute'),
            toggleMuteButton: document.getElementById('toggleMute'),
            muteButton: document.getElementById('muted')
        }

        this.isPlaying = false
        this.isMuted = false

        this.init()
    }

    init() {
        this.initEvent()
    }

    initEvent() {
        this.DOM.togglePlay.addEventListener('click', this.togglePlay.bind(this))
        this.DOM.toggleMute.addEventListener('click', this.toggleMute.bind(this))
    }

    autoPlay() {
        this.isPlaying = true

        let timer = 0
        timer = setTimeout(() => {
            this.onPlay()
        }, 250)
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