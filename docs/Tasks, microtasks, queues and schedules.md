# Tasks, microtasks, queues and schedules

前情提要：
```
console.log('script start');

setTimeout(function() {
  console.log('setTimeout');
}, 0);

Promise.resolve().then(function() {
  console.log('promise1');
}).then(function() {
  console.log('promise2');
});

console.log('script end');
```

上面同样的代码，在浏览器里不同版本有着差异：
The correct answer: `script start`, `script end`, `promise1`, `promise2`, `setTimeout`, but it's pretty wild out there in terms of browser support.

Microsoft Edge, Firefox 40, iOS Safari and desktop Safari 8.0.8 log `setTimeout` before `promise1` and `promise2` - although it appears to be a race condition. This is really weird, as Firefox 39 and Safari 8.0.7 get it consistently right.

每个线程都有自己的event loop，所以每个web worker有自己的事件循环，这样才能独立执行，然而所有的同源窗口共享一个事件循环，这样他们可以进行异步通信。事件循环会持续运行，执行队列里的任何任务。一个事件循环有多个任务源，通过任务源可以保证执行顺序（除了自定义的例如IndexedDB），但是浏览器会在每一轮循环中挑选要执行任务的任务源。这允许浏览器优先选择性能敏感的任务，例如用户输入。

将**任务**安排好，以便浏览器能够从内部进入JavaScript/DOM领域，并确保这些操作按顺序发生。在任务之间，浏览器可能渲染更新。从鼠标单击到事件回调需要调度一个任务，解析HTML也是如此，在上面的示例中，setTimeout也是如此。

`setTimeout`等待一个给定的延迟，然后为其callback调度一个新的任务，这就是为什么setTimeout是在 script end 之后打印出来，因为script end是第一个任务的一部分，而setTimeout是在另一个任务里打印的。

**微任务**通常是针对当前正在执行的脚本之后应该立即发生的事情进行调度的，比如对一批操作进行响应，或者进行异步处理，而不需要重新触发一个新的任务。只要在执行过程中没有其他JavaScript，在每个任务结束时，微任务队列就会在回调之后被处理。在微任务期间排队的任何其他微任务都被添加到队列的末尾并被处理。微任务包括mutation observer 回调，promise回调。

Once a promise settles, or if it has already settled, it queues a *microtask* for its reactionary callbacks. This ensures promise callbacks are async even if the promise has already settled. So calling `.then(yey, nay)` against a settled promise immediately queues a microtask. This is why `promise1` and `promise2` are logged after `script end`, as the currently running script must finish before microtasks are handled. `promise1` and `promise2` are logged before `setTimeout`, as microtasks always happen before the next task.

一旦一个promise settle了，或者已经settled，就会把一个微任务所对应的回调函数放入队列。这保障promise的回调函数是异步的，即使是promise已经settled。所以在一个settled的promise后面立即调用 `.then(yey, nay)` 会添加进微任务队列。这就是为什么`promise1` 和 `promise2` 在 `script end`打印，因为微任务的处理必须要在当前执行脚本之后开始。而`promise1` 和 `promise2` 是在 `setTimeout`之前打印，因为微任务总是在下一个任务之前发生。

*原文此处有动画*

## 为什么浏览器表现得有时候会不一样？

promise 是来自 ECMAScript，而不是HTML，这里提出的是job的概念，早起可能浏览器厂商对于将job放在哪个阶段执行有争议，目前看来基本都把job当做微任务了。

Treating promises as tasks leads to performance problems, as callbacks may be unnecessarily delayed by task-related things such as rendering. It also causes non-determinism due to interaction with other task sources, and can break interactions with other APIs, but more on that later.

将promise视为任务会导致性能问题，因为回调可能会因为渲染等与宏任务相关的事情而被不必要地延迟。它还会与其他任务源的交互而导致不确定性，并可能中断与其他api的交互，稍后将详细介绍。

## 如何区分宏任务和微任务

最准确的方法是看规范

https://dom.spec.whatwg.org/#queue-a-mutation-observer-compound-microtask

https://html.spec.whatwg.org/multipage/webappapis.html#event-loop-processing-model