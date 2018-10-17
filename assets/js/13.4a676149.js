(window.webpackJsonp=window.webpackJsonp||[]).push([[13],{195:function(t,e,s){"use strict";s.r(e);var n=s(0),a=Object(n.a)({},function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("div",{staticClass:"content"},[t._m(0),t._m(1),s("p",[t._v("当我们在操作 DOM 事件的时候，为函数添加 debounce 或者 throttle 就会尤为有用。为什么？因为我们在事件和函数执行之间加了一个我们自己的控制层。记住，我们是不去控制这些 DOM 事件触发的频率的，因为这个可能会有变化。")]),s("p",[t._v("下面我们以滚动事件举例：")]),t._m(2),s("p",[t._v("当使用触控板、鼠标滚轮，或者直接拽动滚动条，每秒都可以轻易触发至少30次事件，而且在触屏的移动端，甚至会达到每秒100次，面对这样高的执行频率，你的滚动事件处理程序能否很好地应对？")]),s("p",[t._v("在2011年，Twitter 网站提出了一个 issue：当向下滚动 Twitter 信息流的时候，整个页面的响应速度都会变慢。 John Resig 基于该问题发表了一篇"),s("a",{attrs:{href:"http://ejohn.org/blog/learning-from-twitter",target:"_blank",rel:"noopener noreferrer"}},[t._v("博客"),s("OutboundLink")],1),t._v("，文中指出，直接在 "),s("code",[t._v("scroll")]),t._v(" 事件里挂载一些计算量大的函数是件多么不明智的行为。")]),t._m(3),t._m(4),s("p",[t._v("如今，处理事件的方式稍微复杂了一些。下面我们结合用例，一一介绍 Debounce、 Throttle 和requestAnimationFrame。")]),t._m(5),s("p",[t._v("Debounce 允许我们将多个连续的调用合并成一个。")]),t._m(6),s("p",[t._v("想象一个进电梯的场景，你走进了电梯，门刚要关上，这时另一个人想要进来，于是电梯没有移动楼层（处理函数），而是将门打开让那个人进来。这时又有一个人要进来，就又会上演刚才那一幕。也就是说，电梯延迟了它的函数（移动楼层）执行，但是优化了资源。")]),s("p",[t._v("在下面的例子中，尝试快速点击按钮或者在上面滑动：")]),t._m(7),s("p",[t._v("你可以看到连续快速事件是怎样被一个单独的 debounce 事件所替代的。但是如果事件触发时间间隔较长，就不会发生 debounce。")]),t._m(8),s("p",[t._v("在上面的例子中，你会发现 debounce 事件会等到快速事件停止发生后才会触发函数执行。为什么不在每次一开始就立即触发函数执行呢，这样它的表现就和原始的没有去抖的处理器一样了。直到快速调用出现停顿的时候，才会再次触发。")]),t._m(9),t._m(10),t._m(11),s("p",[t._v("自己试一下：")]),t._m(12),t._m(13),s("p",[t._v("Debounce 的概念和实现最早是由 "),s("a",{attrs:{href:"http://unscriptable.com/2009/03/20/debouncing-javascript-methods/",target:"_blank",rel:"noopener noreferrer"}},[t._v("John Hann"),s("OutboundLink")],1),t._v(" 在2009年提出来的。")]),s("p",[t._v("不久之后，Ben Alman 就写了一个 "),s("a",{attrs:{href:"http://benalman.com/projects/jquery-throttle-debounce-plugin/",target:"_blank",rel:"noopener noreferrer"}},[t._v("jQuery 插件"),s("OutboundLink")],1),t._v("（现在已经不再维护了），一年之后 Jeremy Ashkenas 把它添加进了 underscore.js。再后来被添加进 Lodash。")]),s("p",[t._v("这三个实现在内部有一点不同，但是接口几乎是相同的。")]),t._m(14),t._m(15),s("p",[t._v("新的  "),s("code",[t._v("maxWait")]),t._v(" 选项（目前只存在于Lodash）在本文中没有提及，但是它也是一个很有用的选项。实际上，throttle 函数就是使用  "),s("code",[t._v("_.debounce")]),t._v(" 带着 "),s("code",[t._v("maxWait")]),t._v(" 的选项来定义的，你可以在这里查看"),s("a",{attrs:{href:"https://github.com/lodash/lodash/blob/4.8.0-npm/throttle.js",target:"_blank",rel:"noopener noreferrer"}},[t._v("源码"),s("OutboundLink")],1),t._v("。")]),t._m(16),t._m(17),t._m(18),s("p",[t._v("例子如下：")]),t._m(19),t._v("\n可以看到，我们在 resize 事件上使用的是默认的  `trailing` 选项，因为我们只需要关心用户停止调整浏览器后的最终结果就可以了。\n"),t._m(20),t._m(21),t._m(22),t._m(23),t._v("\n还有一个类似的使用场景就是表单校验，当用户输入完再进行校验、提示信息等。\n"),t._m(24),s("p",[t._v("说了这么多，你可能已经想自己来写 debounce/throttle 函数了，或者是从网上随便一篇博客上拷贝一份下来。"),s("strong",[t._v("但是我给你的建议是直接使用 underscore 或者 Lodash。")]),t._v(" 如果你只是需要 "),s("code",[t._v("_.debounce")]),t._v(" 和 "),s("code",[t._v("_.throttle")]),t._v(" 函数，可以使用 "),s("a",{attrs:{href:"https://lodash.com/custom-builds",target:"_blank",rel:"noopener noreferrer"}},[t._v("Lodash custom builder"),s("OutboundLink")],1),t._v(" 来输出一个自定义的压缩后为 2KB 的库。可以使用下列命令来进行构建：")]),t._m(25),t._m(26),t._m(27),t._m(28),t._m(29),t._m(30),t._m(31),t._m(32),s("p",[t._v("Throttle 和 debounce 最主要的区别就是 throttle 保证函数每 X 毫秒至少执行一次。")]),s("p",[t._v("和 debounce 一样， throttle 也用在了 Ben 的插件、underscore.js 和 lodash里面。")]),t._m(33),t._m(34),s("p",[t._v("这是一个非常常见的例子。用户在一个无限滚动的页面里向下滚动，你需要知道当前滚动的位置距离底部还有多远，如果接近底部了，我们就得通过 Ajax 请求获取更多的内容，将其添加到页面里。")]),t._m(35),t._m(36),t._m(37),t._m(38),t._m(39),s("p",[t._v("我们可以使用 rAF API，作为 throttle 函数的替代，考虑下面的优缺点：")]),t._m(40),t._m(41),t._m(42),s("ul",[t._m(43),s("li",[t._v("如果浏览器的 tab 页面不活跃了，它就不会再执行。")]),s("li",[t._v("虽然所有的现代浏览器都提供了 rAF， 但是 IE9、Opera Mini 和一些老的安卓版本还不支持。如果需要，现在还是要使用 "),s("a",{attrs:{href:"http://www.paulirish.com/2011/requestanimationframe-for-smart-animating/",target:"_blank",rel:"noopener noreferrer"}},[t._v("polyfill"),s("OutboundLink")],1),t._v(" 。")]),s("li",[t._v("Node.js 不支持 rAF，所以不能在服务端用于 throttle 文件系统事件。")])]),t._m(44),t._m(45),s("p",[t._v("这时你可能会想，为什不把 rAF 集成到 underscore 或 lodash 里呢，那他俩都是拒绝的，因为这只是一个特殊的使用场景，而且已经足够简单，可以被直接调用。")]),t._m(46),s("p",[t._v("受"),s("a",{attrs:{href:"http://www.html5rocks.com/en/tutorials/speed/animations/",target:"_blank",rel:"noopener noreferrer"}},[t._v("这篇文章"),s("OutboundLink")],1),t._v("的启发，在这里我会举一个滚动的例子，在这篇文章中有每个步骤的逻辑解释。")]),t._m(47),t._m(48),s("p",[t._v("还有一个更高级的例子，在 headroom.js 中，逻辑被"),s("a",{attrs:{href:"https://github.com/WickyNilliams/headroom.js/blob/3282c23bc69b14f21bfbaf66704fa37b58e3241d/src/Debouncer.js",target:"_blank",rel:"noopener noreferrer"}},[t._v("解耦"),s("OutboundLink")],1),t._v("了，并且包裹在了对象中。")]),t._m(49),t._m(50),s("p",[t._v("总结：")]),t._m(51),s("p",[t._v("原文链接：https://css-tricks.com/debouncing-throttling-explained-examples/")])])},[function(){var t=this.$createElement,e=this._self._c||t;return e("h1",{attrs:{id:"【译】通过例子解释-debounce-和-throttle"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#【译】通过例子解释-debounce-和-throttle","aria-hidden":"true"}},[this._v("#")]),this._v(" 【译】通过例子解释 Debounce 和 Throttle")])},function(){var t=this.$createElement,e=this._self._c||t;return e("p",[e("strong",[this._v("Debounce")]),this._v(" 和 "),e("strong",[this._v("Throttle")]),this._v(" 是两个很相似但是又不同的技术，都可以控制一个函数在一段时间内执行的次数。")])},function(){var t=this.$createElement,e=this._self._c||t;return e("iframe",{staticStyle:{width:"100%"},attrs:{height:"265",scrolling:"no",title:"Scroll events counter",src:"//codepen.io/athena0304/embed/Yjbqar/?height=265&theme-id=0&default-tab=css,result&embed-version=2",frameborder:"no",allowtransparency:"true",allowfullscreen:"true"}},[this._v("See the Pen "),e("a",{attrs:{href:"https://codepen.io/athena0304/pen/Yjbqar/"}},[this._v("Scroll events counter")]),this._v(" by Athena ("),e("a",{attrs:{href:"https://codepen.io/athena0304"}},[this._v("@athena0304")]),this._v(") on "),e("a",{attrs:{href:"https://codepen.io"}},[this._v("CodePen")]),this._v(".\n")])},function(){var t=this.$createElement,e=this._self._c||t;return e("p",[this._v("John 当时提出的解决方案是在 "),e("code",[this._v("onScroll event")]),this._v(" 的外部设置一个每 250ms 执行一次的循环。这样处理程序就与事件解耦了。使用这样一个简单的技术就可以避免破坏用户体验。")])},function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("div",{staticClass:"tip custom-block"},[s("p",{staticClass:"custom-block-title"},[t._v("译者注")]),s("p",[t._v("文中的核心代码如下")]),s("div",{staticClass:"language-js extra-class"},[s("pre",{pre:!0,attrs:{class:"language-js"}},[s("code",[s("span",{attrs:{class:"token keyword"}},[t._v("var")]),t._v(" outerPane "),s("span",{attrs:{class:"token operator"}},[t._v("=")]),t._v(" $details"),s("span",{attrs:{class:"token punctuation"}},[t._v(".")]),s("span",{attrs:{class:"token function"}},[t._v("find")]),s("span",{attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{attrs:{class:"token string"}},[t._v('".details-pane-outer"')]),s("span",{attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n    didScroll "),s("span",{attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),s("span",{attrs:{class:"token boolean"}},[t._v("false")]),s("span",{attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n\n"),s("span",{attrs:{class:"token function"}},[t._v("$")]),s("span",{attrs:{class:"token punctuation"}},[t._v("(")]),t._v("window"),s("span",{attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{attrs:{class:"token punctuation"}},[t._v(".")]),s("span",{attrs:{class:"token function"}},[t._v("scroll")]),s("span",{attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{attrs:{class:"token keyword"}},[t._v("function")]),s("span",{attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),s("span",{attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n    didScroll "),s("span",{attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),s("span",{attrs:{class:"token boolean"}},[t._v("true")]),s("span",{attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n"),s("span",{attrs:{class:"token punctuation"}},[t._v("}")]),s("span",{attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n\n"),s("span",{attrs:{class:"token function"}},[t._v("setInterval")]),s("span",{attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{attrs:{class:"token keyword"}},[t._v("function")]),s("span",{attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),s("span",{attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n    "),s("span",{attrs:{class:"token keyword"}},[t._v("if")]),t._v(" "),s("span",{attrs:{class:"token punctuation"}},[t._v("(")]),t._v(" didScroll "),s("span",{attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),s("span",{attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n        didScroll "),s("span",{attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),s("span",{attrs:{class:"token boolean"}},[t._v("false")]),s("span",{attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n        "),s("span",{attrs:{class:"token comment"}},[t._v("// Check your page position and then")]),t._v("\n        "),s("span",{attrs:{class:"token comment"}},[t._v("// Load in more results")]),t._v("\n    "),s("span",{attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n"),s("span",{attrs:{class:"token punctuation"}},[t._v("}")]),s("span",{attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" "),s("span",{attrs:{class:"token number"}},[t._v("250")]),s("span",{attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n")])])])])},function(){var t=this.$createElement,e=this._self._c||t;return e("h3",{attrs:{id:"debounce"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#debounce","aria-hidden":"true"}},[this._v("#")]),this._v(" Debounce")])},function(){var t=this.$createElement,e=this._self._c||t;return e("p",[e("img",{attrs:{src:"https://css-tricks.com/wp-content/uploads/2016/04/debounce.png",alt:"img"}})])},function(){var t=this.$createElement,e=this._self._c||t;return e("iframe",{staticStyle:{width:"100%"},attrs:{height:"265",scrolling:"no",title:"Debounce. Trailing",src:"//codepen.io/athena0304/embed/NBVjRB/?height=265&theme-id=0&default-tab=css,result&embed-version=2",frameborder:"no",allowtransparency:"true",allowfullscreen:"true"}},[this._v("See the Pen "),e("a",{attrs:{href:"https://codepen.io/athena0304/pen/NBVjRB/"}},[this._v("Debounce. Trailing")]),this._v(" by Athena ("),e("a",{attrs:{href:"https://codepen.io/athena0304"}},[this._v("@athena0304")]),this._v(") on "),e("a",{attrs:{href:"https://codepen.io"}},[this._v("CodePen")]),this._v(".\n")])},function(){var t=this.$createElement,e=this._self._c||t;return e("h4",{attrs:{id:"leading-边缘-或者-immediate"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#leading-边缘-或者-immediate","aria-hidden":"true"}},[this._v("#")]),this._v(' Leading 边缘 (或者 "immediate")')])},function(){var t=this.$createElement,e=this._self._c||t;return e("p",[this._v("下面是使用 "),e("code",[this._v("leading")]),this._v(" 标识符的例子：")])},function(){var t=this.$createElement,e=this._self._c||t;return e("p",[e("img",{attrs:{src:"https://css-tricks.com/wp-content/uploads/2016/04/debounce-leading.png",alt:"img"}})])},function(){var t=this.$createElement,e=this._self._c||t;return e("p",[this._v("在 underscore.js 中，该选项叫作 "),e("code",[this._v("immediate")]),this._v(" ，而不是  "),e("code",[this._v("leading")]),this._v("。")])},function(){var t=this.$createElement,e=this._self._c||t;return e("iframe",{staticStyle:{width:"100%"},attrs:{height:"265",scrolling:"no",title:"Debounce. Leading",src:"//codepen.io/athena0304/embed/mGbgGo/?height=265&theme-id=0&default-tab=css,result&embed-version=2",frameborder:"no",allowtransparency:"true",allowfullscreen:"true"}},[this._v("See the Pen "),e("a",{attrs:{href:"https://codepen.io/athena0304/pen/mGbgGo/"}},[this._v("Debounce. Leading")]),this._v(" by Athena ("),e("a",{attrs:{href:"https://codepen.io/athena0304"}},[this._v("@athena0304")]),this._v(") on "),e("a",{attrs:{href:"https://codepen.io"}},[this._v("CodePen")]),this._v(".\n")])},function(){var t=this.$createElement,e=this._self._c||t;return e("h4",{attrs:{id:"debounce-的实现"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#debounce-的实现","aria-hidden":"true"}},[this._v("#")]),this._v(" Debounce 的实现")])},function(){var t=this.$createElement,e=this._self._c||t;return e("p",[this._v("曾经有一段时间，underscore 采取了 Lodash 里面的 debounce/throttle 实现，但是后来我在2013年发现了  "),e("code",[this._v("_.debounce")]),this._v(" 函数的一个 bug。从那时起，这两种实现就出现分化了。")])},function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("p",[t._v("Lodash 为  "),s("code",[t._v("_.debounce")]),t._v(" 和 "),s("code",[t._v("_.throttle")]),t._v("  添加了更多的特性。最初的  "),s("code",[t._v("immediate")]),t._v(" 标识符被 "),s("code",[t._v("leading")]),t._v(" 和 "),s("code",[t._v("trailing")]),t._v("所替代。你可以选择一个选项，也可以两个都要。默认情况下 "),s("code",[t._v("trailing")]),t._v(" 是被开启的。")])},function(){var t=this.$createElement,e=this._self._c||t;return e("h4",{attrs:{id:"debounce-举例"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#debounce-举例","aria-hidden":"true"}},[this._v("#")]),this._v(" Debounce 举例")])},function(){var t=this.$createElement,e=this._self._c||t;return e("h5",{attrs:{id:"resize-举例"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#resize-举例","aria-hidden":"true"}},[this._v("#")]),this._v(" Resize 举例")])},function(){var t=this.$createElement,e=this._self._c||t;return e("p",[this._v("通过拖拽浏览器窗口，可以触发很多次 "),e("code",[this._v("resize")]),this._v(" 事件。")])},function(){var t=this.$createElement,e=this._self._c||t;return e("iframe",{staticStyle:{width:"100%"},attrs:{height:"265",scrolling:"no",title:"Debounce Resize Event Example",src:"//codepen.io/athena0304/embed/KxPLZy/?height=265&theme-id=0&default-tab=js,result&embed-version=2",frameborder:"no",allowtransparency:"true",allowfullscreen:"true"}},[this._v("See the Pen "),e("a",{attrs:{href:"https://codepen.io/athena0304/pen/KxPLZy/"}},[this._v("Debounce Resize Event Example")]),this._v(" by Athena ("),e("a",{attrs:{href:"https://codepen.io/athena0304"}},[this._v("@athena0304")]),this._v(") on "),e("a",{attrs:{href:"https://codepen.io"}},[this._v("CodePen")]),this._v(".\n")])},function(){var t=this.$createElement,e=this._self._c||t;return e("h5",{attrs:{id:"敲击键盘，通过-ajax-请求自动填充表单"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#敲击键盘，通过-ajax-请求自动填充表单","aria-hidden":"true"}},[this._v("#")]),this._v(" 敲击键盘，通过 Ajax 请求自动填充表单")])},function(){var t=this.$createElement,e=this._self._c||t;return e("p",[this._v("为什么要在用户还在输入的时候每隔 50ms 就发送一次 Ajax请求？"),e("code",[this._v("_.debounce")]),this._v(" 可以帮助我们避免额外的开销，只有当用户停止输入了再发送请求。")])},function(){var t=this.$createElement,e=this._self._c||t;return e("p",[this._v("这里没有必要设置  "),e("code",[this._v("leading")]),this._v("，我们是想要等到最后一个字符输入完再执行函数的。")])},function(){var t=this.$createElement,e=this._self._c||t;return e("iframe",{staticStyle:{width:"100%"},attrs:{height:"265",scrolling:"no",title:"Debouncing keystrokes Example",src:"//codepen.io/athena0304/embed/NLKVZw/?height=265&theme-id=0&default-tab=js,result&embed-version=2",frameborder:"no",allowtransparency:"true",allowfullscreen:"true"}},[this._v("See the Pen "),e("a",{attrs:{href:"https://codepen.io/athena0304/pen/NLKVZw/"}},[this._v("Debouncing keystrokes Example")]),this._v(" by Athena ("),e("a",{attrs:{href:"https://codepen.io/athena0304"}},[this._v("@athena0304")]),this._v(") on "),e("a",{attrs:{href:"https://codepen.io"}},[this._v("CodePen")]),this._v(".\n")])},function(){var t=this.$createElement,e=this._self._c||t;return e("h4",{attrs:{id:"如何使用-debounce-和-throttle，以及常见问题"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#如何使用-debounce-和-throttle，以及常见问题","aria-hidden":"true"}},[this._v("#")]),this._v(" 如何使用 debounce 和 throttle，以及常见问题")])},function(){var t=this.$createElement,e=this._self._c||t;return e("div",{staticClass:"language-bash extra-class"},[e("pre",{pre:!0,attrs:{class:"language-bash"}},[e("code",[e("span",{attrs:{class:"token function"}},[this._v("npm")]),this._v(" i -g lodash-cli\nlodash include "),e("span",{attrs:{class:"token operator"}},[this._v("=")]),this._v(" debounce, throttle\n")])])])},function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("p",[t._v("也就是说，最好是使用模块化的形式，通过 webpack/browserify/rollup 来引用，如 "),s("code",[t._v("lodash/throttle")]),t._v(" 和 "),s("code",[t._v("lodash/debounce")]),t._v(" 或 "),s("code",[t._v("lodash.throttle")]),t._v(" 和 "),s("code",[t._v("lodash.debounce")]),t._v(" 。")])},function(){var t=this.$createElement,e=this._self._c||t;return e("p",[this._v("使用 "),e("code",[this._v("_.debounce")]),this._v(" 函数的一个常见错误就是多次调用它：")])},function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("div",{staticClass:"language-js extra-class"},[s("pre",{pre:!0,attrs:{class:"language-js"}},[s("code",[s("span",{attrs:{class:"token comment"}},[t._v("// 错误")]),t._v("\n"),s("span",{attrs:{class:"token function"}},[t._v("$")]),s("span",{attrs:{class:"token punctuation"}},[t._v("(")]),t._v("window"),s("span",{attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{attrs:{class:"token punctuation"}},[t._v(".")]),s("span",{attrs:{class:"token function"}},[t._v("on")]),s("span",{attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{attrs:{class:"token string"}},[t._v("'scroll'")]),s("span",{attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" "),s("span",{attrs:{class:"token keyword"}},[t._v("function")]),s("span",{attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),s("span",{attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n   _"),s("span",{attrs:{class:"token punctuation"}},[t._v(".")]),s("span",{attrs:{class:"token function"}},[t._v("debounce")]),s("span",{attrs:{class:"token punctuation"}},[t._v("(")]),t._v("doSomething"),s("span",{attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" "),s("span",{attrs:{class:"token number"}},[t._v("300")]),s("span",{attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{attrs:{class:"token punctuation"}},[t._v(";")]),t._v(" \n"),s("span",{attrs:{class:"token punctuation"}},[t._v("}")]),s("span",{attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n\n"),s("span",{attrs:{class:"token comment"}},[t._v("// 正确")]),t._v("\n"),s("span",{attrs:{class:"token function"}},[t._v("$")]),s("span",{attrs:{class:"token punctuation"}},[t._v("(")]),t._v("window"),s("span",{attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{attrs:{class:"token punctuation"}},[t._v(".")]),s("span",{attrs:{class:"token function"}},[t._v("on")]),s("span",{attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{attrs:{class:"token string"}},[t._v("'scroll'")]),s("span",{attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" _"),s("span",{attrs:{class:"token punctuation"}},[t._v(".")]),s("span",{attrs:{class:"token function"}},[t._v("debounce")]),s("span",{attrs:{class:"token punctuation"}},[t._v("(")]),t._v("doSomething"),s("span",{attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" "),s("span",{attrs:{class:"token number"}},[t._v("200")]),s("span",{attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n")])])])},function(){var t=this.$createElement,e=this._self._c||t;return e("p",[this._v("为 debounced 函数创建一个变量可以让我们调用私有函数 "),e("code",[this._v("debounced_version.cancel()")]),this._v("，如果有需要，lodash 和 underscore.js 都可以供你使用。")])},function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("div",{staticClass:"language-js extra-class"},[s("pre",{pre:!0,attrs:{class:"language-js"}},[s("code",[s("span",{attrs:{class:"token keyword"}},[t._v("var")]),t._v(" debounced_version "),s("span",{attrs:{class:"token operator"}},[t._v("=")]),t._v(" _"),s("span",{attrs:{class:"token punctuation"}},[t._v(".")]),s("span",{attrs:{class:"token function"}},[t._v("debounce")]),s("span",{attrs:{class:"token punctuation"}},[t._v("(")]),t._v("doSomething"),s("span",{attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" "),s("span",{attrs:{class:"token number"}},[t._v("200")]),s("span",{attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n"),s("span",{attrs:{class:"token function"}},[t._v("$")]),s("span",{attrs:{class:"token punctuation"}},[t._v("(")]),t._v("window"),s("span",{attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{attrs:{class:"token punctuation"}},[t._v(".")]),s("span",{attrs:{class:"token function"}},[t._v("on")]),s("span",{attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{attrs:{class:"token string"}},[t._v("'scroll'")]),s("span",{attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" debounced_version"),s("span",{attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n\n"),s("span",{attrs:{class:"token comment"}},[t._v("// 如果你需要的话")]),t._v("\ndebounced_version"),s("span",{attrs:{class:"token punctuation"}},[t._v(".")]),s("span",{attrs:{class:"token function"}},[t._v("cancel")]),s("span",{attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n")])])])},function(){var t=this.$createElement,e=this._self._c||t;return e("h3",{attrs:{id:"throttle"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#throttle","aria-hidden":"true"}},[this._v("#")]),this._v(" Throttle")])},function(){var t=this.$createElement,e=this._self._c||t;return e("p",[this._v("使用 "),e("code",[this._v("_.throttle")]),this._v(" 则不允许函数每 X 毫秒的执行次数超过一次。")])},function(){var t=this.$createElement,e=this._self._c||t;return e("h4",{attrs:{id:"throttling-举例"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#throttling-举例","aria-hidden":"true"}},[this._v("#")]),this._v(" Throttling 举例")])},function(){var t=this.$createElement,e=this._self._c||t;return e("h5",{attrs:{id:"无限滚动"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#无限滚动","aria-hidden":"true"}},[this._v("#")]),this._v(" 无限滚动")])},function(){var t=this.$createElement,e=this._self._c||t;return e("p",[this._v("此时我们之前的 "),e("code",[this._v("_.debounce")]),this._v(" 就派不上作用了。使用 debounce 只有当用户停止滚动时才能触发，而我们需要的是在用户滚动到底部之前就开始获取内容。")])},function(){var t=this.$createElement,e=this._self._c||t;return e("p",[this._v("使用 "),e("code",[this._v("_.throttle")]),this._v(" 就能确保实时检查距离底部还有多远。")])},function(){var t=this.$createElement,e=this._self._c||t;return e("h3",{attrs:{id:"requestanimationframe-raf"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#requestanimationframe-raf","aria-hidden":"true"}},[this._v("#")]),this._v(" requestAnimationFrame (rAF)")])},function(){var t=this.$createElement,e=this._self._c||t;return e("p",[e("code",[this._v("requestAnimationFrame")]),this._v(" 是另一种限制函数执行速度的方法。")])},function(){var t=this.$createElement,e=this._self._c||t;return e("p",[this._v("它可以被看做 "),e("code",[this._v("_.throttle(dosomething, 16)")]),this._v("。但它有着更高的保真度，因为它是浏览器的原生 API，有着更好的精度。")])},function(){var t=this.$createElement,e=this._self._c||t;return e("h4",{attrs:{id:"优点"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#优点","aria-hidden":"true"}},[this._v("#")]),this._v(" 优点")])},function(){var t=this.$createElement,e=this._self._c||t;return e("ul",[e("li",[this._v("目标是 60fps（每帧 16ms），但是会在浏览器内部决定如何安排渲染的最佳时机。")]),e("li",[this._v("非常简单，而且是标准 API，在未来也不会改变。更少的维护成本。")])])},function(){var t=this.$createElement,e=this._self._c||t;return e("h4",{attrs:{id:"缺点"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#缺点","aria-hidden":"true"}},[this._v("#")]),this._v(" 缺点")])},function(){var t=this.$createElement,e=this._self._c||t;return e("li",[this._v("rAFs 的开始/取消由我们自己来管理，而不像  "),e("code",[this._v(".debounce")]),this._v(" 和 "),e("code",[this._v(".throttle")]),this._v(" 是在内部管理的。")])},function(){var t=this.$createElement,e=this._self._c||t;return e("p",[this._v("根据经验，如果你的 JavaScript 函数是在绘制或者直接改变属性，所有涉及到元素位置重新计算的，我会建议使用  "),e("code",[this._v("requestAnimationFrame")]),this._v("，")])},function(){var t=this.$createElement,e=this._self._c||t;return e("p",[this._v("如果是处理 Ajax 请求，或者决定是否添加/删除某个 class（可能会触发一个 CSS 动画），我会考虑 "),e("code",[this._v("_.debounce")]),this._v(" 和 "),e("code",[this._v("_.throttle")]),this._v("，这里可以设置更低一些的执行速度（例如 200ms，而不是16ms）。")])},function(){var t=this.$createElement,e=this._self._c||t;return e("h4",{attrs:{id:"raf-举例"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#raf-举例","aria-hidden":"true"}},[this._v("#")]),this._v(" rAF 举例")])},function(){var t=this.$createElement,e=this._self._c||t;return e("p",[this._v("我做了一个对比实验，一边是 rAF，一边是 16ms 间隔的 "),e("code",[this._v("_.throttle")]),this._v("。它们性能很相似，但是 rAF 可能会在更复杂的场景下性能更高一些。")])},function(){var t=this.$createElement,e=this._self._c||t;return e("iframe",{staticStyle:{width:"100%"},attrs:{height:"265",scrolling:"no",title:"Scroll comparison requestAnimationFrame vs throttle",src:"//codepen.io/dcorb/embed/pgOKKw/?height=265&theme-id=0&default-tab=js,result&embed-version=2",frameborder:"no",allowtransparency:"true",allowfullscreen:"true"}},[this._v("See the Pen "),e("a",{attrs:{href:"https://codepen.io/dcorb/pen/pgOKKw/"}},[this._v("Scroll comparison requestAnimationFrame vs throttle")]),this._v(" by Corbacho ("),e("a",{attrs:{href:"https://codepen.io/dcorb"}},[this._v("@dcorb")]),this._v(") on "),e("a",{attrs:{href:"https://codepen.io"}},[this._v("CodePen")]),this._v(".\n")])},function(){var t=this.$createElement,e=this._self._c||t;return e("h3",{attrs:{id:"总结"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#总结","aria-hidden":"true"}},[this._v("#")]),this._v(" 总结")])},function(){var t=this.$createElement,e=this._self._c||t;return e("p",[this._v("使用 debounce、throttle 和  "),e("code",[this._v("requestAnimationFrame")]),this._v("  来优化你的事件处理程序。每种技术都有些许的不同，但是三个都是很有用的，而且能够互补。")])},function(){var t=this.$createElement,e=this._self._c||t;return e("ul",[e("li",[e("strong",[this._v("debounce")]),this._v("：将一系列迅速触发的事件（例如敲击键盘）合并成一个单独的事件。")]),e("li",[e("strong",[this._v("throttle")]),this._v("：确保一个持续的操作流以每 X 毫秒执行一次的速度执行。例如每 200ms 检查一下滚动条的位置来触发某个 CSS 动画。")]),e("li",[e("strong",[this._v("requestAnimationFrame")]),this._v("：throttle的一个替代品。适用于需要计算元素在屏幕上的位置和渲染的时候，能够保证动画或者变化的平滑性。注意：IE9 不支持。")])])}],!1,null,null,null);e.default=a.exports}}]);