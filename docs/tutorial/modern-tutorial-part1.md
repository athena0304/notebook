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

