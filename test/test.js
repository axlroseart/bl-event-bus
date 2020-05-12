// import EventBus from '../index'
const EventBus = require('../index')

// console.log('==> EventBus:', EventBus)

let myEvent = new EventBus()

function offTest(...args) {
  console.log('==> 解绑事件测试', args)
}

// 测试事件监听 - 方法1
myEvent.on('click', (args) => {
  console.log('==> click triggered:', args)
})
// 测试事件监听 - 方法2
myEvent.on('click', offTest)

// 测试只执行一次的事件
myEvent.once('blabla', (args) => {
  console.log('==> just once:', args)
})

// 测试事件触发
myEvent.emit('click', 1, 2, 3)

// 测试只执行一次的事件
myEvent.emit('blabla', 'once')


// 测试事件解除监听，不带callback则清空所有事件方法
// myEvent.off('click')
// 测试事件解除监听，只解除offTest这个方法
myEvent.off('click', offTest)

// 再次触发，则只执行方法1
myEvent.emit('click', 2)

// 测试只执行一次的事件是否会执行第二次
myEvent.emit('blabla', 'twice')


// console.log('==> events:', myEvent._cache)
