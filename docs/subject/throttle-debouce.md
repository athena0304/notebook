# throttle和debounce

## 一、loadash API



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

### Throttle:
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





然后再来看一下文档里给出的这篇文章，我稍微进行了翻译。

[Debouncing and Throttling Explained Through Examples](https://css-tricks.com/debouncing-throttling-explained-examples/)



## 二、Debouncing and Throttling Explained Through Examples

**Debounce** 和 **throttle** 是两个很相似但是又不同的技术，可以控制一个函数在一段时间内执行多少次。

使用 debounced 或者 throttled 版本的函数在操作 DOM 事件的时候尤为有用。因为我们在事件和函数执行之间加了一层自己的控制。但是我们不去控制这些 DOM 事件触发的频率，这个可能会改变。

下面我们以滚动事件举例：

<iframe height='265' scrolling='no' title='Scroll events counter' src='//codepen.io/athena0304/embed/Yjbqar/?height=265&theme-id=0&default-tab=css,result&embed-version=2' frameborder='no' allowtransparency='true' allowfullscreen='true' style='width: 100%;'>See the Pen <a href='https://codepen.io/athena0304/pen/Yjbqar/'>Scroll events counter</a> by Athena (<a href='https://codepen.io/athena0304'>@athena0304</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

当使用触控板、鼠标滚轮，或者直接拽动滚动条，都可以轻易触发每秒至少30次事件，而且在触屏的移动端，甚至会达到每秒100次，那么对于滚动的处理器是否能够很好地应对呢？

在2011年，Twitter 网站提出了一个 issue，当在滚动 Twitter 信息流的时候，整个响应和速度都会变慢。 John Resig 发表了一篇博客 [a blog post about the problem](http://ejohn.org/blog/learning-from-twitter) 指出直接在 `scroll` 事件里挂载一些计算量大的函数是多么不明智的行为。

John 当时提出的解决方案是一个 250ms 的循环，在 `onScroll event` 之外。这样处理器就与事件解耦了。使用这样一个简单的技术就可以避免破坏用户体验。

（译者注：文中的核心代码如下）

```
var outerPane = $details.find(".details-pane-outer"),
    didScroll = false;
 
$(window).scroll(function() {
    didScroll = true;
});
 
setInterval(function() {
    if ( didScroll ) {
        didScroll = false;
        // Check your page position and then
        // Load in more results
    }
}, 250);
```

如今，处理事件的方式稍微复杂了一些。让我介绍一下Debounce, Throttle，和requestAnimationFrame。我们还将研究匹配的用例。

###  Debounce

Debounce 允许我们将多个连续的调用“组成”一个。

![img](https://css-tricks.com/wp-content/uploads/2016/04/debounce.png)



想象你在电梯里。你进了电梯，门刚要关上，另一个人来了，想要进来，于是电梯没有开始移动楼层的函数，而是又开门了。这时又有一个人要进来，就又会上演刚才那一幕。也就是说，电梯延迟了它的函数（移动楼层），但是优化了资源。

在下面的例子中尝试将鼠标在按钮上移动：

<iframe height='265' scrolling='no' title='Debounce. Trailing' src='//codepen.io/athena0304/embed/NBVjRB/?height=265&theme-id=0&default-tab=css,result&embed-version=2' frameborder='no' allowtransparency='true' allowfullscreen='true' style='width: 100%;'>See the Pen <a href='https://codepen.io/athena0304/pen/NBVjRB/'>Debounce. Trailing</a> by Athena (<a href='https://codepen.io/athena0304'>@athena0304</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

你可以看到连续快速事件是怎样被一个单独的 debounced 事件所代理的。但是如果事件是被大的缺口触发的，就不会发生 debounce。

#### Leading edge (or "immediate")

You may find it irritating that the debouncing event *waits* before triggering the function execution, until the events stop happening so rapidly. Why not trigger the function execution immediately, so it behaves exactly as the original non-debounced handler? But not fire again until there is a pause in the rapid calls.

你可能会发现去抖事件在触发函数执行之前一直在等待，直到事件迅速地停止。为什么不在每次一开始立即触发函数执行呢，这样它的表现就和原始的没有去抖的处理器一样了。

You can do this! Here's an example with the `leading` flag on:

下面是使用 `leading` 标识符的例子：

![img](https://css-tricks.com/wp-content/uploads/2016/04/debounce-leading.png)

在 underscore.js 中，该选项不叫作  `leading` ，而是 `immediate` 。

自己试一下：

<iframe height='265' scrolling='no' title='Debounce. Leading' src='//codepen.io/athena0304/embed/mGbgGo/?height=265&theme-id=0&default-tab=css,result&embed-version=2' frameborder='no' allowtransparency='true' allowfullscreen='true' style='width: 100%;'>See the Pen <a href='https://codepen.io/athena0304/pen/mGbgGo/'>Debounce. Leading</a> by Athena (<a href='https://codepen.io/athena0304'>@athena0304</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>



#### Debounce 的实现

The first time I saw debounce implemented in JavaScript was in 2009 in [this John Hann post](http://unscriptable.com/2009/03/20/debouncing-javascript-methods/) (who also coined the term).

Soon after that, Ben Alman created [a jQuery plugin](http://benalman.com/projects/jquery-throttle-debounce-plugin/) (no longer maintained), and a year after, Jeremy Ashkenas [added it to underscore.js](https://github.com/jashkenas/underscore/commit/9e3e067f5025dbe5e93ed784f93b233882ca0ffe). It was later added to Lodash, a drop-in alternative to underscore.

The 3 implementations are a bit different internally, but their interface is almost identical.

There was a time that underscore adopted the debounce/throttle implementation from Lodash, after [I discovered a bug](http://drupalmotion.com/article/debounce-and-throttle-visual-explanation) in the `_.debounce`function in 2013. Since then, both implementations have grown apart.

Lodash [has added](https://lodash.com/docs#debounce) more features to its `_.debounce` and `_.throttle` functions. The original `immediate` flag was replaced with `leading` and `trailing`options. You can choose one, or both. By default, only the `trailing` edge is enabled.

The new `maxWait` option (only in Lodash at the moment) is not covered in this article but it can be very useful. Actually, the throttle function is defined using `_.debounce` with `maxWait`, as you see in the lodash [source code](https://github.com/lodash/lodash/blob/4.8.0-npm/throttle.js).

#### Debounce 举例

##### Resize 举例

When resizing a (desktop) browser window, they can emit many `resize` events while dragging the resize handle.

当调整浏览器窗口大小的时候，通过拖拽窗口可以触发很多 `resize` 事件。

See for yourself in this demo:

例子如下：

<iframe height='265' scrolling='no' title='Debounce Resize Event Example' src='//codepen.io/athena0304/embed/KxPLZy/?height=265&theme-id=0&default-tab=js,result&embed-version=2' frameborder='no' allowtransparency='true' allowfullscreen='true' style='width: 100%;'>See the Pen <a href='https://codepen.io/athena0304/pen/KxPLZy/'>Debounce Resize Event Example</a> by Athena (<a href='https://codepen.io/athena0304'>@athena0304</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

As you can see, we are using the default `trailing` option for the resize event, because we are only interested on the final value, after user stops resizing the browser.

可以看到，我们在 resize 事件上使用的是默认的  `trailing` 选项，因为我们只需要关心用户停止调整浏览器后的最终结果就可以了。

##### keypress on autocomplete form with Ajax request

Why to send Ajax requests to the server every 50ms, when the user is still typing? `_.debounce` can help us, avoiding extra work, and only send the request when the user stops typing.

为什么要在用户还在输入的时候每 50 毫秒发送一次 Ajax请求？`_.debounce` 可以帮助我们避免额外的开销，只有当用户停止输入了再发送请求。

Here, it wouldn't make sense to have the `leading` flag on. We want to wait to the last letter typed.

这里没有必要设置  `leading`，我们是想要等到最后一个字母打完再执行函数的。

<iframe height='265' scrolling='no' title='Debouncing keystrokes Example' src='//codepen.io/athena0304/embed/NLKVZw/?height=265&theme-id=0&default-tab=js,result&embed-version=2' frameborder='no' allowtransparency='true' allowfullscreen='true' style='width: 100%;'>See the Pen <a href='https://codepen.io/athena0304/pen/NLKVZw/'>Debouncing keystrokes Example</a> by Athena (<a href='https://codepen.io/athena0304'>@athena0304</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

A similar use case would be to wait until user stops typing before validate its input. "Your password is too short" type of messages.

还有一个类似的使用场景就是用在表单校验，当用户输入完再进行校验，提示信息等。

#### 怎样使用 debounce 和 throttle，以及常见问题

It can be tempting to build your own debounce/throttle function, or copy it from some random blog post. **My recommendation is to use underscore or Lodash directly.** If you only need the `_.debounce` and `_.throttle` functions, you can use Lodash custom builder to output a custom 2KB minified library. Build it with this simple command:

说了这么多，你可能已经想自己来写 debounce/throttle 函数了，或者是从网上随便一篇博客上拷贝一份下来。**但是我给你的建议是直接使用 underscore 或者 Lodash。** 如果你只是需要 `_.debounce` 和 `_.throttle` 函数，可以使用 [Lodash custom builder](https://lodash.com/custom-builds) 来输出一个自定义的压缩后的 2KB 的库。可以使用下列命令来进行构建：

```
npm i -g lodash-cli
lodash include = debounce, throttle
```

That said, most use the modular form `lodash/throttle` and `lodash/debounce` or `lodash.throttle` and `lodash.debounce` packages with webpack/browserify/rollup.

也就是说，最好是使用模块化的形式，通过 webpack/browserify/rollup 来引用，`lodash/throttle` 和 `lodash/debounce` 或 `lodash.throttle` 和 `lodash.debounce` 。

A common pitfall is to call the `_.debounce` function more than once:

使用 `_.debounce` 函数的一个常见错误就是多次调用它：

```
// 错误
$(window).on('scroll', function() {
   _.debounce(doSomething, 300); 
});

// 正确
$(window).on('scroll', _.debounce(doSomething, 200));
```

Creating a variable for the debounced function will allow us to call the private method `debounced_version.cancel()`, available in lodash and underscore.js, in case you need it.

为 debounced 函数创建一个变量可以让我们调用私有函数 `debounced_version.cancel()`，如果有需要，lodash 和 underscore.js 都可以供你使用

```
var debounced_version = _.debounce(doSomething, 200);
$(window).on('scroll', debounced_version);

// 如果你需要的话
debounced_version.cancel();
```



### Throttle

By using `_.throttle`, we don't allow to our function to execute more than once every X milliseconds.

使用  `_.throttle`，我们不允许我们的函数每X毫秒的执行次数超过一次。

The main difference between this and debouncing is that throttle guarantees the execution of the function regularly, at least every X milliseconds.

throttle 和 debounce 最主要的区别就是 throttle 保证函数最少每 X 毫秒定期执行一次。

The same way than debounce, throttle technique is covered by Ben's plugin, underscore.js and lodash.

和 debounce 一样， throttle 也用在了 Ben's plugin、underscore.js 和 lodash里面。

#### Throttling 举例

##### 无限滚动

A quite common example. The user is scrolling down your infinite-scrolling page. You need to check how far from the bottom the user is. If the user is near the bottom, we should request via Ajax more content and append it to the page.

这是一个非常常见的例子。用户在一个无限滚动的页面里向下滚动，你需要知道当前滚动的位置距离底部还有多远，如果接近底部了，我们就得通过 Ajax 请求获取更多的内容，将其添加到页面里。

Here our beloved `_.debounce` wouldn't be helpful. It only would trigger only when the user stops scrolling.. and we need to start fetching the content *before*the user reaches the bottom.

此时我们之前的  `_.debounce` 就派不上作用了。只有当用户停止滚动才能触发，而且我们需要的是在用户到达底部之前就开始获取内容。

With `_.throttle` we can warranty that we are checking constantly how far we are from the bottom.

使用  `_.throttle` 就能确保能够实时检查距离底部还有多远。

### [#](https://css-tricks.com/debouncing-throttling-explained-examples/#article-header-id-7)requestAnimationFrame (rAF)

`requestAnimationFrame` is another way of rate-limiting the execution of a function.

`requestAnimationFrame` 是另一种限制函数执行速度的方法。

It can be thought as a `_.throttle(dosomething, 16)`. But with a much higher fidelity, since it's a browser native API that aims for better accuracy.

它可以被看做 `_.throttle(dosomething, 16)`。但它有着更高的保真度，因为它是浏览器的原生 API，有着更好的精度。

We can use the rAF API, as an alternative to the throttle function, considering this pros/cons:

我们可以使用 rAF API，作为 throttle 函数的替代，考虑下面的pros/cons：

#### [#](https://css-tricks.com/debouncing-throttling-explained-examples/#article-header-id-8)Pros

- Aims for 60fps (frames of 16 ms) but internally will decide the best timing on how to schedule the rendering.
- Fairly simple and standard API, not changing in the future. Less maintenance.

#### [#](https://css-tricks.com/debouncing-throttling-explained-examples/#article-header-id-9)Cons

- The start/cancelation of rAFs it's our responsibility, unlike `.debounce` or `.throttle`, where it's managed internally.
- If the browser tab is not active, it would not execute. Although for scroll, mouse or keyboard events this doesn't matter.
- Although all modern browsers offer rAF, still is not supported in IE9, Opera Mini and old Android. [A polyfill](http://www.paulirish.com/2011/requestanimationframe-for-smart-animating/) would [be needed](http://caniuse.com/#feat=requestanimationframe) still today.
- rAF is not supported in node.js, so you can't use it on the server to throttle filesystem events.

As a rule of thumb, I would use `requestAnimationFrame` if your JavaScript function is "painting" or animating directly properties, use it at everything that involves re-calculating element positions.

To make Ajax requests, or deciding if adding/removing a class (that could trigger a CSS animation), I would consider `_.debounce` or `_.throttle`, where you can set up lower executing rates (200ms for example, instead of 16ms)

If you think that rAF could be implemented inside underscore or lodash, they both have rejected the idea, since it's a specialized use case, and it's easy enough to be called directly.

#### [#](https://css-tricks.com/debouncing-throttling-explained-examples/#article-header-id-10)Examples of rAF

I will cover only this example to use requestAnimation frame on scroll, inspired by [Paul Lewis article](http://www.html5rocks.com/en/tutorials/speed/animations/), where he explains step-by-step the logic of this example.

I put it side by side to compare it to `_.throttle` at 16ms. Giving similar performance, but probably rAF will give you better results on more complex scenarios.

A more advanced example where I've seen this technique is in the library headroom.js, where the [logic is decoupled](https://github.com/WickyNilliams/headroom.js/blob/3282c23bc69b14f21bfbaf66704fa37b58e3241d/src/Debouncer.js) and wrapped inside an object.

### [#](https://css-tricks.com/debouncing-throttling-explained-examples/#article-header-id-11)Conclusion

Use debounce, throttle and `requestAnimationFrame` to optimize your event handlers. Each technique is slightly different, but all three of them are useful and complement each other.

In summary:

- **debounce:** Grouping a sudden burst of events (like keystrokes) into a single one.
- **throttle:** Guaranteeing a constant flow of executions every X milliseconds. Like checking every 200ms your scroll position to trigger a CSS animation.
- **requestAnimationFrame:** a throttle alternative. When your function recalculates and renders elements on screen and you want to guarantee smooth changes or animations. Note: no IE9 support.







