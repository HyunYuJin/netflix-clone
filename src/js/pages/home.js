import View from './view'
import template from '../../components/home.html'
import { API_URL, API_KEY } from '../api/index'

class Home extends View {
    constructor() {
        super({
            innerHTML: template,
            className: 'home'
        }) // 이걸로 부모에 접근할 수 있다. (부모 클래스 constructor에 접근하도록 한다.)

        this.$slidContainer = this.$element.querySelector('.slide-container')
        this.$slider = this.$element.querySelector('.slider')
        this.$prevBtn = this.$element.querySelector('.prevBtn')
        this.$nextBtn = this.$element.querySelector('.nextBtn')
        this.slideCount = 0
        this.currentIndex = 0

        this.totalSlider = null
        this.totalLength = 0
        this.slideWidth = 400
    }

    created() {
        console.log('created')
        
        this._requestPopular()
    }

    mounted() {
        console.log('mounted')
    }

    destroyed() {
        console.log('destroyed')
    }

    // 영화 인기 순위를 불러오는 API
    _requestPopular() {
        fetch(API_URL + '/movie/popular?api_key=' + API_KEY)
        .then(res => {
            return res.json()
        }).then(data => {
            const result = data.results.sort((a, b) => {
                return b.popularity - a.popularity
            })

            this.totalSlider = result
            
            for (let i = 0; i < this.totalSlider.length; i++) {
                const $sliderItem = document.createElement('div')
                $sliderItem.className = 'slider-item'
                this.$slider.appendChild($sliderItem)

                $sliderItem.style.width = this.slideWidth + 'px'
                $sliderItem.style.backgroundImage = `url('https://image.tmdb.org/t/p/w500/${this.totalSlider[i].backdrop_path}')`;
            }
            
            const $slideContents = document.querySelectorAll('.slider-item')
            this.slideCount = $slideContents.length
            this.$slider.style.width = this.slideWidth * (slideLen) + 'px'


        }).catch(err => {
            console.log('Fetch Error', err)
        });

    }
}

export default Home