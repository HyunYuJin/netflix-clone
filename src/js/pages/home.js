import View from './view'

const template = `
    <h2>Home</h2>
    <p>여기는 Home 입니다.</p>
    <a href="/tv">TV로 이동</a>
`

class Home extends View {
    constructor() {
        super({
            innerHTML: template,
            className: 'home'
        }) // 이걸로 부모에 접근할 수 있다. (부모 클래스 constructor에 접근하도록 한다.)
        
        // this.$element.querySelector('h2')
        // this.$element.querySelector('p')
    }

    created() {
        console.log('created')
    }

    mounted() {
        console.log('mounted')
    }

    destroyed() {
        console.log('destroyed')
    }
}

export default Home