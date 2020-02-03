# tree-shaking

想必了解一些前端工程化的人，或多或少都听说过 tree-shaking 这个词，有的只是听说，有的已经在项目中使用。笔者在做项目的时候，也遇到了这个有些令人捉摸不透的东西，遂希望能与大家一起解析与 tree-shaking 相关的尽可能多和全的点。

首先，我们需要知道，什么是 tree-shaking，我们做 tree-shaking 的目的是什么。

## 目的与前置了解

目的的话，我想到的最终极的目标就是：减少在生产环境下的文件体积。

为了这个目标，我们一直在不断地进行努力，比如说我们大多数生产环境的代码都是通过一些工具把文件进行压缩和混淆，这也是减少文件体积的办法之一，鉴于现在大多数项目都使用了webpack、rollup等构建工具，而这些工具里都无一不提供了类似 [uglify](https://github.com/mishoo/UglifyJS2) 的插件或者配置。

> UglifyJS is a JavaScript parser, minifier, compressor and beautifier toolkit.

现在官方使用的是 **`uglify-js@3`**，目前只支持 JavaScript (ECMAScript 5)。

而在目前的 webpack 4，内置的 `optimization.minimize` 使用的是[TerserPlugin](https://webpack.js.org/plugins/terser-webpack-plugin/)：

> A JavaScript parser and mangler/compressor toolkit for ES6+.
>
> **`terser`** is a fork of `uglify-es` that mostly retains API and CLI compatibility with `uglify-es` and `uglify-js@3`.

说明 [terser](https://github.com/terser/terser) 是支持 ES6语法的，而 **`uglify-js@3`**只支持到 ECMAScript 5。

## 什么是 tree-shaking

至于什么是 tree-shaking，我们先来看一段[维基百科](https://en.wikipedia.org/wiki/Tree_shaking)中的定义：

> In [computing](https://en.wikipedia.org/wiki/Computing), **tree shaking** is a [dead code elimination](https://en.wikipedia.org/wiki/Dead_code_elimination) technique that is applied when optimizing code written in [ECMAScript](https://en.wikipedia.org/wiki/ECMAScript) dialects like [Dart](https://en.wikipedia.org/wiki/Dart_(programming_language)), [JavaScript](https://en.wikipedia.org/wiki/JavaScript), or [TypeScript](https://en.wikipedia.org/wiki/TypeScript) into a single bundle that is loaded by a [web browser](https://en.wikipedia.org/wiki/Web_browser). Rather than eliminating code that can never be executed, tree shaking starts from entry point and includes only the code that is guaranteed to be executed.[[1\]](https://en.wikipedia.org/wiki/Tree_shaking#cite_note-1) It is succinctly described as "live code inclusion".

翻译过来就是：

tree-shaking 是一种死码消除（dead code elimination）技术，当使用 ECMAScript 语言（例如 Dart、Javascript 或者 TypeScript ）编写代码，在为生成浏览器加载的 bundle 文件做优化的时候，就会应用 tree-shaking。tree-shaking 不是消除那些永远不会执行的代码，而是从入口点开始，只包括那些一定会执行的代码。这也可以叫做 “live code inclusion”。

### 历史

死码消除对于动态语言来说要比静态语言要麻烦一些。“treeshaker”这个概念一开始出现在 LISP 这门语言中，时间是在上世纪九十年代。这个概念是说，所有可能会执行到的程序流可以被描述成由函数调用组成的树结构，这样那些不可能被调用的函数就可以被清除掉了。

这种算法最早是应用在  [Google Closure Tools](https://en.wikipedia.org/wiki/Google_Closure_Tools)，然后是 Dart 里面的 dart2js编译器，也是出自Google，在2012年的时候由Bob Nystrom阐述，然后在2013年在 Dart in Action 这本书中描述到：

> 当将代码从 Dart 转成 JavaScript的时候，编译器会做 “tree sshaking”。在 JavaScript中，即使你只需要一个库中的一个方法，也得引入整个库，但是有了 tree shaking，Dart 在转成 JavaScript 的时候，只需要引入需要的指定方法即可。— Chris Buckett

tree-shaking的下一次流行是来自2015年 Rich Harris 的 Rollup 项目。