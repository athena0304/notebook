

# 高级函数

## 6.1 Recursion and stack-递归和栈

Iterative：迭代

Recursive： 递归

execution context.：执行上下文

execution context stack：执行上下文栈

一个函数运行的信息被存储在它的**执行上下文**中。

The execution context is an internal data structure that contains details about the execution of a function: where the control flow is now, the current variables, the value of this (we don’t use it here) and few other internal details.

执行上下文是一种内部的数据结构，包含了函数执行的细节：控制流的位置、当前的变量、this的值和一些少量的其它内部细节。

Context: { x: 2, n: 3, at line 5 } pow(2, 3)

Any recursion can be rewritten as a loop.

任何递归都可以用循环来重写。



### 递归遍历

求公司所有人的工资总和

```js
let company = { // the same object, compressed for brevity
  sales: [{name: 'John', salary: 1000}, {name: 'Alice', salary: 600 }],
  development: {
    sites: [{name: 'Peter', salary: 2000}, {name: 'Alex', salary: 1800 }],
    internals: [{name: 'Jack', salary: 1300}]
  }
};

// The function to do the job
function sumSalaries(department) {
  if (Array.isArray(department)) { // case (1)
    return department.reduce((prev, current) => prev + current.salary, 0); // sum the array
  } else { // case (2)
    let sum = 0;
    for (let subdep of Object.values(department)) {
      sum += sumSalaries(subdep); // recursively call for subdepartments, sum the results
    }
    return sum;
  }
}

alert(sumSalaries(company)); // 6700
```

## 6.2 Rest parameters and spread operator-剩余参数与展开运算符

### 参数的两种形式：

- 若 `...` 出现在函数的参数列表，那它表示的就是 Rest 参数，它会把函数多余的实参收集到一个数组中。
- 若 `...` 出现在函数调用或类似的表达式中，那它就是 Spread 操作符，它会把一个数组展开为逗号分隔的元素列表。

#### 剩余参数

剩余参数用 `...args` 表示，意思就是把剩余的参数放在数组 `args` 中

例如将所有参数加和：

```js
function sumAll(...args) { // 数组变量名为 args
  let sum = 0;

  for (let arg of args) sum += arg;

  return sum;
}

alert( sumAll(1) ); // 1
alert( sumAll(1, 2) ); // 3
alert( sumAll(1, 2, 3) ); // 6
```

也可以前面定义一些参数，然后再把剩下的参数收集起来。

```js
function showName(firstName, lastName, ...titles) {
  alert( firstName + ' ' + lastName ); // Julius Caesar

  // titles 数组中包含了剩余的参数
  // 也就是有 titles = ["Consul", "Imperator"]
  alert( titles[0] ); // Consul
  alert( titles[1] ); // Imperator
  alert( titles.length ); // 2
}

showName("Julius", "Caesar", "Consul", "Imperator");
```

#### "arguments" 变量

arguments是类数组，可遍历，但是没有数组原型链上的函数，所以不能直接调用一些数组方法。

```js
function showName() {
  alert( arguments.length );
  alert( arguments[0] );
  alert( arguments[1] );

  // 它是可遍历的
  // for(let arg of arguments) alert(arg);
}

// 依次弹出提示：2，Julius，Caesar
showName("Julius", "Caesar");

// 依次弹出提示：1，Ilya，undefined（不存在第二个参数）
showName("Ilya");
```

另外，箭头函数没有 arguments，而是属于外部普通的函数：

```js
function f() {
  let showArg = () => alert(arguments[0]);
  showArg();
}

f(1); // 1
```

箭头函数没有this，也没有arguments

### 扩展运算符

扩展运算符与剩余参数相反的过程，一个是函数的参数，一个是函数调用的时候使用

一个是把参数收集为数组，一个是把数组展开为参数列表。

```js
let arr = [3, 5, 1];

alert( Math.max(...arr) ); // 5（Spread 操作符把数组转为参数列表）
```

