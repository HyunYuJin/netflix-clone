import '../assets/styles/main.scss'
import Router from './router/router'
import routes from './router/routes'

// DOM 구분해주기
const DOM = {
    container: document.getElementById('container')
    // navLinks: document.querySelectorAll('.nav-links > a')
}
// 이런식으로 구분해주기도 한다.
// const $container = document.getElementById('container');

let router = null // Object는 보통 null로 초기화

function init() {
    initRouter()
    initEvents()
}

function initRouter() {
    router = new Router({
        initialRoute: '/',
        entry: DOM.container,
        routes: routes
    })

    // router.go()
    // router.back()
}

function initEvents() {
    // Array.from(DOM.navLinks).forEach(link => link.addEventListener('click', onNavLink))
    document.addEventListener('click', onRouteLinks)
}

// function onNavLink(event) {
function onRouteLinks(event) {
    // 이벤트 위임하기
    const target = event.target // 선택한 DOM element를 가져온다.
    const tagName = target.tagName.toUpperCase() // 때에 따라 소문자로 가져오는 경우도 있기 때문에 모든 element를 대문자로 바꿔주는 작업을 한다.
    
    if (tagName === 'A') {
        event.preventDefault() // 이벤트 전파를 막아준다. - 여기서는 a 태그에 기본적으로 걸려있는 이벤트를 막아주는 역할을 한다. 페이지 새로 고침되는 것을 막아주는 것이지!
    
        const path =event.target.getAttribute('href')
        router.go(path)
    }

}

init()