# PART 1
## 2.14 Functions

### 默认参数：
``` js
function showMessage(from, text = "no text given") {
  alert( from + ": " + text );
}

showMessage("Ann"); // Ann: no text given
```

也可以是
``` js
function showMessage(from, text = anotherFunction()) {
  // anotherFunction() only executed if no text given
  // its result becomes the value of text
}
```

老式写法：
``` js
function showMessage(from, text) {
  if (text === undefined) {
    text = 'no text given';
  }

  alert( from + ": " + text );
}
// 或者
function showMessage(from, text) {
  // if text is falsy then text gets the "default" value
  text = text || 'no text given';
  ...
}
```

- 如果一个函数没有返回值，或者只是 return，那就等同于返回 undefined
``` js
function doNothing() { /* empty */ }
alert( doNothing() === undefined ); // true

function doNothing() {
  return;
}
alert( doNothing() === undefined ); // true
```

- 使用 `||`  改写 if else 和 三元运算符
``` js
function checkAge(age) {
  if (age > 18) {
    return true;
  } else {
    return confirm('Do you have your parents permission to access this page?');
  }
}
function checkAge(age) {
  return (age > 18) ? true : confirm('Did parents allow you?');
}
function checkAge(age) {
  return (age > 18) || confirm('Did parents allow you?');
}
```

## 2.15 Function expressions and arrows
- A Function Expression is created when the execution reaches it and is usable from then on.
- A Function Declaration is usable in the whole script/code block.
- When a Function Declaration is made within a code block, it is visible everywhere inside that block. But not outside of it.

## 6.1 Recursion and stack
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
``` js
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

``` js
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

