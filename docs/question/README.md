# 题目

## 1.实现以下需求。

a=”123”; a.duplicate(); //返回”123123”
<iframe height='265' scrolling='no' title='a=”123”; a.duplicate(); //返回”123123”' src='//codepen.io/athena0304/embed/XPddqX/?height=265&theme-id=0&default-tab=js,result&embed-version=2' frameborder='no' allowtransparency='true' allowfullscreen='true' style='width: 100%;'>See the Pen <a href='https://codepen.io/athena0304/pen/XPddqX/'>a=”123”; a.duplicate(); //返回”123123”</a> by Athena (<a href='https://codepen.io/athena0304'>@athena0304</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

## 2.生成数组[1,2,3,4,5]，然后将其乱序。

### 生成数组

这里涉及到如何创建一个数组的问题，老的方法有：

```js
let items = new Array(2)
let items1 = new Array(1, 2)
```

老的会有参数的问题，如果传入的是一个数组，那么就会创建一个长度为参数的空数组，如果参数大于一个，那么就会创建参数组成的数组。

所以在ES6中新提出了一种创建方法`Array.of()`

```js
let items = Array.of(1, 2)
```

使用这种方法，无论参数是什么，都会创建一个由参数所组成的数组。

所以这里就可以使用:

```js
let aaa = Array.of(1,2,3,4,5)
let aaa1 = [1,2,3,4,5]
let aaa2 = new Array(1,2,3,4,5)
```

让我们举一反三，如果是1-9999的数组呢，就不能这样直接输入数字了，这里就用到了 ES6 新出的 `Array.from()`

这个函数很神奇，这里的用法不是最简单的常规用法我觉得：

```js
let aaa3 = Array.from({length: 5}, (v, k) => k + 1)
```

> The `**Array.from()**` method creates a new, shallow-copied `Array` instance from an array-like or iterable object.

这里的5可以换成任何一个整数，封装一下就是：

```js
let f = length => Array.from({length}, (v, k) => k + 1)
// 或者是
let f1 = length => Array.from({length}).map((v, k) => k + 1);
```

### 乱序

```js
let sort = function (arr) {
	return arr.sort(() => 0.5 - Math.random())
}

```

所以整个下来就是：

```js
Array.from({length: 5}, (v, k) => k + 1).sort(() => 0.5 - Math.random())
```



## 3.实现add函数。可满足以下两种调用方式。有且只有两个参数。add(2, 5); // 7 add(2)(5); // 7

这道题用到的是函数柯里化