```js
let arr = [3, 5, 1];
let arr2 = [8, 9, 15];

*!*
let merged = [0, ...arr, 2, ...arr2];
*/!*

alert(merged); // 0,3,5,1,2,8,9,15（0，然后是 arr 的值，2，然后是 arr2 的值）
```

还可以展开字符串

```js
let str = "Hello";

alert( [...str] ); // H,e,l,l,o
```

也可以用 `Array.from` 来实现：

```js
let str = "Hello";

// Array.from 会将可遍历对象转为数组
alert( Array.from(str) ); // H,e,l,l,o
```

- `Array.from` 同时适用于类数组对象和可遍历对象。
- Spread 操作符只能操作可遍历对象。

## 6.3 闭包

### 词法环境

在 JavaScript 中，每个运行的函数、代码块或整个程序，都有一个称为**词法环境（Lexical Environment）**的关联对象。

词法环境（Lexical Environment）分为两部分：

- 1. *Environment Record* – an object that has all local variables as its properties (and some other information like the value of `this`).
  2. A reference to the *outer lexical environment*, usually the one associated with the code lexically right outside of it (outside of the current curly brackets).

1. 环境记录——是一个对象，所有本地变量作为其属性（还有一些其它信息，比如 `this` 的值）
2. 对外部词法环境的引用，通常与它外部（当前花括号外部）的代码在词法上相关联。

全局词法环境（global Lexical Environment）没有外部引用，指向 `null`

