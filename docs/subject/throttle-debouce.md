# throttle和debounce

先引用一下 `loadash` 里的API：

```
_.throttle(func, [wait=0], [options={}])
_.debounce(func, [wait=0], [options={}])
```

然后再来看一下文档里给出的这篇文章

[Debouncing and Throttling Explained Through Examples](https://css-tricks.com/debouncing-throttling-explained-examples/)



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



These days there are slightly more sophisticated ways of handling events. Let me introduce you to Debounce, Throttle, and requestAnimationFrame. We'll also look at the matching use cases.