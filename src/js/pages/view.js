// Super(부모) Class
// 중복을 방지하기 위해 (Global)

class View {
    constructor(attr) {
        this.$element = this._createElement(attr)
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
                // div.innerHTML = attr.innerHTML
                // div.className = attr.className
            })
        }
        return div
    }
}

export default View