![img](https://javascript.info/article/closure/lexical-environment-global.png)



![img](https://javascript.info/article/closure/lexical-environment-global-2.png)



- 变量是特定内部对象的属性，与当前执行的（代码）块/函数/脚本有关。
- 操作变量实际上操作的是该对象的属性。

#### 函数声明

函数声明不是在执行到达时处理的，而是在创建词汇环境时处理的。对于全局词法环境来说，就是脚本开始的时候。

![img](https://javascript.info/article/closure/lexical-environment-global-3.png)



#### 内部和外部词法环境

当函数运行时，会自动创建一个新的函数词法环境。所有函数都遵循这一规则。这个词法环境是用来存储局部变量和调用的参数的。

下图是当函数执行到 `say("John")` 里面的时候：

![img](https://javascript.info/article/closure/lexical-environment-simple.png)

**当代码试图访问一个变量时 —— 它首先会在内部词法环境中进行搜索，然后是外部环境，然后是更外部的环境，直到（词法环境）链的末尾。**

在严格模式下，变量未定义会导致错误。在非严格模式下，为了向后兼容，给未定义的变量赋值会创建一个全局变量。

![img](https://javascript.info/article/closure/lexical-environment-simple-lookup.png)



函数是在执行到它的时候访问外部变量，也就是使用的是最新的值。

每执行一个函数就会创建一个词法环境。

如果一个函数被多次调用，那么每次调用都有自己的词法环境，其中有特定于该运行的局部变量和参数。

#### 嵌套函数

```js
function makeCounter() {
  let count = 0;

  return function() {
    return count++; // has access to the outer counter
  };
}

let counter = makeCounter();

alert( counter() ); // 0
alert( counter() ); // 1
alert( counter() ); // 2

```

![img](https://javascript.info/article/closure/lexical-search-order@2x.png)

1. The locals of the nested function…
2. The variables of the outer function…
3. And so on until it reaches global variables.

In this example `count` is found on step `2`. When an outer variable is modified, it’s changed where it’s found. So `count++` finds the outer variable and increases it in the Lexical Environment where it belongs. Like if we had `let count = 1`.

they automatically remember where they were created using a hidden `[[Environment]]`property, and all of them can access outer variables.

When on an interview, a frontend developer gets a question about “what’s a closure?”, a valid answer would be a definition of the closure and an explanation that all functions in JavaScript are closures, and maybe few more words about technical details: the `[[Environment]]` property and how Lexical Environments work.

#### Code blocks and loops, IIFE

上面讲的都是函数，词法环境也存在于块 `{...}`。

##### if

![img](https://javascript.info/article/closure/lexenv-if@2x.png)

"if-only" 词法环境

##### For, thile

```js
for (let i = 0; i < 10; i++) {
  // Each loop has its own Lexical Environment
  // {i: value}
}

alert(i); // Error, no such variable
```

##### Code blocks

```js
{
  // do some job with local variables that should not be seen outside

  let message = "Hello";

  alert(message); // Hello
}

alert(message); // Error: message is not defined
```

##### IIFE

immediately-invoked function expressions 立即调用函数表达式

函数本身不能同时声明和调用，需要包裹一个圆括号，说明函数是在另一个表达式上下文中创建的，也就是说是一个函数表达式，这样就不需要名字也可以被直接调用。

### 任务

#### Filter through function

数组中有个内建的 `arr.filter(f)` 方法。它通过函数 `f` 过滤元素。如果元素返回 `true` 的，那么该元素会被返回到结果数组中。

制造一系列『马上能用』的过滤器：

- `inBetween(a, b)` —— 在 `a` 和 `b` 之间或与它们相等（包括）。
- `inArray([...])` —— 包含在给定的数组中。

用法如下所示：

- `arr.filter(inBetween(3,6))` —— 只挑选 3 和 6 之间的值。
- `arr.filter(inArray([1,2,3]))` —— 只挑选与 `[1,2,3]` 其中成员匹配的元素。

举个例子：

```js
/* .. inBetween 和 inArray 的代码 */
let arr = [1, 2, 3, 4, 5, 6, 7];
alert( arr.filter(inBetween(3, 6)) ); // 3,4,5,6
alert( arr.filter(inArray([1, 2, 10])) ); // 1,2
```

答：

```js
function inBetween(a, b) {
  return function(x) {
    return x >= a && x <= b;
  };
}

let arr = [1, 2, 3, 4, 5, 6, 7];
alert( arr.filter(inBetween(3, 6)) ); // 3,4,5,6

```

```js
function inArray(arr) {
  return function(x) {
    return arr.includes(x);
  };
}

let arr = [1, 2, 3, 4, 5, 6, 7];
alert( arr.filter(inArray([1, 2, 10])) ); // 1,2
```

#### Sort by field

我们有一组要排序的对象：

```js
let users = [
  { name: "John", age: 20, surname: "Johnson" },
  { name: "Pete", age: 18, surname: "Peterson" },
  { name: "Ann", age: 19, surname: "Hathaway" }
];
```

通常的做法应该是这样的：

```js
// 通过 name (Ann, John, Pete)
users.sort((a, b) => a.name > b.name ? 1 : -1);

// 通过 age (Pete, Ann, John)
users.sort((a, b) => a.age > b.age ? 1 : -1);
```

我们可以让它更加简洁吗，比如这样？

```js
users.sort(byField('name'));
users.sort(byField('age'));
```

那么，我们只需要写 `byField(fieldName)`，而不是写一个函数。

编写可用于此目的的函数 `byField`。

答：

```js
function byField(field) {
  return (a, b) => a[field] > b[field] ? 1 : -1;
}
```

## 6.4 The old "var"

`var` 会忽略块级作用域

变量声明在函数开始时处理

## 6.5 Global object-全局对象

全局对象在浏览器下是 `window`

在 Node.Js 下是 `global`

var声明的是全局对象的变量，但是let/const声明的不是

```js
let user = "John";
alert(user); // John

alert(window.user); // undefined, don't have let
alert("user" in window); // false

var phrase = "Hello";
alert( window.phrase ); // Hello (global var)
```

注意：

在 ES-2015之前，全局变量是用来当做全局环境记录的，在这之后，是由全局词法环境来进行环境记录，而全局对象只是提供了一些全局变量而已。实际上来说， let/const 是全局环境记录的变量，而不属于全局对象。

## 6.6 Function object, NFE

函数对象有 name 属性

上下文命名：contextual name，如果函数没有提供名称，就去上下文的赋值中寻找。

length 属性，可以返回函数参数的个数

```javascript
function f1(a) {}
function f2(a, b) {}
function many(a, b, ...more) {}

alert(f1.length); // 1
alert(f2.length); // 2
alert(many.length); // 2
```

剩余参数不作数。

Named Function Expression：NFE 命名函数表达式

```javascript
let sayHi = function func(who) {
  alert(`Hello, ${who}`);
};
```

使用场景：

```javascript
let sayHi = function func(who) {
  if (who) {
    alert(`Hello, ${who}`);
  } else {
    func("Guest"); // Now all fine
  }
};

let welcome = sayHi;
sayHi = null;

welcome(); // Hello, Guest (nested call works)
```

这种命名只能用在函数表达式上，不能用在函数声明上面。

它们创建一个「主」函数，然后给它附加很多其它「helper」函数。比如，[jquery](https://jquery.com/) 库创建了一个名为 `$` 的函数。[lodash](https://lodash.com/) 库创建一个 `_` 函数。然后添加了 `_.add`、`_.keyBy` 以及其它属性。

### 任务

Write function `sum` that would work like this:

```javascript
sum(1)(2) == 3; // 1 + 2
sum(1)(2)(3) == 6; // 1 + 2 + 3
sum(5)(-1)(2) == 6
sum(6)(-1)(-2)(-3) == 0
sum(0)(1)(2)(3)(4)(5) == 15
```

1. sum返回的必须是函数
2. 函数必须记住当前的总数
3. 返回的是函数，函数是对象，但是要 == 于数字，所以要转换成原始值

```javascript
let user = {
  name: "John",
  money: 1000,

  // for hint="string"
  toString() {
    return `{name: "${this.name}"}`;
  },

  // for hint="number" or "default"
  valueOf() {
    return this.money;
  }

};

alert(user); // toString -> {name: "John"}
alert(+user); // valueOf -> 1000
alert(user + 500); // valueOf -> 1500
```

```javascript
function sum(a) {

  let currentSum = a;

  function f(b) {
    currentSum += b;
    return f;
  }

  f.toString = function() {
    return currentSum;
  };

  return f;
}

alert( sum(1)(2) ); // 3
alert( sum(5)(-1)(2) ); // 6
alert( sum(6)(-1)(-2)(-3) ); // 0
alert( sum(0)(1)(2)(3)(4)(5) ); // 15
```

## 6.7 The "new Function" syntax

```js
let func = new Function ([arg1[, arg2[, ...argN]],] functionBody)
```

```js
let sum = new Function('a', 'b', 'return a + b'); 

alert( sum(1, 2) ); // 3
```

所有的参数都是字符串

### 闭包

通常，函数会使用一个特殊的属性 `[[Environment]]` 来记录函数创建时的环境，它具体指向了函数创建时的词法环境。

但是如果我们使用 `new Function` 创建函数，函数的 `[[Environment]]` 并不指向当前的词法环境，而是指向全局环境。

```javascript
function getFunc() {
  let value = "test";

  let func = new Function('alert(value)');

  return func;
}

getFunc()(); // error: value is not defined
```

```javascript
function getFunc() {
  let value = "test";

  let func = function() { alert(value); };

  return func;
}

getFunc()(); // "test", from the Lexical Environment of getFunc
```

## 6.8 Scheduling: setTimeout and setInterval

scheduling a call

### setTimeout

语法：

```javascript
let timerId = setTimeout(func|code, delay[, arg1, arg2...])
```

```javascript
function sayHi(phrase, who) {
  alert( phrase + ', ' + who );
}

setTimeout(sayHi, 1000, "Hello", "John"); // Hello, John
```

#### clearTimeout

```javascript
let timerId = setTimeout(() => alert("never happens"), 1000);
alert(timerId); // timer identifier

clearTimeout(timerId);
alert(timerId); // same identifier (doesn't become null after canceling)
```

### setInterval

```javascript
let timerId = setInterval(func|code, delay[, arg1, arg2...])
```

```javascript
// repeat with the interval of 2 seconds
let timerId = setInterval(() => alert('tick'), 2000);

// after 5 seconds stop
setTimeout(() => { clearInterval(timerId); alert('stop'); }, 5000);
```

### [Recursive setTimeout](https://javascript.info/settimeout-setinterval#recursive-settimeout)

```javascript
/** instead of:
let timerId = setInterval(() => alert('tick'), 2000);
*/

let timerId = setTimeout(function tick() {
  alert('tick');
  timerId = setTimeout(tick, 2000); // (*)
}, 2000);
```

pseudocode： 伪代码

#### 垃圾回收：

当一个函数传入 `setInterval/setTimeout` 时，会创建一个内部引用，并保存在调度器中。这样会防止函数被垃圾回收，即使是没有别的引用到它。

```javascript
// the function stays in memory until the scheduler calls it
setTimeout(function() {...}, 100);
```

对于 `setInterval`，直到调用 `clearInterval` 才会被清除掉。

这会有副作用，函数引用了外部词法环境，那么外部变量也就会活着。它们可能会耗费比函数本身更多的内存。所以即使是很小的函数，如果不需要了，也最好是要清空。

### setTimeout(…,0)

有一种特殊的用法，可以看做是异步：*asynchronously*

`setTimeout(func, 0)`

当前代码执行完后立即执行

```javascript
setTimeout(() => alert("World"), 0);

alert("Hello");
```

### Splitting CPU-hungry tasks

```javascript
let i = 0;

let start = Date.now();

function count() {

  // do a heavy job
  for (let j = 0; j < 1e9; j++) {
    i++;
  }

  alert("Done in " + (Date.now() - start) + 'ms');
}

count();
```

给浏览器渲染提供喘息的机会

```markup
<div id="progress"></div>

<script>
  let i = 0;

  function count() {

    // do a piece of the heavy job (*)
    do {
      i++;
      progress.innerHTML = i;
    } while (i % 1e3 != 0);

    if (i < 1e9) {
      setTimeout(count, 0);
    }

  }

  count();
</script>
```

## 6.9 Decorators and forwarding, call/apply

### 缓存装饰器

如果一个函数负载比较重，但是结果是稳定的，对于相同的输入，总是返回相同的结果的话，就可以缓存这些结果。创建一个装饰器。

```js
function slow(x) {
  // 这里可能会有重负载的CPU密集型工作
  alert(`Called with ${x}`);
  return x;
}

function cachingDecorator(func) {
  let cache = new Map();

  return function(x) {
    if (cache.has(x)) { // 如果结果在 map 里
      return cache.get(x); // 返回它
    }

    let result = func(x); // 否则就调用函数

    cache.set(x, result); // 然后把结果缓存起来
    return result;
  };
}

slow = cachingDecorator(slow);

alert( slow(1) ); // slow(1) 被缓存起来了
alert( "Again: " + slow(1) ); // 一样的

alert( slow(2) ); // slow(2) 被缓存起来了
alert( "Again: " + slow(2) ); // 也是一样
```

在上面的代码中，`cachingDecorator` 是一个**装饰器**：一个特殊的函数，它接受另一个函数并改变它的行为。

把缓存写在外面的装饰器的好处：

- `cachingDecorator` 可以被重用，应用于其它函数。
- 缓存的逻辑是分开的，没有增加 `slow` 函数本身的复杂度。
- 如果需要，可以绑定多个装饰器

### Using “func.call” for the context

如果是对象中的方法，就需要绑定上下文了。

```javascript
func.call(context, arg1, arg2, ...)
```

```javascript
let worker = {
  someMethod() {
    return 1;
  },

  slow(x) {
    alert("Called with " + x);
    return x * this.someMethod(); // (*)
  }
};

function cachingDecorator(func) {
  let cache = new Map();
  return function(x) {
    if (cache.has(x)) {
      return cache.get(x);
    }
    let result = func.call(this, x); // "this" is passed correctly now
    cache.set(x, result);
    return result;
  };
}

worker.slow = cachingDecorator(worker.slow); // now make it caching

alert( worker.slow(2) ); // works
alert( worker.slow(2) ); // works, doesn't call the original (cached)
```

this 是怎么传递的：

1. 在装饰器过后， `worker.slow` 现在是 wrapper `function (x) { ... }`。
2. 当  `worker.slow(2)` 执行的时候，wrapper 接受 2 作为参数， 然后  `this=worker` （点前面的对象）
3. 在 wrapper 内部，如果没有被缓存过，则 `func.call(this, x)` 将当前的 `this`(`=worker`) 和当前的参数 (`=2`) 传递给原始函数。

### Going multi-argument with “func.apply”

如果是多参数怎么办呢，首先需要解决的如何缓存多参数/双参数

1. 实现一个新的类似map的数据结构（或使用第三方库），更加通用，能够允许多键。
2. 使用嵌套 map，如 `cache.get(min).get(max)`。
3. 把两个值合成一个。在这个例子中可以直接使用字符串  `"min,max"` 作为 `Map` 的键。为了灵活性，我们可以允许为装饰器提供**散列函数**，它知道如何从多个中创建一个值。

这里使用第三种方法。

下一个问题是如何将多参数传递给`func`。

```javascript
func.apply(context, args)
```

使用展开运算符的话，call 和 apply 就都可以实现了：

```javascript
let args = [1, 2, 3];

func.call(context, ...args); // pass an array as list with spread operator
func.apply(context, args);   // is same as using apply
```

但二者还是有区别的：

- 展开运算符 `…` 允许传递可迭代的 `args` 给 `call`。
- `apply` 只能接受类数组 `args`

`apply` 最重要的用途之一是将调用传递给另一个函数，如下所示：

```js
let wrapper = function() {
  return anotherFunction.apply(this, arguments);
};
```

```javascript
let worker = {
  slow(min, max) {
    alert(`Called with ${min},${max}`);
    return min + max;
  }
};

function cachingDecorator(func, hash) {
  let cache = new Map();
  return function() {
    let key = hash(arguments); // (*)
    if (cache.has(key)) {
      return cache.get(key);
    }

    let result = func.apply(this, arguments); // (**)

    cache.set(key, result);
    return result;
  };
}

function hash(args) {
  return args[0] + ',' + args[1];
}

worker.slow = cachingDecorator(worker.slow, hash);

alert( worker.slow(3, 5) ); // works
alert( "Again " + worker.slow(3, 5) ); // same (cached)
```

### Borrowing a method

如果是多参数怎么办呢，传进去的 arguments 是伪数组，不能直接调用 join，所以需要借用一下

```javascript
function hash() {
  alert( [].join.call(arguments) ); // 1,2
}

hash(1, 2);
```

The trick is called *method borrowing*.

需要注意的一点是如果原函数有自己的属性，那么装饰器则不会提供。

### 任务

#### Delaying decorator

```javascript
function delay(f, ms) {

  return function() {
    setTimeout(() => f.apply(this, arguments), ms);
  };

}
```

如果不用箭头函数，要事先提取出参数和 this：

```javascript
function delay(f, ms) {

  // added variables to pass this and arguments from the wrapper inside setTimeout
  return function(...args) {
    let savedThis = this;
    setTimeout(function() {
      f.apply(savedThis, args);
    }, ms);
  };

}
```

### Debounce decorator

```javascript
function debounce(f, ms) {

  let isCooldown = false;

  return function() {
    if (isCooldown) return;

    f.apply(this, arguments);

    isCooldown = true;

    setTimeout(() => isCooldown = false, ms);
  };

}
```

- `isCooldown = false` – ready to run.
- `isCooldown = true` – waiting for the timeout.

### Throttle decorator

```javascript
function throttle(func, ms) {

  let isThrottled = false,
    savedArgs,
    savedThis;

  function wrapper() {

    if (isThrottled) { // (2)
      savedArgs = arguments;
      savedThis = this;
      return;
    }

    func.apply(this, arguments); // (1)

    isThrottled = true;

    setTimeout(function() {
      isThrottled = false; // (3)
      if (savedArgs) {
        wrapper.apply(savedThis, savedArgs);
        savedArgs = savedThis = null;
      }
    }, ms);
  }

  return wrapper;
}
```