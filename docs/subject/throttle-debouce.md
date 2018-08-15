# throttle和debounce

## 一、loadash API



先引用一下 `loadash` 里的API：

### Debounce：

```js
_.debounce(func, [wait=0], [options={}])
```

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

You can do this! Here's an example with the `leading` flag on:

![img](https://css-tricks.com/wp-content/uploads/2016/04/debounce-leading.png)Example of a "leading" debounce.

In underscore.js, the option is called `immediate` instead of `leading`

Try it for yourself:

#### [#](https://css-tricks.com/debouncing-throttling-explained-examples/#article-header-id-2)Debounce Implementations

The first time I saw debounce implemented in JavaScript was in 2009 in [this John Hann post](http://unscriptable.com/2009/03/20/debouncing-javascript-methods/) (who also coined the term).

Soon after that, Ben Alman created [a jQuery plugin](http://benalman.com/projects/jquery-throttle-debounce-plugin/) (no longer maintained), and a year after, Jeremy Ashkenas [added it to underscore.js](https://github.com/jashkenas/underscore/commit/9e3e067f5025dbe5e93ed784f93b233882ca0ffe). It was later added to Lodash, a drop-in alternative to underscore.

The 3 implementations are a bit different internally, but their interface is almost identical.

There was a time that underscore adopted the debounce/throttle implementation from Lodash, after [I discovered a bug](http://drupalmotion.com/article/debounce-and-throttle-visual-explanation) in the `_.debounce`function in 2013. Since then, both implementations have grown apart.

Lodash [has added](https://lodash.com/docs#debounce) more features to its `_.debounce` and `_.throttle` functions. The original `immediate` flag was replaced with `leading` and `trailing`options. You can choose one, or both. By default, only the `trailing` edge is enabled.

The new `maxWait` option (only in Lodash at the moment) is not covered in this article but it can be very useful. Actually, the throttle function is defined using `_.debounce` with `maxWait`, as you see in the lodash [source code](https://github.com/lodash/lodash/blob/4.8.0-npm/throttle.js).

#### [#](https://css-tricks.com/debouncing-throttling-explained-examples/#article-header-id-3)Debounce Examples

##### Resize Example

When resizing a (desktop) browser window, they can emit many `resize` events while dragging the resize handle.

See for yourself in this demo:

As you can see, we are using the default `trailing` option for the resize event, because we are only interested on the final value, after user stops resizing the browser.

##### keypress on autocomplete form with Ajax request

Why to send Ajax requests to the server every 50ms, when the user is still typing? `_.debounce` can help us, avoiding extra work, and only send the request when the user stops typing.

Here, it wouldn't make sense to have the `leading` flag on. We want to wait to the last letter typed.

A similar use case would be to wait until user stops typing before validate its input. "Your password is too short" type of messages.















