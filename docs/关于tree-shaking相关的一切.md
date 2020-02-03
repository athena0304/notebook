# 关于tree-shaking相关的一切

## 定义：什么是tree-shaking？

### webpack版本

webpack中的harmony是什么？

The 6th edition, initially known as ECMAScript 6 (**ES6**) then and later renamed to ECMAScript 2015, was finalized in June 2015.[[9\]](https://en.wikipedia.org/wiki/ECMAScript#cite_note-ES2015-9)[[27\]](https://en.wikipedia.org/wiki/ECMAScript#cite_note-27) This update adds significant new syntax for writing complex applications, including class declarations (`class Foo { ... }`), ES6 modules like `import * as moduleName from "..."; export const Foo`, but defines them semantically in the same terms as ECMAScript 5 strict mode. Other new features include iterators and `for...`o`f` loops, [Python](https://en.wikipedia.org/wiki/Python_(programming_language))-style generators, arrow function expression (`() => {...}`), `let` keyword for local declarations, `const` keyword for constant variable declarations, binary data, typed arrays, new collections (maps, sets and WeakMap), [promises](https://en.wikipedia.org/wiki/Futures_and_promises), number and math enhancements, reflection, proxies (metaprogramming for virtual objects and wrappers) and template literals for strings.[[28\]](https://en.wikipedia.org/wiki/ECMAScript#cite_note-28)[[29\]](https://en.wikipedia.org/wiki/ECMAScript#cite_note-29) The complete list is extensive.[[30\]](https://en.wikipedia.org/wiki/ECMAScript#cite_note-30)[[31\]](https://en.wikipedia.org/wiki/ECMAScript#cite_note-31) As the first "ECMAScript Harmony" specification, it is also known as "ES6 Harmony."

### rollup版本

## 原理：怎么做到tree-shaking的？

## How webpack 2 eliminates unused exports 

https://2ality.com/2015/12/webpack-tree-shaking.html 

webpack 2, a new version that is in beta, eliminates unused exports in two steps:

- First, all ES6 module files are combined into a single bundle file. In that file, exports that were not imported anywhere are not exported, anymore.
- Second, the bundle is minified, while eliminating dead code. Therefore, entities that are neither exported nor used inside their modules do not appear in the minified bundle. Without the first step, dead code elimination would never remove exports (registering an export keeps it alive).

Unused exports can only be reliably detected at build time if the module system has a static structure. Therefore, webpack 2 can parse and understand all of ES6 and only tree-shakes if it detects an ES6 module. However, only imports and exports are transpiled to ES5. If you want all of the bundle to be in ES5, you need a transpiler for the remaining parts of ES6. In this blog post, we’ll use Babel 6.

webpack 2 分两步消除未使用的export：

- 首先，所有的 ES6 模块文件都组合到一个单独的打包文件中。在该文件中，没有在任何地方import的export不会再被导出。
- 然后，将bundle压缩，同时消除 dead code。因此，既不导出也不在其模块内部使用的实体将不会出现在压缩后的bundle中。如果没有第一步，dead code消除没法做到移除export。

如果模块系统有静态结构，未使用的导出只能在构建时才能被可靠地检测出来。因此， webpack 2 可以解析和理解所有 ES6，并且如果检测是ES6模块，则只能 tree-shake。只有imports 和 exports 被转换成了ES5。如果你想要所有的bundle都转换成ES5，你需要一个转换器把ES6剩下的部分转换了。在这里我们使用ES6。

## 副作用：什么是side-effect？

*A "side effect" is defined as code that performs a special behavior when imported, other than exposing one or more exports. An example of this are polyfills, which affect the global scope and usually do not provide an export.*

side effect 是指一些代码在导入的时候执行了特殊的行为，而不是暴露一个或者多个export。一个例子是 polyfills，它会影响全局作用于，并且通常不提供导出。



通过ESLint帮助检测副作用

https://github.com/lukastaegert/eslint-plugin-tree-shaking

> Cannot determine side-effects of mutating function parameter

```js
{
          code: '(({a})=>{a.x = 1})(ext)',
          errors: [
            {
              message: 'Cannot determine side-effects of mutating function parameter',
              type: 'Identifier'
            }
          ]
        }
```

```js
{
          code: 'function x(a){a.y = 1; a.y = 2; a.y = 3}; x(ext)',
          errors: [
            {
              message: 'Cannot determine side-effects of mutating function parameter',
              type: 'Identifier'
            }
          ]
        },
```



```js
function baseGetTag(value) {
  if (value == null) {
    return value === undefined ? '[object Undefined]' : '[object Null]';
  }
  if (!(symToStringTag && symToStringTag in Object(value))) {
    return toString.call(value);
  }
  const isOwn = hasOwnProperty.call(value, symToStringTag);
  const tag = value[symToStringTag];
  let unmasked = false;
  try {
    value[symToStringTag] = undefined;
    unmasked = true;
  } catch (e) { }

  const result = toString.call(value);
  if (unmasked) {
    if (isOwn) {
      value[symToStringTag] = tag;
    } else {
      delete value[symToStringTag];
    }
  }
  return result;
}
```



![image-20191011150812055](/Users/athena/Library/Application Support/typora-user-images/image-20191011150812055.png)

> Cannot determine side-effects of calling member function



## 副作用实践

现在需要理清几个问题：

### package.json里的side-effect使用场景是什么？那些工具在哪个步骤中使用这个配置做了什么样的判断？



##### 使用src/index

hotel-utils里不加side-effect （v0.6.1）

![image-20191014184251452](/Users/athena/Library/Application Support/typora-user-images/image-20191014184251452.png)



hotel-utils里加`"sideEffects": false,` （v0.6.2）src-6.65kb

![image-20191014184437943](/Users/athena/Library/Application Support/typora-user-images/image-20191014184437943.png)

##### 使用esm

hotel-utils里不加side-effect （v0.7.0）

![image-20191014184844936](/Users/athena/Library/Application Support/typora-user-images/image-20191014184844936.png)

hotel-utils里加`"sideEffects": false,` （v0.7.1）

![image-20191014185014328](/Users/athena/Library/Application Support/typora-user-images/image-20191014185014328.png)

## 第三方包引用问题（如axios）





## 如何避免side-effect？

## rollup 和 webpack 的 tree-shaking有什么区别？

##  babel编译是否会产生副作用？





## 实践：自己动手，验证答案

### 1. A文件有一个对象 math，如果我只引用math里的一个方法，其它方法会不会被打进来？

test.js

```js
function square(x) {
  console.log('square')
  return x * x;
}

function cube(x) {
  console.log('cube')
  return x * x * x;
}

const math = {
  square,
  cube,
}

export { math }
```

index.js

```js
import { math } from './test.js'

console.log(math.cube(3))

```

output

math里面的都打进去了



### 2. 有两个文件，A文件export了两个方法，B文件里的FuncB用了A文件里的funA1，B文件导出了FuncB，在入口文件作为两个对象export出去。实际引用的时候是否能过滤掉未引用的代码？

test.js

```js
function funcA1() {
  console.log('funcA1');
}

function funcA2() {
  console.log('funcA2');
}

export {
  funcA1,
  funcA2
};
```

testb.js

```js
import { funcA1 } from './test';

function funcB() {
  console.log('funcB');
  funcA1();
}

export {
  funcB
};

```

index.js

```js
import * as testAObj from './test';
import * as testBObj from './testb';


export {
  testAObj,
  testBObj
};
```

Output:

```js
function funcA1() {
  console.log('funcA1');
}

function funcA2() {
  console.log('funcA2');
}

var test = /*#__PURE__*/Object.freeze({
  funcA1: funcA1,
  funcA2: funcA2
});

function funcB() {
  console.log('funcB');
  funcA1();
}

var testb = /*#__PURE__*/Object.freeze({
  funcB: funcB
});

export { test as testAObj, testb as testBObj };

```

业务代码引用：

```
import { testBObj } from '@mfw/hotel-utils';
console.log(testBObj.funcB)
```

最终生成代码中没有funcA2



##  webpack

https://webpack.js.org/plugins/babel-minify-webpack-plugin/

You can also use [babel-loader](https://github.com/babel/babel-loader) for webpack and include `minify` [as a preset](https://github.com/babel/minify#babel-preset) and should be much faster than using this - as babel-minify will operate on smaller file sizes. But then, why does this plugin exist at all? -

你也可以在webpack中使用 [babel-loader](https://github.com/babel/babel-loader)，然后引用 `minify` 作为[预设](https://github.com/babel/minify#babel-preset)，这样会比单独使用这个更快，因为babel-minify会作用于更小的文件上面。那么为什么这个插件依然存在呢？

- A webpack loader operates on single files and the minify preset as a webpack loader is going to consider each file to be executed directly in the browser global scope (by default) and will not optimize some things in the toplevel scope. To enable optimizations to take place in the top level scope of the file, use `mangle: { topLevel: true }` in minifyOptions.
- webpack loader 是作用于单个文件的，所以这个minify的预设作为webpack的loader，会考虑每个文件会直接在浏览器的全局作用域中执行，在顶层作用域中不会做任何优化。为了在文件的顶层作用域做一些优化，在minifyOptions中使用  `mangle: { topLevel: true }` 。
- When you exclude `node_modules` from being run through the babel-loader, babel-minify optimizations are not applied to the excluded files as it doesn't pass through the minifier.
- 当你在运行 babel-loader 的时候，把 `node_modules`排除在外，babel-minify optimizations不会应用于这些被排除的文件，因为它没有通过minifier。
- When you use the babel-loader with webpack, the code generated by webpack for the module system doesn't go through the loader and is not optimized by babel-minify.
- 当你使用webpack结合babel-loader的时候，通过 webpack 为模块系统生成的代码不会通过这个loader，也不会被babel-minify优化。
- A webpack plugin can operate on the entire chunk/bundle output and can optimize the whole bundle and you can see some differences in minified output. But this will be a lot slower as the file size is usually really huge. So there is [another idea](https://github.com/webpack-contrib/babel-minify-webpack-plugin/issues/8) where we can apply some optimizations as a part of the loader and some optimizations in a plugin.
- webpack 插件可以作用于整个输出的 chunk/bundle 上，并且可以优化整个 bundle，你可以在压缩的输出版本看到一些不同。但这会慢一些，因为文件大小通常会很大。所以还有另一种想法，就是我们可以作为loader的一部分应用一些optimizations，然后再插件中再做一些optimizations。
- 