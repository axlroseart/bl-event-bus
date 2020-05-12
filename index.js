/**
 * 事件 - 基于观察者模式的管理类库
 * 2020-05-09
 * created by ryan
 * .on('myFunc', func) - 监听事件'myFunc'，事件触发的时候调用func
 * .emit('myFunc', arg1, arg2, arg3, .... argN) - 触发‘myFunc’，并且把参数群体传递给事件处理函数(即上面的func)
 * .off('myFunc', func) - 停止监听事件'myFunc'，触发停止监听的时候，调用func
 */

(function(root, factory) {
  if(typeof exports === 'object' && typeof module === 'object') {
    module.exports = factory()
  }
  else if (typeof define === 'function' && define.amd) {
    define('EventBus', [], factory)
  }
  else if (typeof exports === 'object') {
    exports['EventBus'] = factory()
  }
  else {
    root['EventBus'] = factory()
  }
})(this, function() {
  class EventBus {

    constructor() {
      // 放置事件的数据体，使用对象（字典），方便查找
      this._cache = {}
    }
  
    /**
     * 事件绑定
     * @param {string} type 要绑定（监听）的方法名
     * @param {object} callback  事件触发时要执行的方法
     */
    on(type, callback) {
      // console.log('==> 绑定绑法callback:', callback)
      let functions = (this._cache[type] = this._cache[type] || [])
      // 写入监听回调方法
      functions.push(callback)
      // 返回Event类本事目的是为了链式调用: x.on().emit().off()
      return this
    }
  
    /**
     * 事件触发
     * @param {string} type 要触发的方法名
     * @param  {...any} data 给方法传递的参数
     */
    emit(type, ...args) {
      // 根据传递进来的方法名，拿到要触发的方法
      let functions = this._cache[type]
      // 确保格式正确，然后依次执行绑定的方法
      if (Array.isArray(functions)) {
        functions.forEach(o => {
          o ? o(args) : !0
        })
      }
      return this
    }
  
    /**
     * 只需要执行一次订阅的事件，即执行完之后解绑
     * @param {string} type 想要解除绑定的方法名
     * @param {object} callback 
     */
    once(type, callback) {
      let self = this
      // 声明代理函数，处理只执行一次的逻辑
      function _on() {
        self.off(type, _on)
        callback.apply(self, arguments)
      }
      // 绑定执行这个代理函数
      self.on(type, _on)
      return self
    }
  
    /**
     * 事件解绑
     * @param {string} type 要取消监听（绑定）的方法名
     * @param {object} callback 要解绑的具体方法
     */
    off(type, callback) {
      // console.log('==> 将要解除的事件：', callback)
      // 判断callback是否为对象数组，然后依次执行
      if (Object.prototype.toString.call(callback) === '[object Array]' && callback) {
        callback.forEach(o => {
          this.off(type, o)
        })
        return this
      }
      // 取消绑定
      // 新建对象用作数据中转
      let obj = this._cache
      // 当前要解绑的事件对应的具体方法的集合
      let eventArr = obj[type]
      // 新建空数据用来存放判断因子
      let events = []
      if (eventArr && callback) {
        // 过滤出不需要取消的函数
        events = eventArr.filter((o) => {
          return o !== callback
        })
      }
      // console.log('==> events:', events)
      // 如果没传callbak，或者都需要取消，则整体删除事件的字典
      events.length > 0 ? obj[type] = events : delete obj[type]
      return this
    }
  }

	return EventBus
})


