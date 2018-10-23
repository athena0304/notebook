# 30secondsofinterviews

## 实现 `Function.prototype.bind` 里面的 `bind` 函数

```js
function example() {
  console.log(this)
}
const boundExample = bind(example, { a: true })
boundExample.call({ b: true }) // logs { a: true }
```

```js
const bind = (fn, context) => (...args) => fn.apply(context, args)
```

## 生成斐波那切数列数组，个数为n

```js
const fibonacci = n =>
  [...Array(n)].reduce(
    (acc, val, i) => acc.concat(i > 1 ? acc[i - 1] + acc[i - 2] : i),
    []
  )
```

## `0.1 + 0.2 === 0.3`

JavaScript 使用 IEEE 754 标准来进行数学计算，并且使用64-bit浮点数。

```js
0.1 + 0.2 // 0.30000000000000004
```

解决方法就是使用一个决定两个数是否近似相等的函数：

```js
const approxEqual = (n1, n2, epsilon = 0.0001) => Math.abs(n1 - n2) < epsilon
approxEqual(0.1 + 0.2, 0.3) // true
```

## 创建一个函数，除了最后四个(4)字符外，用#隐藏字符串。

```js
const mask = (str, maskChar = "#") =>
  str.slice(-4).padStart(str.length, maskChar)
```

## 有哪些拷贝对象的方法？

使用展开运算符 `...` ，属于对象的可枚举属性就可以被拷贝到新的对象中，这里是浅拷贝（shallow clone）。

```js
const obj = { a: 1, b: 2 }
const shallowClone = { ...obj }
```

使用展开运算符的方法的话，原型就被忽略了。此外，嵌套对象不是通过克隆而来的，而是它们的引用被复制，因此嵌套对象仍然引用与原始对象相同的对象。深度克隆要复杂得多，以便有效地克隆任何类型的对象(Date、RegExp、Function、Set等)，这些对象可能嵌套在对象中。

其它选择：

- `JSON.parse(JSON.stringify(obj))` 可以用于深度克隆一个简单的对象，但是比较消耗CPU，只接受有效的 JSON（因此它去掉了函数，不允许循环引用）。
- `Object.assign({}, obj)`
- `Object.keys(obj).reduce((acc, key) => (acc[key] = obj[key], acc), {})`

## 怎样比较两个对象？

适用于：plain objects, arrays, functions, dates and primitive values

```js
function isDeepEqual(obj1, obj2, testPrototypes = false) {
  if (obj1 === obj2) {
    return true
  }

  if (typeof obj1 === "function" && typeof obj2 === "function") {
    return obj1.toString() === obj2.toString()
  }

  if (obj1 instanceof Date && obj2 instanceof Date) {
    return obj1.getTime() === obj2.getTime()
  }

  if (
    Object.prototype.toString.call(obj1) !==
      Object.prototype.toString.call(obj2) ||
    typeof obj1 !== "object"
  ) {
    return false
  }

  const prototypesAreEqual = testPrototypes
    ? isDeepEqual(
        Object.getPrototypeOf(obj1),
        Object.getPrototypeOf(obj2),
        true
      )
    : true

  const obj1Props = Object.getOwnPropertyNames(obj1)
  const obj2Props = Object.getOwnPropertyNames(obj2)

  return (
    obj1Props.length === obj2Props.length &&
    prototypesAreEqual &&
    obj1Props.every(prop => isDeepEqual(obj1[prop], obj2[prop]))
  )
}
```

## 创建对象的几种方法

### 对象字面量

通常用于存储出现一次的数据。

```js
const person = {
  name: "John",
  age: 50,
  birthday() {
    this.age++
  }
}
person.birthday() // person.age === 51
```

### 构造函数

通常在需要创建一个对象的多个实例时使用，每个实例都有自己的数据，而其他类的实例不会影响这些数据。在调用构造函数之前必须使用 `new` 操作符，否则全局对象将发生突变。

```js
function Person(name, age) {
  this.name = name
  this.age = age
}
Person.prototype.birthday = function() {
  this.age++
}
const person1 = new Person("John", 50)
const person2 = new Person("Sally", 20)
person1.birthday() // person1.age === 51
person2.birthday() // person2.age === 21
```

### 工厂函数

创建一个类似于构造函数的新对象，但可以使用闭包存储私有数据。在调用函数或 `this` 关键字之前也不需要使用 `new`。工厂函数通常放弃原型的概念，并将所有属性和方法作为对象的自身属性。

