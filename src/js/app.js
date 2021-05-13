import '../styles/main.scss'
import Router from './router/router'
import routes from './router/routes'

// DOM 구분해주기
const DOM = {
    container: document.getElementById('container'),
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
    const target = event.target
    const tagName = target.tagName.toUpperCase()
    
    if (tagName === 'A') {
        event.preventDefault()
    
        const path =event.target.getAttribute('href')
        router.go(path)
    }

}

init()