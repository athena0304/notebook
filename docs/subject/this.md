# this规则

### 1. `new` 关键字

当使用new关键字调用函数的时候，函数内的`this`就是一个全新的对象

```js
function ConstructorExample() {
    console.log(this);
    this.value = 10;
    console.log(this);
}

new ConstructorExample();

// -> ConstructorExample {}
// -> ConstructorExample { value: 10 }
```

### 2. apply call bind

如果使用apply、call或者bind来调用函数，函数内的this就是传入的第一个参数。

```js
function fn() {
    console.log(this);
}

var obj = {
    value: 5
};

var boundFn = fn.bind(obj);

boundFn(); // -> { value: 5 }
fn.call(obj); // -> { value: 5 }
fn.apply(obj); // -> { value: 5 }
```

### 3. 点操作符 dot notation

如果一个函数作为方法被调用，也就是说用点操作符来触发这个函数，`this` 就是点操作符左边的对象。

```js
var obj = {
    value: 5,
    printThis: function() {
      console.log(this);
    }
};

obj.printThis(); // -> { value: 5, printThis: ƒ }
```

### 4. 自由函数调用  *free function invocation*

如果函数是作为自由函数调用的，也就是说上面的条件都不满足，那么 this 就是全局对象。在浏览器中，就是 `Window`

```js
function fn() {
    console.log(this);
}

// If called in browser:
fn(); // -> Window {stop: ƒ, open: ƒ, alert: ƒ, ...}
```

其实这一条和第3条规则是一样的，不同之处就是一个不是作为方法而声明的函数会自动成为全局对象的一个属性，全局对象也就是 `Window`。所以这也算一个隐式的方法调用。当调用 `fn()`时，也就是 `window.fn()`，所以 this 就是 Window。

```js
function fn() {
    console.log(this);
}

// In browser:
console.log(fn === window.fn); // -> true
```

### 5. 多重规则同时出现，从上往下优先级

```js
const obj1 = {
    value: 'hi',
    print: function() {
        console.log(this);
    },
};

const obj2 = { value: 17 };

obj1.print.call(obj2); // -> { value: 17 }
```

这里同时遇到了规则2和规则3，那么2优先于3

### 6. 箭头函数

如果是箭头函数，忽略上述规则，接受该函数当初创建时上游作用域的this的值

```js
const obj = {
    value: 'abc',
    createArrowFn: function() {
        return () => console.log(this);
    }
};

const arrowFn = obj.createArrowFn();
arrowFn(); // -> { value: 'abc', createArrowFn: ƒ }
```

这里先应用了第三条规则，使用了点操作符 `obj.createArrowFn()`，`createArrowFn`中的`this`就是`obj`。所在arrowFn中this绑定的是obj。





在JavaScript中，函数内部的this就是该函数所属的对象的引用。

new 就是说我们想要一个该函数返回的对象