```js
const createPerson = (name, age) => {
  const birthday = () => person.age++
  const person = { name, age, birthday }
  return person
}
const person = createPerson("John", 50)
person.birthday() // person.age === 51
```

### `Object.create()`

设置新创建对象的原型。

```js
const personProto = {
  birthday() {
    this.age++
  }
}
const person = Object.create(personProto)
person.age = 50
person.birthday() // person.age === 51
```

Object.create()还可以有第二个参数，充当要定义的新属性的描述符。

```js
Object.create(personProto, {
  age: {
    value: 50,
    writable: true,
    enumerable: true
  }
})
```

工厂函数通过闭包提供私有属性和方法，但是作为一种折中，增加了内存使用，而类没有私有属性或方法，通过重用单个原型对象减少了内存影响。

## 通过返回接受一个参数的函数，创建一个从左到右执行函数组合的函数 pipe。

```js
const square = v => v * v
const double = v => v * 2
const addOne = v => v + 1
const res = pipe(square, double, addOne)
res(3) // 19; addOne(double(square(3)))
```

```js
const pipe = (...fns) => x => fns.reduce((v, fn) => fn(v), x)
```

## memoization

```js
const memoize = fn => {
  const cache = new Map()
  return value => {
    const cachedResult = cache.get(value)
    if (cachedResult !== undefined) return cachedResult
    const result = fn(value)
    cache.set(value, result)
    return result
  }
}
```

## 什么是纯函数？

纯函数是满足这两个条件的函数:

- 给定相同的输入，函数返回相同的输出。
- 函数不会在函数作用域之外引起副作用（例如，在函数或提供给函数的数据之外改变数据）。

只要满足上述两个条件，纯函数就可以在函数中改变局部数据。

##### Pure

```js
const a = (x, y) => x + y
const b = (arr, value) => arr.concat(value)
const c = arr => [...arr].sort((a, b) => a - b)
```

##### Impure

```js
const a = (x, y) => x + y + Math.random()
const b = (arr, value) => (arr.push(value), arr)
const c = arr => arr.sort((a, b) => a - b)
```

- 由于纯函数的可靠性，它们更容易被理解。

- 所有函数都应该是纯函数，除非显式地引起副作用（例如setInnerHTML）。

- 如果函数不返回值，则表示它正在引起副作用。

## 什么是递归，什么场景有用？

递归是一个过程的重复应用。在 JavaScript 中，递归涉及到不断调用自己的函数，直到它们达到基本条件为止。基本条件跳出递归循环，否则函数会无限地调用自己。当处理包含嵌套的数据结构时，递归是非常有用的，因为嵌套的深度是未知的。

例如，你可能有一个从数据库返回的评论线程，该线程存在于平面数组中，但需要嵌套以在UI中显示。每条评论要么是顶级评论(没有父评论)，要么是对父评论的回复。评论可以是对回复的回复……我们事先不知道有多少层的评论。这就是递归可以提供帮助的地方。

```js
const nest = (items, id = null, link = "parent_id") =>
  items
    .filter(item => item[link] === id)
    .map(item => ({ ...item, children: nest(items, item.id) }))

const comments = [
  { id: 1, parent_id: null, text: "First reply to post." },
  { id: 2, parent_id: 1, text: "First reply to comment #1." },
  { id: 3, parent_id: 1, text: "Second reply to comment #1." },
  { id: 4, parent_id: 3, text: "First reply to comment #3." },
  { id: 5, parent_id: 4, text: "First reply to comment #4." },
  { id: 6, parent_id: null, text: "Second reply to post." }
]

nest(comments)
/*
[
  { id: 1, parent_id: null, text: "First reply to post.", children: [...] },
  { id: 6, parent_id: null, text: "Second reply to post.", children: [] }
]
*/
```

在上面的示例中，如果 `filter()` 返回一个空数组，则满足基本条件。链式 `map()` 不会调用包含递归调用的回调函数，从而中断循环。

## 静态方法和实例方法的区别（static method vs instance method）

静态方法属于一个类，不作用于实例，而实例方法属于类原型，类原型由类的所有实例继承并作用于它们。

```js
Array.isArray // static method of Array
Array.prototype.push // instance method of Array
```

在这种情况下， `Array.isArray` 方法作为数组的实例方法是没有意义的，因为我们在处理数组时已经知道这个值是一个数组。

实例方法在技术上可以作为静态方法工作，但提供了更简洁的语法：

```js
const arr = [1, 2, 3]
arr.push(4)
Array.push(arr, 4)
```





































































































