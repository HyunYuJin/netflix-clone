# Side Project (Netflix Clone)

### 이벤트 위임
* mouseover - mouseout: 자식 요소 위에 마우스를 over해도 이벤트가 발생한다.
* mouseenter - mouseleave: 바인딩 된 요소에만 이벤트가 발생한다.

#### 이벤트 건거는 반드시 제거하기
* 페이지가 이동되더라도 등록된 이벤트는 자동으로 제거되지 않고 계속해서 돌아가기 때문에 해제해주지 않으면 성능에 좋지 않다.

### 스크롤 바
* scrollTop: scroll bar 위치

### EventEmitter
Node.js에 내장되어있는 일종의 observer 패턴 구현  

Node.js에는 많은 객체들은 이벤트를 발생시키는데, 이러한 객체들은 event.EventEmitter라는 인스턴스를 이용하고 있다.
* 이벤트를 활용하는 객체에는 해당 이벤트가 발생할 때 대응하여 동작하는 **콜백 함수**를 가진다.(이러한 함수를 이벤트 리스너라고 부른다.)

#### events 객체의 메소드
* emitter.addListener(event, listener): on() 메소드와 같습니다. 이벤트를 생성하는 메소드
* emitter.on(event, listener): addListener()과 동일. 이벤트를 생성하는 메소드
* emitter.once(event, listener): 이벤트를 한 번만 연결한 후 제거
* emitter.removeListener(event, listener): 특정 이벤트의 특정 이벤트 핸들러를 제거. 이 메소드를 이용해 리스너를 삭제하면 리스너 배열의 인덱스가 갱신되니 주의
* emitter.removeAllListeners([event]): 모든 이벤트 핸들러를 제거
* emitter.emit(eventName[, ...args]): 이벤트를 발생시킨다.

### ||와 &&
* ||: true를 찾을 때까지 넘어간다. true가 없으면 가장 마지막에 있는 항목을 선택
* &&: false를 찾을 때까지 넘어간다. false가 없으면 가장 마지막에 있는 항목을 선택

### Debounce
* 예를 들어 스크롤 이벤트를 주면 스크롤을 할 때마다 우두두두 스크롤이 되고 있는게 보여진다.
* Debounce는 여러번 발생하는 이벤트에서 **가장 마지막 이벤트만을 실행**되도록 만드는 개념이다.
* 250초로 준건 여러 개발자들의 경험을 토대로!

```javascript
let timer = 0
window.addEventListener('scroll', () => {
	clearTimeout(timer)
	timer = setTimeout(() => {
  	console.log(1)
  }, 250)
})
```

참고: https://edu.goorm.io/learn/lecture/557/%ED%95%9C-%EB%88%88%EC%97%90-%EB%81%9D%EB%82%B4%EB%8A%94-node-js/lesson/174362/event-%EB%AA%A8%EB%93%88