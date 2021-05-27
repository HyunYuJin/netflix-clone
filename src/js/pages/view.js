// Super(부모) Class
// 중복을 방지하기 위해 (Global)

class View {
    constructor(attr) {
        this.$refs = {}
        this.$element = this._createElement(attr)
    }

    lazyLoad(image) {
        const images = Array.from(image)

        // target element가 화면에 나타났는지를 감지
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                // 변화가 생기면 관찰자는 callback을 실행한다.
                entries.forEach((entry, index) => {
                    if (entry.isIntersecting) {
                        const img = entry.target
                        img.src = img.dataset.src

                        setTimeout(() => img.classList.add('loaded'), 75 * (index - 1))
                        // 관찰 중지
                        imageObserver.unobserve(img)
                    }
                })
            })

            // 관찰할 대상(요소) 등록
            images.forEach((img) => imageObserver.observe(img));
        } else {
            images.forEach((img) => {
                img.src = img.dataset.src
                img.classList.add('loaded')
            })
        }
    }

    // class를 제품이라 생각하면 사용자한테 내보여서는 안되는 것들 (프라이빗한 메소드)
    // 라이브러리를 만든 사람만 신경쓰는 메소드
    _createElement(attr) {
        const div = document.createElement('div')

        if (attr) {
            const keys = Object.keys(attr)

            // 요소가 늘어날지라도 동적으로 생성해준다.
            keys.forEach((key) => {
                div[key] = attr[key]
            })
        }

        const refs = Array.from(div.querySelectorAll('[ref]'))

        for (const elem of refs) {
            const key = elem.getAttribute('ref')
            this.$refs[key] = elem

            elem.removeAttribute('ref')
        }

        return div
    }
}

export default View