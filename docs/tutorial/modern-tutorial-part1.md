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

## 4.1 Object

### 计算属性

```js
let fruit = prompt("Which fruit to buy?", "apple");

let bag = {
  [fruit]: 5, // the name of the property is taken from the variable fruit
};

alert( bag.apple ); // 5 if fruit="apple"
```

```js
let fruit = 'apple';
let bag = {
  [fruit + 'Computers']: 5 // bag.appleComputers = 5
};
```

### 属性值简写

```js
let user = {
  name,  // same as name:name
  age: 30
};
```

### 检查是否存在

可以用 `in` 操作符

```js
let user = { name: "John", age: 30 };

alert( "age" in user ); // true, user.age exists
alert( "blabla" in user ); // false, user.blabla doesn't exist

let key = "age";
alert( key in user ); // true, takes the name from key and checks for such property
```

如果存的就是 `undefined`：

```js
let obj = {
  test: undefined
};

alert( obj.test ); // it's undefined, so - no such property?

alert( "test" in obj ); // true, the property does exist!
```

### Ordered like an object

如果对象属性是整数，则按照升序排列，其它则以创建时的顺序为准。

如果不希望有整数属性排序的限制，在前面添加加号 `+` 即可。

整数属性是指一个字符串能转成一个整数，又能原封不动的转换回来：

```js
/ Math.trunc is a built-in function that removes the decimal part
alert( String(Math.trunc(Number("49"))) ); // "49", same, integer property
alert( String(Math.trunc(Number("+49"))) ); // "49", not same "+49" ⇒ not integer property
alert( String(Math.trunc(Number("1.2"))) ); // "1", not same "1.2" ⇒ not integer property
```

### 复制和合并，Object.assign

我们也可以用[Object.assign](mdn:js/Object/assign) 来实现。

语法是：

```js
Object.assign(dest[, src1, src2, src3...])
```

- 参数 `dest` 和 `src1, ..., srcN` （可以有很多个）是对象。
- 这个方法复制了 `src1, ..., srcN` 的所有对象到 `dest`。换句话说，从第二个参数开始，所有对象的属性都复制给了第一个参数对象，然后返回 `dest`。



