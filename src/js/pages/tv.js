import View from './view'

const template = `
    <h2>Tv</h2>
    <p>여기는 Tv 입니다.</p>
`

class Tv extends View {
    constructor() {
        super({
            innerHTML: template,
            className: 'Tv'
        }) // 이걸로 부모에 접근할 수 있다. (부모 클래스 constructor에 접근하도록 한다.)
    }

}

export default Tv