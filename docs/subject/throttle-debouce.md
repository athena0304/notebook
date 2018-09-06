# throttle和debounce

## 一、lodash API

先引用一下 `loadash` 里的API：

### [Debounce](https://lodash.com/docs/4.17.10#debounce)：

```js
_.debounce(func, [wait=0], [options={}])
```

Creates a debounced function that delays invoking `func` until after `wait` milliseconds have elapsed since the last time the debounced function was invoked. The debounced function comes with a `cancel` method to cancel delayed `func` invocations and a `flush` method to immediately invoke them. Provide `options` to indicate whether `func` should be invoked on the leading and/or trailing edge of the `wait` timeout. The `func` is invoked with the last arguments provided to the debounced function. Subsequent calls to the debounced function return the result of the last `func` invocation.

#### Arguments

-  `func` *(Function)*: The function to debounce.
-  `[wait=0]` *(number)*: The number of milliseconds to delay.
-  `[options={}]` *(Object)*: The options object.
-  `[options.leading=false]` *(boolean)*: Specify invoking on the leading edge of the timeout.
-  `[options.maxWait]` *(number)*: The maximum time `func` is allowed to be delayed before it's invoked.
-  `[options.trailing=true]` *(boolean)*: Specify invoking on the trailing edge of the timeout.

#### Returns

- *(Function)*: Returns the new debounced function.

#### Example

```js
// Avoid costly calculations while the window size is in flux.
jQuery(window).on('resize', _.debounce(calculateLayout, 150));
 
// Invoke `sendMail` when clicked, debouncing subsequent calls.
jQuery(element).on('click', _.debounce(sendMail, 300, {
  'leading': true,
  'trailing': false
}));
 
// Ensure `batchLog` is invoked once after 1 second of debounced calls.
var debounced = _.debounce(batchLog, 250, { 'maxWait': 1000 });
var source = new EventSource('/stream');
jQuery(source).on('message', debounced);
 
// Cancel the trailing debounced invocation.
jQuery(window).on('popstate', debounced.cancel);
```

### [Throttle:](https://lodash.com/docs/4.17.10#throttle)
```js
_.throttle(func, [wait=0], [options={}])
```

#### Arguments

1. `func` *(Function)*: The function to throttle.
2. `[wait=0]` *(number)*: The number of milliseconds to throttle invocations to.
3. `[options={}]` *(Object)*: The options object.
4. `[options.leading=true]` *(boolean)*: Specify invoking on the leading edge of the timeout.
5. `[options.trailing=true]` *(boolean)*: Specify invoking on the trailing edge of the timeout.

#### Returns

*(Function)*: Returns the new throttled function.

#### Example

```js
// Avoid excessively updating the position while scrolling.
jQuery(window).on('scroll', _.throttle(updatePosition, 100));
 
// Invoke `renewToken` when the click event is fired, but not more than once every 5 minutes.
var throttled = _.throttle(renewToken, 300000, { 'trailing': false });
jQuery(element).on('click', throttled);
 
// Cancel the trailing throttled invocation.
jQuery(window).on('popstate', throttled.cancel);
```

## 二、怎么用

在这两个 API 的 lodash 文档中，推荐了一篇文章：[Debouncing and Throttling Explained Through Examples](https://css-tricks.com/debouncing-throttling-explained-examples/)，可以在这里查看我的完整[翻译](./examples.md)，从这篇文章中，可以了解这两个 API 的来龙去脉，以及一些比较直观的解释。

## 三、怎么自己写

现在知道了 throttle 和 debounce 是什么，怎么用了，如果让你自己写，应该怎么写呢。

首先我们先提出几个应用场景，一个是滚动事件，一个是表单的 change 事件

如果先说 debouce 的话，