有一个标准的深拷贝算法，解决上面和一些更复杂的情况，叫做 [Structured cloning algorithm](https://w3c.github.io/html/infrastructure.html#internal-structured-cloning-algorithm)。为了不重复造轮子，我们使用它的一个 JS 实现的库 [lodash](https://lodash.com), 方法名叫做 [_.cloneDeep(obj)](https://lodash.com/docs#cloneDeep)。

### 任务

#### 检查是否为空

Write the function `isEmpty(obj)` which returns `true` if the object has no properties, `false` otherwise.

```
let schedule = {};

alert( isEmpty(schedule) ); // true

schedule["8:30"] = "get up";

alert( isEmpty(schedule) ); // false
```

solution：

```js
function isEmpty(obj) {
  for (let key in obj) {
    return false;
  }
  return true;
}
```

## 4.2 Garbage collection 垃圾回收

### Reachability 可达性

Javascript 中，内存管理的主要概念就是可达性。

1. 有一些基本的的可达值，这些值明显不能被释放。

   比方说：

   - 当前函数的局部变量和参数。
   - 嵌套调用时，当前调用链上所有函数的变量与参数。
   - 全局变量。
   - （还有一些内部的）

   这些值被称作**根**。

2. 如果一个值可以通过引用或引用链，从根值访问到，则认为这个值是可达的。

在 JavaScript 引擎中有一个被称作[垃圾回收器](https://en.wikipedia.org/wiki/Garbage_collection_(computer_science))的东西在后台执行。它监控着所有对象的状态，并删除掉那些已经不可达的。

### 内部算法

The basic garbage collection algorithm is called “mark-and-sweep”.

JavaScript engines apply many optimizations to make it run faster and not affect the execution.

Some of the optimizations:

- **Generational collection** – objects are split into two sets: “new ones” and “old ones”. Many objects appear, do their job and die fast, they can be cleaned up aggressively. Those that survive for long enough, become “old” and are examined less often.
- **Incremental collection** – if there are many objects, and we try to walk and mark the whole object set at once, it may take some time and introduce visible delays in the execution. So the engine tries to split the garbage collection into pieces. Then the pieces are executed one by one, separately. That requires some extra bookkeeping between them to track changes, but we have many tiny delays instead of a big one.
- **Idle-time collection** – the garbage collector tries to run only while the CPU is idle, to reduce the possible effect on the execution.

## 4.3 Symbol

对象的属性键只能是字符串或者是 Symbol。

```js
let id = Symbol();
```

Symbol 是唯一的：

```js
let id1 = Symbol("id");
let id2 = Symbol("id");

*!*
alert(id1 == id2); // false
*/!*
```

在对象字面量中使用：

```js
let id = Symbol("id");

let user = {
  name: "John",
  [id]: 123 // 不仅仅是 "id：123"
};
```

Symbol 属性不参与 `for...in` 循环。

Object.assign 复制所有属性，包括字符串和 Symbol

### 全局 Symbol

全局 symbol 注册表 *global symbol registry*

```js
// 从全局注册表中读取
let id = Symbol.for("id"); // 如果该 Symbol 不存在，则创建它

// 再次读取
let idAgain = Symbol.for("id");

// 相同的 Symbol
alert( id === idAgain ); // true
```

```js
let sym = Symbol.for("name");
let sym2 = Symbol.for("id");

// 从 symbol 中获取 name
alert( Symbol.keyFor(sym) ); // name
alert( Symbol.keyFor(sym2) ); // id
```

### 系统 Symbol

- `Symbol.hasInstance`
- `Symbol.isConcatSpreadable`
- `Symbol.iterator`
- `Symbol.toPrimitive`
- ...等等。

## 4.4 Object methods, "this"

```js
// these objects do the same

let user = {
  sayHi: function() {
    alert("Hello");
  }
};

// method shorthand looks better, right?
let user = {
  sayHi() { // same as "sayHi: function()"
    alert("Hello");
  }
};
```

### 内部：引用类型

```js
let user = {
  name: "John",
  hi() { alert(this.name); },
  bye() { alert("Bye"); }
};

user.hi(); // John (the simple call works)

// now let's call user.hi or user.bye depending on the name
(user.name == "John" ? user.hi : user.bye)(); // Error!
```

This works (object dot method):

```javascript
user.hi();
```

This doesn’t (evaluated method):

```javascript
(user.name == "John" ? user.hi : user.bye)(); // Error!
```

**To make user.hi() calls work, JavaScript uses a trick – the dot '.' returns not a function, but a value of the special Reference Type.**

引用类型的值是三点的结合 `(base, name, strict)`，如下：

- `base` 是对象。
- `name` 是属性。
- 当 `use strict` 生效，`strict` 为真。

`user.hi` 属性访问的值不是函数，而是引用类型的值。在严格模式下，`user.hi` 是：

```
// 引用类型值
(user, "hi", true)
```

当在引用类型上用 `()` 调用时，它们接收到这个对象和它的方法的所有信息，并且设定正确的 `this` 值（这里等于 `user`）。

`hi = user.hi` 赋值等其他的操作，将引用类型作为一个整体丢弃，只获取 `user.hi`（一个函数）的值进行传递。因此，进一步操作『失去』了 `this`（值）。

所以如果直接使用点 `obj.method()` 或方括号语法 `obj[method]()`（它们在这里并无差别）调用函数，那么作为结果，`this`值会以正确的方式进行传递。

### 箭头函数没有自己的 "this"

```js
let user = {
  firstName: "Ilya",
  sayHi() {
    let arrow = () => alert(this.firstName);
    arrow();
  }
};

user.sayHi(); // Ilya
```

The value of `this` is defined at run-time.

this 的值是在运行时定义的：

- When a function is declared, it may use `this`, but that `this` has no value until the function is called.
- That function can be copied between objects.
- When a function is called in the “method” syntax: `object.method()`, the value of `this` during the call is `object`.

## 4.5 Object to primitive conversion

### ToPrimitive

#### string

```js
// output
alert(obj);

// using object as a property key
anotherObj[obj] = 123;
```

#### number

```js
// explicit conversion
let num = Number(obj);

// maths (except binary plus)
let n = +obj; // unary plus
let delta = date1 - date2;

// less/greater comparison
let greater = user1 > user2;
```

#### default

默认与number一样

**To do the conversion, JavaScript tries to find and call three object methods:**

1. Call `obj[Symbol.toPrimitive](hint)` if the method exists,

2. Otherwise if hint is "string"
   - try `obj.toString()` and `obj.valueOf()`, whatever exists.

3. Otherwise if hint is"number"or"default"
   - try `obj.valueOf()` and `obj.toString()`, whatever exists.

## 4.6 Constructor, operator "new"

### 构造函数

构造函数约定：

1. 首字母大写
2. 只能用 new 操作符执行

```js
function User(name) {
  this.name = name;
  this.isAdmin = false;
}

let user = new User("Jack");

alert(user.name); // Jack
alert(user.isAdmin); // false
```

当函数作为 `new User(...)` 执行，会遵循下面的步骤：

1. 创建一个新的空对象，然后分配 `this`。
2. 函数体执行。通常会修改 `this`，为其添加新的属性。
3. 返回 `this` 的值。

就像下面这样：

```js
function User(name) {
  // this = {};  (implicitly)

  // add properties to this
  this.name = name;
  this.isAdmin = false;

  // return this;  (implicitly)
}
```

### 构造函数的return

如果返回的是对象，则返回该对象，而不是 this，如果是原始值，则被忽略，还是返回this

```js
function BigUser() {

  this.name = "John";

  return { name: "Godzilla" };  // <-- returns an object
}

alert( new BigUser().name );  // Godzilla, got that object ^^

function SmallUser() {

  this.name = "John";

  return; // finishes the execution, returns this

  // ...

}

alert( new SmallUser().name );  // John
```

## 5.2 Numbers

JavaScript 中的所有数字都以 64 位格式 [IEEE-754](http://en.wikipedia.org/wiki/IEEE_754-1985) 存储，也称为“双精度”。

```js
let billion = 1e9;  // 1 billion, literally: 1 and 9 zeroes
alert( 7.3e9 );  // 7.3 billions (7,300,000,000)

let ms = 0.000001;
let ms = 1e-6; // six zeroes to the left from 1
```

```
1e3 = 1 * 1000
1.23e6 = 1.23 * 1000000

// -3 divides by 1 with 3 zeroes
1e-3 = 1 / 1000 (=0.001)

// -6 divides by 1 with 6 zeroes
1.23e-6 = 1.23 / 1000000 (=0.00000123)
```

Hexadecimal 十六进制 0x

Binary 二进制 0b

octal 八进制 0o

```js
alert( 0xff ); // 255
alert( 0xFF ); // 255 (the same, case doesn't matter)

let a = 0b11111111; // binary form of 255
let b = 0o377; // octal form of 255

alert( a == b ); // true, the same number 255 at both sides
```

### toString(base)

```js
let num = 255;

alert( num.toString(16) );  // ff
alert( num.toString(2) );   // 11111111
```

`base` 可以从 `2` 变到 `36`。默认情况下它是 `10`。

常见的用例如下：

- **base=16** 用于十六进制颜色，字符编码等，数字可以是 `0..9` 或 `A..F`。

- **base=2** 主要用于调试按位操作，数字可以是 `0` 或 `1`。

- **base=36** 是最大值，数字可以是 `0..9` 或 `A..Z`。整个拉丁字母用来表示一个数字。对于 `36` 来说，一个有趣而有用的例子是，当我们需要将一个较长的数字标识符变成较短的时候，例如做一个简短的URL。可以简单地用基数为 `36` 的数字系统表示：

  ```js
  alert( 123456..toString(36) ); // 2n9c
  ```

### 四舍五入

以下是总结它们之间差异的表格：

|        | `Math.floor` | `Math.ceil` | `Math.round` | `Math.trunc` |
| ------ | ------------ | ----------- | ------------ | ------------ |
| `3.1`  | `3`          | `4`         | `3`          | `3`          |
| `3.6`  | `3`          | `4`         | `4`          | `3`          |
| `-1.1` | `-2`         | `-1`        | `-1`         | `-1`         |
| `-1.6` | `-2`         | `-1`        | `-2`         | `-1`         |

小数处理：

1. 乘法和除法

   例如，要将数字四舍五入到小数点后的第二个数字，我们可以将数字乘以 100，调用舍入函数，然后再将其除回 100。

   ```
   let num = 1.23456;
   
   alert( Math.floor(num * 100) / 100 ); // 1.23456 -> 123.456 -> 123 -> 1.23
   ```

2. 函数 [toFixed(n)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/toFixed) 将点数后的数字四舍五入到 `n` 个数字并返回结果的字符串表示。

   ```
   let num = 12.34;
   alert( num.toFixed(1) ); // "12.3"
   ```

   这会向上或向下舍入到最接近的值，类似于 `Math.round`：

   ```
   let num = 12.36;
   alert( num.toFixed(1) ); // "12.4"
   ```

   请注意 `toFixed` 的结果是一个字符串。如果小数部分比所需要的短，则在结尾添加零：

   ```
   let num = 12.34;
   alert( num.toFixed(5) ); // "12.34000", added zeroes to make exactly 5 digits 
   ```

   我们可以使用一元加号或 `Number()` 调用将其转换为数字：`+ num.toFixed(5)`。

### 不精确计算

在 js 内部，一个数字以 64 位格式 [IEEE-754](http://en.wikipedia.org/wiki/IEEE_754-1985) 表示，所以正好有 64 位来存储一个数字：其中 52 位用来存储这些数字， 11 位用来存储小数点的位置（它们对于整数为零），1 位用于符号。

如果一个数过大，超过64位能存储的量，会给出 Infinity：

```javascript
alert( 1e500 ); // Infinity
```

精度的丢失也经常出现：

```javascript
alert( 0.1 + 0.2 ); // 0.30000000000000004
```

这是为什么呢？

数字是以二进制的形式存储在内存中的，是0和1的序列。但是像 `0.1`, `0.2`这样的分数在十进制数字系统中很简单，实际上在二进制形式下是无穷分数。

也就是说，`0.1`是什么？是一除以十，`1/10`。在十进制数字系统，这样的数字是很容易表达的，相比于三分之一：`1/3`，就是无限小数 `0.33333(3)`。

也就是说，二进制下只有.5是靠谱的。

```javascript
alert( 0.1.toFixed(20) ); // 0.10000000000000000555
```

怎么解决呢？

1.  [toFixed(n)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/toFixed):

```javascript
let sum = 0.1 + 0.2;
alert( +sum.toFixed(2) ); // 0.3
```

Please note that `toFixed` always returns a string.

2. 把数字转成整数，运算完再转换回来：

3. ```javascript
   alert( (0.1 * 10 + 0.2 * 10) / 10 ); // 0.3
   ```

### Tests: isFinite and isNaN

- `Infinite` (and `-Infinite`) is a special numeric value that is greater (less) than anything.
- `NaN` represents an error.

```javascript
alert( isNaN(NaN) ); // true
alert( isNaN("str") ); // true
```

```javascript
alert( isFinite("15") ); // true
alert( isFinite("str") ); // false, because a special value: NaN
alert( isFinite(Infinity) ); // false, because a special value: Infinity
```

### parseInt and parseFloat

```javascript
alert( parseInt('100px') ); // 100
alert( parseFloat('12.5em') ); // 12.5

alert( parseInt('12.3') ); // 12, only the integer part is returned
alert( parseFloat('12.3.4') ); // 12.3, the second point stops the reading
```

```javascript
alert( parseInt('a123') ); // NaN, the first symbol stops the process
```

### Other math functions

```
Math.random()
```

Returns a random number from 0 to 1 (not including 1)

```javascript
alert( Math.random() ); // 0.1234567894322
alert( Math.random() ); // 0.5435252343232
alert( Math.random() ); // ... (any random numbers)
Math.max(a, b, c...)` / `Math.min(a, b, c...)
```

Returns the greatest/smallest from the arbitrary number of arguments.

```javascript
alert( Math.max(3, 5, -10, 0, 1) ); // 5
alert( Math.min(1, 2) ); // 1
Math.pow(n, power)
```

Returns `n` raised the given power

```javascript
alert( Math.pow(2, 10) ); // 2 in power 10 = 1024
```

任务：

[A random integer from min to max](https://javascript.info/number#a-random-integer-from-min-to-max)

## 5.3 Strings

有三种引号：

```javascript
let single = 'single-quoted';
let double = "double-quoted";

let backticks = `backticks`;
```

反引号支持多行：

```javascript
let guestList = `Guests:
 * John
 * Pete
 * Mary
`;

alert(guestList); // a list of guests, multiple lines
```

还支持调用函数：

```javascript
function sum(a, b) {
  return a + b;
}

alert(`1 + 2 = ${sum(1, 2)}.`); // 1 + 2 = 3.
```

### 特殊符号

| Character      | Description                                                  |
| -------------- | ------------------------------------------------------------ |
| `\b`           | Backspace                                                    |
| `\f`           | Form feed                                                    |
| `\n`           | New line                                                     |
| `\r`           | Carriage return                                              |
| `\t`           | Tab                                                          |
| `\uNNNN`       | A unicode symbol with the hex code `NNNN`, for instance `\u00A9` – is a unicode for the copyright symbol `©`. It must be exactly 4 hex digits. |
| `\u{NNNNNNNN}` | Some rare characters are encoded with two unicode symbols, taking up to 4 bytes. This long unicode requires braces around it. |

### Accessing characters

```javascript
let str = `Hello`;

// the first character
alert( str[0] ); // H
alert( str.charAt(0) ); // H

// the last character
alert( str[str.length - 1] ); // o
```

```javascript
let str = `Hello`;

alert( str[1000] ); // undefined
alert( str.charAt(1000) ); // '' (an empty string)
```

```javascript
for (let char of "Hello") {
  alert(char); // H,e,l,l,o (char becomes "H", then "e", then "l" etc)
}
```

### 查找子字符串

#### str.indexOf

[str.indexOf(substr, pos)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/indexOf)

```javascript
let str = 'Widget with id';

alert( str.indexOf('Widget') ); // 0, because 'Widget' is found at the beginning
alert( str.indexOf('widget') ); // -1, not found, the search is case-sensitive

alert( str.indexOf("id") ); // 1, "id" is found at the position 1 (..idget with id)
```

```javascript
let str = 'Widget with id';

alert( str.indexOf('id', 2) ) // 12
```

```javascript
let str = 'As sly as a fox, as strong as an ox';

let target = 'as'; // let's look for it

let pos = 0;
while (true) {
  let foundPos = str.indexOf(target, pos);
  if (foundPos == -1) break;

  alert( `Found at ${foundPos}` );
  pos = foundPos + 1; // continue the search from the next position
}
```

```javascript
let str = "As sly as a fox, as strong as an ox";
let target = "as";

let pos = -1;
while ((pos = str.indexOf(target, pos + 1)) != -1) {
  alert( pos );
}
```

if情况下：

```javascript
let str = "Widget with id";

if (str.indexOf("Widget") != -1) {
    alert("We found it"); // works now!
}
```

```javascript
alert( ~2 ); // -3, the same as -(2+1)
alert( ~1 ); // -2, the same as -(1+1)
alert( ~0 ); // -1, the same as -(0+1)
alert( ~-1 ); // 0, the same as -(-1+1)
```

```javascript
let str = "Widget";

if (~str.indexOf("Widget")) {
  alert( 'Found it!' ); // works
}
```

#### includes, startsWith, endsWith

```javascript
alert( "Midget".includes("id") ); // true
alert( "Midget".includes("id", 3) ); // false, from position 3 there is no "id"
```

```javascript
alert( "Widget".startsWith("Wid") ); // true, "Widget" starts with "Wid"
alert( "Widget".endsWith("get") );   // true, "Widget" ends with "get"
```



### 获取子字符串

有三种方法获取子字符串：`substring`, `substr` and `slice`。

#### str.slice(start [, end])

```javascript
let str = "stringify";
alert( str.slice(0, 5) ); // 'strin', the substring from 0 to 5 (not including 5)
alert( str.slice(0, 1) ); // 's', from 0 to 1, but not including 1, so only character at 0
```

```javascript
let str = "stringify";
alert( str.slice(2) ); // ringify, from the 2nd position till the end
```

```javascript
let str = "stringify";

// start at the 4th position from the right, end at the 1st from the right
alert( str.slice(-4, -1) ); // gif
```

#### str.substring(start [, end])

This is almost the same as `slice`, it allows `start` to be greater than `end`

不支持负数，被当做是 `0`。

```javascript
let str = "stringify";

// these are same for substring
alert( str.substring(2, 6) ); // "ring"
alert( str.substring(6, 2) ); // "ring"

// ...but not for slice:
alert( str.slice(2, 6) ); // "ring" (the same)
alert( str.slice(6, 2) ); // "" (an empty string)
```

#### str.substr(start [, length])

与前面不同的是可以指定长度

```javascript
let str = "stringify";
alert( str.substr(2, 4) ); // ring, from the 2nd position get 4 characters
```

```javascript
let str = "stringify";
alert( str.substr(-4, 2) ); // gi, from the 4th position get 2 characters
```

| method                  | selects…                                    | negatives                |
| ----------------------- | ------------------------------------------- | ------------------------ |
| `slice(start, end)`     | from `start` to `end` (not including `end`) | allows negatives         |
| `substring(start, end)` | between `start` and `end`                   | negative values mean `0` |
| `substr(start, length)` | from `start` get `length` characters        | allows negative `start`  |

### 比较字符串

小写字母大于大写字母

```javascript
alert( 'a' > 'Z' ); // true
```

在 Javascript 中，所有的字符串都是使用 [UTF-16](https://en.wikipedia.org/wiki/UTF-16) 进行编码的。也就是说，每个字符都有相应的数字代码。有一些特殊的方法允许获取代码的字符并返回。

#### str.codePointAt(pos)

```javascript
// different case letters have different codes
alert( "z".codePointAt(0) ); // 122
alert( "Z".codePointAt(0) ); // 90
```

#### String.fromCodePoint(code)

```javascript
alert( String.fromCodePoint(90) ); // Z
```

```javascript
// 90 is 5a in hexadecimal system
alert( '\u005a' ); // Z
```

```javascript
let str = '';

for (let i = 65; i <= 220; i++) {
  str += String.fromCodePoint(i);
}
alert( str );
// ABCDEFGHIJKLMNOPQRSTUVWXYZ[\]^_`abcdefghijklmnopqrstuvwxyz{|}~
// ¡¢£¤¥¦§¨©ª«¬­®¯°±²³´µ¶·¸¹º»¼½¾¿ÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖ×ØÙÚÛÜ
```

#### 正确的比较

所有的现代浏览器都支持国际化标准 [ECMA 402](http://www.ecma-international.org/ecma-402/1.0/ECMA-402.pdf)。

它提供了一种特殊的方法来按照字符串的规则比较不同语言中的字符串。

The call [str.localeCompare(str2)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/localeCompare):

- Returns `1` if `str` is greater than `str2` according to the language rules.
- Returns `-1` if `str` is less than `str2`.
- Returns `0` if they are equal.

```javascript
alert( 'Österreich'.localeCompare('Zealand') ); // -1
```

```js
var a = 'réservé'; // with accents, lowercase
var b = 'RESERVE'; // no accents, uppercase

console.log(a.localeCompare(b));
// expected output: 1
console.log(a.localeCompare(b, 'en', {sensitivity: 'base'}));
// expected output: 0
```

https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/localeCompare

### 任务

#### 首字母大写

Write a function `ucFirst(str)` that returns the string `str` with the uppercased first character, for instance:

```javascript
ucFirst("john") == "John";
```

这个问题，乍一写就容易写成下面这样：

```javascript
let newStr = str[0].toUpperCase() + str.slice(1);
```

然而会有一个小问题，就是当参数 `str` 为空的情况下，`str[0]` 就是 undefined 了，就会报错。

有两种方法解决这个问题：

1. 使用 `str.charAt(0)` 始终返回的是字符串，可以为空
2. 对空字符串进行检查：

```javascript
function ucFirst(str) {
  if (!str) return str;

  return str[0].toUpperCase() + str.slice(1);
}

alert( ucFirst("john") ); // John
```

#### 敏感词检查

```javascript
function checkSpam(str) {
  let lowerStr = str.toLowerCase();

  return lowerStr.includes('viagra') || lowerStr.includes('xxx');
}

alert( checkSpam('buy ViAgRA now') );
alert( checkSpam('free xxxxx') );
alert( checkSpam("innocent rabbit") );
```

#### 截断文本

 `truncate(str, maxlength)` 如果长度超了，就用 `…` 代替

```javascript
function truncate(str, maxlength) {
  return (str.length > maxlength) ?
    str.slice(0, maxlength - 1) + '…' : str;
}
```

#### 提取钱数

`extractCurrencyValue(str)` 只提取$符号后面的数字

```js
function extractCurrencyValue(str) {
      return +str.slice(1);
    }
```



## 5.4 Arrays

```
alert( [] + 1 ); // "1"
alert( [1] + 1 ); // "11"
alert( [1,2] + 1 ); // "1,21"
```

```javascript
let arr = ["a", "b"];

arr.push(function() {
  alert( this );
})

arr[2](); // "a","b",function
```

### 任务

求最大子数组的和

```js
function getMaxSubSum(arr) {
  let maxSum = 0;
  let partialSum = 0;

  for (let item of arr) { // for each item of arr
    partialSum += item; // add it to partialSum
    maxSum = Math.max(maxSum, partialSum); // remember the maximum
    if (partialSum < 0) partialSum = 0; // zero if negative
  }

  return maxSum;
}

alert( getMaxSubSum([-1, 2, 3, -9]) ); // 5
alert( getMaxSubSum([-1, 2, 3, -9, 11]) ); // 11
alert( getMaxSubSum([-2, -1, 1, 2]) ); // 3
alert( getMaxSubSum([100, -9, 2, -3, 5]) ); // 100
alert( getMaxSubSum([1, 2, 3]) ); // 6
alert( getMaxSubSum([-1, -2, -3]) ); // 0
```

## 5.5 Array methods

- To add/remove elements:

  - `push(...items)` – adds items to the end,
  - `pop()` – extracts an item from the end,
  - `shift()` – extracts an item from the beginning,
  - `unshift(...items)` – adds items to the beginning.
  - `splice(pos, deleteCount, ...items)` – at index `pos` delete `deleteCount` elements and insert `items`. [arr.splice(str)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/splice)
  - `slice(start, end)` – creates a new array, copies elements from position `start` till `end` (not inclusive) into it.
  - `concat(...items)` – returns a new array: copies all members of the current one and adds `items` to it. If any of `items` is an array, then its elements are taken.

- To search among elements:

  - `indexOf/lastIndexOf(item, pos)` – look for `item` starting from position `pos`, return the index or `-1` if not found.
  - `includes(value)` – returns `true` if the array has `value`, otherwise `false`.
  - `find/filter(func)` – filter elements through the function, return first/all values that make it return `true`.
  - `findIndex` is like `find`, but returns the index instead of a value.

- To transform the array:

  - `map(func)` – creates a new array from results of calling `func` for every element.
  - `sort(func)` – sorts the array in-place, then returns it.
  - `reverse()` – reverses the array in-place, then returns it.
  - `split/join` – convert a string to array and back.
  - `reduce(func, initial)` – calculate a single value over the array by calling `func` for each element and passing an intermediate result between the calls.

- To iterate over elements:

  - `forEach(func)` – calls `func` for every element, does not return anything.

- Additionally:

  - `Array.isArray(arr)` checks `arr` for being an array.

- [arr.some(fn)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/some)/[arr.every(fn)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/every) checks the array.

  The function `fn` is called on each element of the array similar to `map`. If any/all results are `true`, returns `true`, otherwise `false`.

- [arr.fill(value, start, end)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/fill) – fills the array with repeating `value` from index `start` to `end`.

- [arr.copyWithin(target, start, end)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/copyWithin) – copies its elements from position `start` till position `end` into *itself*, at position `target` (overwrites existing).

`sort`, `reverse` and `splice` 修改了数组本身

要注意的地方：

- splice接受负数

```javascript
let arr = [1, 2, 5];

// from index -1 (one step from the end)
// delete 0 elements,
// then insert 3 and 4
arr.splice(-1, 0, 3, 4);

alert( arr ); // 1,2,3,4,5
```

- concat时，对象带有 `Symbol.isConcatSpreadable` 属性：

```javascript
let arr = [1, 2];

let arrayLike = {
  0: "something",
  1: "else",
  [Symbol.isConcatSpreadable]: true,
  length: 2
};

alert( arr.concat(arrayLike) ); // 1,2,something,else
```

- 对于NaN的处理

```javascript
const arr = [NaN];
alert( arr.indexOf(NaN) ); // -1 (should be 0, but === equality doesn't work for NaN)
alert( arr.includes(NaN) );// true (correct)
```

- find

```javascript
let result = arr.find(function(item, index, array) {
  // should return true if the item is what we are looking for
});
```

```javascript
let users = [
  {id: 1, name: "John"},
  {id: 2, name: "Pete"},
  {id: 3, name: "Mary"}
];

let user = users.find(item => item.id == 1);

alert(user.name); // John
```

The [arr.findIndex](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/findIndex) method is essentially the same, but it returns the index where the element was found instead of the element itself.

- split还有第二个参数呢

```javascript
let arr = 'Bilbo, Gandalf, Nazgul, Saruman'.split(', ', 2);

alert(arr); // Bilbo, Gandalf
```

- reduce/reduceRight

```javascript
let value = arr.reduce(function(previousValue, item, index, arr) {
  // ...
}, initial);
```

`previousValue` – is the result of the previous function call, `initial` for the first call.

```javascript
let arr = [1, 2, 3, 4, 5];

let result = arr.reduce((sum, current) => sum + current, 0);

alert(result); // 15
```

```javascript
let arr = [1, 2, 3, 4, 5];

// removed initial value from reduce (no 0)
let result = arr.reduce((sum, current) => sum + current);

alert( result ); // 15
```

```javascript
let arr = [];

// Error: Reduce of empty array with no initial value
// if the initial value existed, reduce would return it for the empty arr.
arr.reduce((sum, current) => sum + current);
```

- Array.isArray

typeof 判断不出来是否是数组

```javascript
alert(Array.isArray({})); // false

alert(Array.isArray([])); // true
```

-  thisArg

```javascript
let user = {
  age: 18,
  younger(otherUser) {
    return otherUser.age < this.age;
  }
};

let users = [
  {age: 12},
  {age: 16},
  {age: 32}
];

// find all users younger than user
let youngerUsers = users.filter(user.younger, user);

alert(youngerUsers.length); // 2
```

### 任务：

#### 将横线隔开的字符串变成驼峰式

```js
function camelize(str) {
  return str
    .split('-') // my-long-word -> ['my', 'long', 'word']
    .map( 
      (word, index) => index == 0 ? word : word[0].toUpperCase() + word.slice(1)
    ) // ['my', 'long', 'word'] -> ['my', 'Long', 'Word']
    .join(''); // ['my', 'Long', 'Word'] -> myLongWord
}
```

#### 范围过滤

```js
function filterRange(arr, a, b) {
      // added brackets around the expression for better readability
      return arr.filter(item => (a <= item && item <= b));
    }
```

#### 范围替换

```js
    function filterRangeInPlace (arr, a, b) {
      for(let i=0; i< arr.length; i++) {
        let val = arr[i]
        if(val < a || val > b) {
          arr.splice(i, 1)
          i--
        }
      }
    }
```

#### 复制数组并排序，不影响原来数组

```js
function copySorted(arr) {
  return arr.slice().sort();
}

let arr = ["HTML", "JavaScript", "CSS"];

let sorted = copySorted(arr);

alert( sorted );
alert( arr );
```

这里使用slice来复制数组，返回一个新数组

#### shuffle数组

https://javascript.info/task/shuffle

```javascript
function shuffle(array) {
  array.sort(() => Math.random() - 0.5);
}

let arr = [1, 2, 3];
shuffle(arr);
alert(arr);
```

 [Fisher-Yates shuffle](https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle) 算法

```js
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}
```

#### 数组去重

简单版，复杂度O(n^2)

```js
function unique(arr) {
      let result = [];
    
      for (let str of arr) {
        if (!result.includes(str)) {
          result.push(str);
        }
      }
    
      return result;
    }
```

## 5.6 Iterables

### [Symbol.iterator](https://javascript.info/iterable#symbol-iterator)

- When `for..of` starts, it calls that method (or errors if not found).
- The method must return an *iterator* – an object with the method `next`.
- When `for..of` wants the next value, it calls `next()` on that object.
- The result of `next()` must have the form `{done: Boolean, value: any}`, where `done=true` means that the iteration is finished, otherwise `value` must be the new value.

```js
let range = {
  from: 1,
  to: 5
};

// 1. call to for..of initially calls this
range[Symbol.iterator] = function() {

  // 2. ...it returns the iterator:
  return {
    current: this.from,
    last: this.to,

    // 3. next() is called on each iteration by the for..of loop
    next() {
      // 4. it should return the value as an object {done:.., value :...}
      if (this.current <= this.last) {
        return { done: false, value: this.current++ };
      } else {
        return { done: true };
      }
    }
  };
};

// now it works!
for (let num of range) {
  alert(num); // 1, then 2, 3, 4, 5
}
```

也可以把对象本身用作迭代器

```javascript
let range = {
  from: 1,
  to: 5,

  [Symbol.iterator]() {
    this.current = this.from;
    return this;
  },

  next() {
    if (this.current <= this.to) {
      return { done: false, value: this.current++ };
    } else {
      return { done: true };
    }
  }
};

for (let num of range) {
  alert(num); // 1, then 2, 3, 4, 5
}
```

### 字符串是可迭代的

```javascript
for (let char of "test") {
  alert( char ); // t, then e, then s, then t
}
```

这种迭代器主要是对字符串的UTF-16扩展字符比较友好

```javascript
let str = '𝒳😂';
for (let char of str) {
    alert( char ); // 𝒳, and then 😂
}
```

### Array.from

```javascript
Array.from(obj[, mapFn, thisArg])
```

```js
let arrayLike = {
  0: "Hello",
  1: "World",
  length: 2
};

let arr = Array.from(arrayLike); // (*)
alert(arr.pop()); // World (method works)
```

```javascript
// assuming that range is taken from the example above

// square each number
let arr = Array.from(range, num => num * num);

alert(arr); // 1,4,9,16,25
```

将字符串转换成数组：

```javascript
let str = '𝒳😂';

// splits str into array of characters
let chars = Array.from(str);

alert(chars[0]); // 𝒳
alert(chars[1]); // 😂
alert(chars.length); // 2
```

```javascript
function slice(str, start, end) {
  return Array.from(str).slice(start, end).join('');
}

let str = '𝒳😂𩷶';

alert( slice(str, 1, 3) ); // 😂𩷶

// native method does not support surrogate pairs
alert( str.slice(1, 3) ); // garbage (two pieces from different surrogate pairs)
```

## 5.7 Map、Set、WeakMap 和 WeakSet

### Map

`Map` 允许所有数据类型作为键，Object会把键都转成字符串。

如果是对象，则都是 `[object Object]`，这样就会有问题

- `new Map()` – creates the map.
- `map.set(key, value)` – stores the value by the key.
- `map.get(key)` – returns the value by the key, `undefined` if `key` doesn’t exist in map.
- `map.has(key)` – returns `true` if the `key` exists, `false` otherwise.
- `map.delete(key)` – removes the value by the key.
- `map.clear()` – clears the map
- `map.size` – returns the current element count.

```javascript
let map = new Map();

map.set('1', 'str1');   // a string key
map.set(1, 'num1');     // a numeric key
map.set(true, 'bool1'); // a boolean key

// remember the regular Object? it would convert keys to string
// Map keeps the type, so these two are different:
alert( map.get(1)   ); // 'num1'
alert( map.get('1') ); // 'str1'

alert( map.size ); // 3
```

对象作为键：

```js
let john = { name: "John" };

// for every user, let's store his visits count
let visitsCountMap = new Map();

// john is the key for the map
visitsCountMap.set(john, 123);

alert( visitsCountMap.get(john) ); // 123
```

链式调用

```javascript
map.set('1', 'str1')
  .set(1, 'num1')
  .set(true, 'bool1');
```

#### Map from Object

```javascript
let map = new Map(Object.entries({
  name: "John",
  age: 30
}));
```

#### 遍历Map

- `map.keys()` – returns an iterable for keys,
- `map.values()` – returns an iterable for values,
- `map.entries()` – returns an iterable for entries `[key, value]`, it’s used by default in `for..of`.

```javascript
let recipeMap = new Map([
  ['cucumber', 500],
  ['tomatoes', 350],
  ['onion',    50]
]);

// iterate over keys (vegetables)
for (let vegetable of recipeMap.keys()) {
  alert(vegetable); // cucumber, tomatoes, onion
}

// iterate over values (amounts)
for (let amount of recipeMap.values()) {
  alert(amount); // 500, 350, 50
}

// iterate over [key, value] entries
for (let entry of recipeMap) { // the same as of recipeMap.entries()
  alert(entry); // cucumber,500 (and so on)
}
```

内置 `forEach`

```javascript
recipeMap.forEach( (value, key, map) => {
  alert(`${key}: ${value}`); // cucumber: 500 etc
});
```

### Set

```
`Set` 是一个值的集合，这个集合中所有的值仅出现一次。
```

- `new Set(iterable)` – creates the set, optionally from an array of values (any iterable will do).
- `set.add(value)` – adds a value, returns the set itself.
- `set.delete(value)` – removes the value, returns `true` if `value` existed at the moment of the call, otherwise `false`.
- `set.has(value)` – returns `true` if the value exists in the set, otherwise `false`.
- `set.clear()` – removes everything from the set.
- `set.size` – is the elements count.

```javascript
let set = new Set(["oranges", "apples", "bananas"]);

for (let value of set) alert(value);

// the same with forEach:
set.forEach((value, valueAgain, set) => {
  alert(value);
});
```

### WeakMap and WeakSet

WeakMap 的key必须是对象，不能是原始值

```javascript
let weakMap = new WeakMap();

let obj = {};

weakMap.set(obj, "ok"); // works fine (object key)

weakMap.set("test", "Whoops"); // Error, because "test" is a primitive
```

（没看完。。。）

## 5.8 Object.keys, values, entries

- [Object.keys(obj)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/keys) – returns an array of keys.
- [Object.values(obj)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/values) – returns an array of values.
- [Object.entries(obj)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/entries) – returns an array of `[key, value]` pairs.

```javascript
let user = {
  name: "John",
  age: 30
};
```

- `Object.keys(user) = [name, age]`
- `Object.values(user) = ["John", 30]`
- `Object.entries(user) = [ ["name","John"], ["age",30] ]`

#### Object.keys/values/entries 忽略 Symbol 类型的属性

then there’s a separate method [Object.getOwnPropertySymbols](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/getOwnPropertySymbols) that returns an array of only symbolic keys. Also, the method [Reflect.ownKeys(obj)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Reflect/ownKeys) returns *all* keys.

## 5.9 Destructuring assignment 解构赋值

### 数组解构

```javascript
// we have an array with the name and surname
let arr = ["Ilya", "Kantor"]

// destructuring assignment
let [firstName, surname] = arr;

alert(firstName); // Ilya
alert(surname);  // Kantor
```

```js
let [firstName, surname] = "Ilya Kantor".split(' ');
```

#### Looping with .entries()

```javascript
let user = {
  name: "John",
  age: 30
};

// loop over keys-and-values
for (let [key, value] of Object.entries(user)) {
  alert(`${key}:${value}`); // name:John, then age:30
}
```

#### The rest ‘…’

```javascript
let [name1, name2, ...rest] = ["Julius", "Caesar", "Consul", "of the Roman Republic"];

alert(name1); // Julius
alert(name2); // Caesar

alert(rest[0]); // Consul
alert(rest[1]); // of the Roman Republic
alert(rest.length); // 2
```

#### 默认值

```javascript
// default values
let [name = "Guest", surname = "Anonymous"] = ["Julius"];

alert(name);    // Julius (from array)
alert(surname); // Anonymous (default used)
```

### 对象解构

```js
let options = {
  title: "Menu",
  width: 100,
  height: 200
};

*!*
let {title, width, height} = options;
*/!*

alert(title);  // Menu
alert(width);  // 100
alert(height); // 200
```

左边可以调换顺序

```javascript
// changed the order of properties in let {...}
let {height, width, title} = { title: "Menu", height: 200, width: 100 }
```

指定变量名

```javascript
let {width: w, height: h, title} = options;
```

指定默认值

```javascript
let {width = 100, height = 200, title} = options;
```

冒号和等号结合

```javascript
let {width: w = 100, height: h = 200, title} = options;
```

#### 剩余运算符

```js
let options = {
  title: "Menu",
  height: 200,
  width: 100
};

*!*
let {title, ...rest} = options;
*/!*

// now title="Menu", rest={height: 200, width: 100}
alert(rest.height);  // 200
alert(rest.width);   // 100
```

#### 嵌套解构

```javascript
  size: {
    width: 100,
    height: 200
  },
  items: ["Cake", "Donut"],
  extra: true    // something extra that we will not destruct
};

// destructuring assignment on multiple lines for clarity
let {
  size: { // put size here
    width,
    height
  },
  items: [item1, item2], // assign items here
  title = "Menu" // not present in the object (default value is used)
} = options;

alert(title);  // Menu
alert(width);  // 100
alert(height); // 200
alert(item1);  // Cake
alert(item2);  // Donut
```

```javascript
// take size as a whole into a variable, ignore the rest
let { size } = options;
```

#### 智能参数函数

```javascript
// we pass object to function
let options = {
  title: "My menu",
  items: ["Item1", "Item2"]
};

// ...and it immediately expands it to variables
function showMenu({title = "Untitled", width = 200, height = 100, items = []}) {
  // title, items – taken from options,
  // width, height – defaults used
  alert( `${title} ${width} ${height}` ); // My Menu 200 100
  alert( items ); // Item1, Item2
}

showMenu(options);
```

```javascript
let options = {
  title: "My menu",
  items: ["Item1", "Item2"]
};

function showMenu({
  title = "Untitled",
  width: w = 100,  // width goes to w
  height: h = 200, // height goes to h
  items: [item1, item2] // items first element goes to item1, second to item2
}) {
  alert( `${title} ${w} ${h}` ); // My Menu 100 200
  alert( item1 ); // Item1
  alert( item2 ); // Item2
}

showMenu(options);
```

```javascript
function({
  incomingProperty: parameterName = defaultValue
  ...
})
```

这样默认情况下需要传递一个空对象作为参数：

```javascript
showMenu({});
```

```javascript
// simplified parameters a bit for clarity
function showMenu({ title = "Menu", width = 100, height = 200 } = {}) {
  alert( `${title} ${width} ${height}` );
}

showMenu(); // Menu 100 200
```

### 任务

#### [The maximal salary](https://javascript.info/destructuring-assignment#the-maximal-salary)

```js
function topSalary(salaries) {
    
      let max = 0;
      let maxName = null;
    
      for(let [name, salary] of Object.entries(salaries)) {
        if (max < salary) {
          max = salary;
          maxName = name;
        }
      }
    
      return maxName;
    }
```

## 5.10 Date and time

### 创建

#### new Date()

```javascript
let now = new Date();
alert( now ); // shows current date/time
```

#### new Date(milliseconds)

```javascript
// 0 means 01.01.1970 UTC+0
let Jan01_1970 = new Date(0);
alert( Jan01_1970 );

// now add 24 hours, get 02.01.1970 UTC+0
let Jan02_1970 = new Date(24 * 3600 * 1000);
alert( Jan02_1970 );
```

#### new Date(datestring)

```javascript
let date = new Date("2017-01-26");
alert(date); // Thu Jan 26 2017 ...
```

#### new Date(year, month, date, hours, minutes, seconds, ms)

只有前两个参数是必须的

```javascript
new Date(2011, 0, 1, 0, 0, 0, 0); // // 1 Jan 2011, 00:00:00
new Date(2011, 0, 1); // the same, hours etc are 0 by default
```

The minimal precision is 1 ms (1/1000 sec):

```javascript
let date = new Date(2011, 0, 1, 2, 3, 4, 567);
alert( date ); // 1.01.2011, 02:03:04.567
```

### 访问日期组件

[getFullYear()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/getFullYear)

[getMonth()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/getMonth)

[getDate()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/getDate)

[getHours()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/getHours), [getMinutes()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/getMinutes), [getSeconds()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/getSeconds), [getMilliseconds()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/getMilliseconds)

[getDay()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/getDay) from `0` (Sunday) to `6` (Saturday)

[getUTCFullYear()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/getUTCFullYear), [getUTCMonth()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/getUTCMonth), [getUTCDay()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/getUTCDay)

```javascript
// current date
let date = new Date();

// the hour in your current time zone
alert( date.getHours() );

// the hour in UTC+0 time zone (London time without daylight savings)
alert( date.getUTCHours() );
```

[getTime()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/getTime)

Returns the timestamp for the date – a number of milliseconds passed from the January 1st of 1970 UTC+0.

[getTimezoneOffset()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/getTimezoneOffset)

Returns the difference between the local time zone and UTC, in minutes:

```javascript
// if you are in timezone UTC-1, outputs 60
// if you are in timezone UTC+3, outputs -180
alert( new Date().getTimezoneOffset() );
```

### 设置日期组件

- [`setFullYear(year [, month, date\])`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/setFullYear)
- [`setMonth(month [, date\])`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/setMonth)
- [`setDate(date)`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/setDate)
- [`setHours(hour [, min, sec, ms\])`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/setHours)
- [`setMinutes(min [, sec, ms\])`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/setMinutes)
- [`setSeconds(sec [, ms\])`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/setSeconds)
- [`setMilliseconds(ms)`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/setMilliseconds)
- [`setTime(milliseconds)`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/setTime) (sets the whole date by milliseconds since 01.01.1970 UTC)

Every one of them except `setTime()` has a UTC-variant, for instance: `setUTCHours()`.

```javascript
let today = new Date();

today.setHours(0);
alert(today); // still today, but the hour is changed to 0

today.setHours(0, 0, 0, 0);
alert(today); // still today, now 00:00:00 sharp.
```

### 自动校准

```javascript
let date = new Date(2013, 0, 32); // 32 Jan 2013 ?!?
alert(date); // ...is 1st Feb 2013!
```

```javascript
let date = new Date(2016, 1, 28);
date.setDate(date.getDate() + 2);

alert( date ); // 1 Mar 2016
```

```javascript
let date = new Date(2016, 0, 2); // 2 Jan 2016

date.setDate(1); // set day 1 of month
alert( date );

date.setDate(0); // min day is 1, so the last day of the previous month is assumed
alert( date ); // 31 Dec 2015
```

### 日期转换成数字以及差值

当 `Date` 对象转化为数字时，得到的是对应的时间戳，相当于 `date.getTime()`：

```js
let date = new Date();
alert(+date); // 以毫秒为单位的数值，相当于 date.getTime()
```

### Date.now()

它相当于 `new Date().getTime()`

```js
*!*
let start = Date.now(); // 从 1979-01-01 00:00:00 开始至今的时间戳
*/!*

// do the job
for (let i = 0; i < 100000; i++) {
  let doSomething = i * i * i;
}

*!*
let end = Date.now(); // 操作完成后，得到这一时刻的时间戳
*/!*

alert( `The loop took ${end - start} ms` ); // 相减的是时间戳，而不是日期
```

### 对一个字符串使用 Date.parse

Date.parse(str) 方法可以从一个字符串中读取日期。

字符串的格式是：`YYYY-MM-DDTHH:mm:ss.sssZ`，其中：

- `YYYY-MM-DD` —— 日期：年-月-日。
- 字符串 `"T"` 是一个分隔符。
- `HH:mm:ss.sss` —— 时间：小时，分钟，秒，毫秒。
- 可选字符 `'Z'` 代表时区。单个字符 `Z` 代表 UTC+0。

```js
let ms = Date.parse('2012-01-26T13:51:50.417-07:00');

alert(ms); // 1327611110417  (时间戳)
```

```js
let date = new Date( Date.parse('2012-01-26T13:51:50.417-07:00') );

alert(date);  
```

### 任务

#### 周一开头

```js
function getLocalDay(date) {

  let day = date.getDay();

  if (day == 0) { // 0 becomes 7
    day = 7;
  }

  return day;
}
```

#### 获取一个月的最后一天的日期

```javascript
function getLastDayOfMonth(year, month) {
  let date = new Date(year, month + 1, 0);
  return date.getDate();
}

alert( getLastDayOfMonth(2012, 0) ); // 31
alert( getLastDayOfMonth(2012, 1) ); // 29
alert( getLastDayOfMonth(2013, 1) ); // 28
```

#### 今天过了多少秒

```javascript
function getSecondsToday() {
  let now = new Date();

  // create an object using the current day/month/year
  let today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  let diff = now - today; // ms difference
  return Math.round(diff / 1000); // make seconds
}

alert( getSecondsToday() );
```

```javascript
function getSecondsToday() {
  let d = new Date();
  return d.getHours() * 3600 + d.getMinutes() * 60 + d.getSeconds();
};
```

#### 到明天还有多少秒

```javascript
function getSecondsToTomorrow() {
  let now = new Date();

  // tomorrow date
  let tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate()+1);

  let diff = tomorrow - now; // difference in ms
  return Math.round(diff / 1000); // convert to seconds
}
```

```javascript
function getSecondsToTomorrow() {
  let now = new Date();
  let hour = now.getHours();
  let minutes = now.getMinutes();
  let seconds = now.getSeconds();
  let totalSecondsToday = (hour * 60 + minutes) * 60 + seconds;
  let totalSecondsInADay = 86400;

  return totalSecondsInADay - totalSecondsToday;
}
```

## 5.11 JSON methods, toJSON

- `JSON.stringify` to convert objects into JSON.
- `JSON.parse` to convert JSON back into an object.

```javascript
let student = {
  name: 'John',
  age: 30,
  isAdmin: false,
  courses: ['html', 'css', 'js'],
  wife: null
};

let json = JSON.stringify(student);

alert(typeof json); // we've got a string!

alert(json);
/* JSON-encoded object:
{
  "name": "John",
  "age": 30,
  "isAdmin": false,
  "courses": ["html", "css", "js"],
  "wife": null
}
*/
```

JSON编码过的对象与字面量对象不同的地方：

- 字符串使用双引号
- 对象属性名也是双引号

支持 `JSON.stringify`  的有：

- Objects `{ ... }`
- Arrays `[ ... ]`
- Primitives:
  - strings,
  - numbers,
  - boolean values `true/false`,
  - `null`.

还会忽略掉 Javascript 特殊的对象属性：

- 函数属性（方法）
- Symbol 属性
- 值为 `undefined` 的属性

```javascript
let user = {
  sayHi() { // ignored
    alert("Hello");
  },
  [Symbol("id")]: 123, // ignored
  something: undefined // ignored
};

alert( JSON.stringify(user) ); // {} (empty object)
```

（没看完）

