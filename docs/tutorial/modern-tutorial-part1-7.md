# 面向对象编程

## 7.1 Property flags and descriptors

- **writable** – if `true`, can be changed, otherwise it’s read-only.
- **enumerable** – if `true`, then listed in loops, otherwise not listed.
- **configurable** – if `true`, the property can be deleted and these attributes can be modified, otherwise not.



 [Object.getOwnPropertyDescriptor](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/getOwnPropertyDescriptor) 

```javascript
let descriptor = Object.getOwnPropertyDescriptor(obj, propertyName);
```

 [Object.defineProperty](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty)

```javascript
Object.defineProperty(obj, propertyName, descriptor)
```

 [Object.defineProperties(obj, descriptors)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperties)

```javascript
Object.defineProperties(obj, {
  prop1: descriptor1,
  prop2: descriptor2
  // ...
});
```

[Object.getOwnPropertyDescriptors(obj)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/getOwnPropertyDescriptors)

```javascript
let clone = Object.defineProperties({}, Object.getOwnPropertyDescriptors(obj));
```

## 7.2 Property getters and setters

属性有两种类型：

- 数据属性 - *data properties*。绝大多数都是数据属性。
- 访问器属性 - *accessor properties*。本质上是获取和设置值的函数

```javascript
let obj = {
  get propName() {
    // getter, the code executed on getting obj.propName
  },

  set propName(value) {
    // setter, the code executed on setting obj.propName = value
  }
};
```

```javascript
let user = {
  name: "John",
  surname: "Smith",

  get fullName() {
    return `${this.name} ${this.surname}`;
  },

  set fullName(value) {
    [this.name, this.surname] = value.split(" ");
  }
};

// set fullName is executed with the given value.
user.fullName = "Alice Cooper";

alert(user.name); // Alice
alert(user.surname); // Cooper
```

访问器属性的描述符：

- **get** – a function without arguments, that works when a property is read,
- **set** – a function with one argument, that is called when the property is set,
- **enumerable** – same as for data properties,
- **configurable** – same as for data properties.

```javascript
let user = {
  name: "John",
  surname: "Smith"
};

Object.defineProperty(user, 'fullName', {
  get() {
    return `${this.name} ${this.surname}`;
  },

  set(value) {
    [this.name, this.surname] = value.split(" ");
  }
});

alert(user.fullName); // John Smith

for(let key in user) alert(key); // name, surname
```

属性不能同时既是数据属性又是访问器属性，二者只能取其一。

```javascript
function User(name, birthday) {
  this.name = name;
  this.birthday = birthday;

  // age is calculated from the current date and birthday
  Object.defineProperty(this, "age", {
    get() {
      let todayYear = new Date().getFullYear();
      return todayYear - this.birthday.getFullYear();
    }
  });
}

let john = new User("John", new Date(1992, 6, 1));

alert( john.birthday ); // birthday is available
alert( john.age );      // ...as well as the age
```

## 7.3 Prototypal inheritance - 原型继承

- 在 JavaScript 中，所有的对象都有一个隐藏的 `[[Prototype]]` 属性，也许是另外一个对象，也许是 `null`。
- 我们可以使用 `obj.__proto__` 来访问（还有别的方法，以后会说）
-  `[[Prototype]]` 指向的对象称作“原型”
- If we want to read a property of `obj` or call a method, and it doesn’t exist, then JavaScript tries to find it in the prototype. Write/delete operations work directly on the object, they don’t use the prototype (unless the property is actually a setter).
- 如果我们调用 `obj.method()`，并且 `method` 是来自原型的，`this` 仍然指向 `obj`。所以方法总是作用于当前的对象，即使是继承的。

## 7.4 F.prototype

```javascript
let animal = {
  eats: true
};

function Rabbit(name) {
  this.name = name;
}

Rabbit.prototype = animal;

let rabbit = new Rabbit("White Rabbit"); //  rabbit.__proto__ == animal

alert( rabbit.eats ); // true
```

![img](https://javascript.info/article/function-prototype/proto-constructor-animal-rabbit.png)

横向箭头表示是一个常规属性，纵向箭头表示 `rabbit` 继承自 `animal`。

### Default F.prototype, constructor property

每个函数都有 prototype 属性，即使我们不去设置。

默认的 prototype 是一个对象，只有一个属性 constructor，指向函数本身。

```javascript
function Rabbit() {}

/* default prototype
Rabbit.prototype = { constructor: Rabbit };
*/
```

自然，如果什么都不做，constructor 属性会通过 [[Prototype]] 传递给所有的 rabbits

```javascript
function Rabbit() {}
// by default:
// Rabbit.prototype = { constructor: Rabbit }

let rabbit = new Rabbit(); // inherits from {constructor: Rabbit}

alert(rabbit.constructor == Rabbit); // true (from prototype)
```

```javascript
function Rabbit(name) {
  this.name = name;
  alert(name);
}

let rabbit = new Rabbit("White Rabbit");

let rabbit2 = new rabbit.constructor("Black Rabbit");
```

总结：

- The `F.prototype` property is not the same as `[[Prototype]]`. The only thing `F.prototype` does: it sets `[[Prototype]]` of new objects when `new F()` is called.
- The value of `F.prototype` should be either an object or null: other values won’t work.
- The `"prototype"` property only has such a special effect when is set to a constructor function, and invoked with `new`.
-  `F.prototype` 与  `[[Prototype]]` 是不同的。 `F.prototype` 只做了一件事：当调用 `new F()` 的时候，给新的对象设置  `[[Prototype]]` 。
-  `F.prototype` 的值只能是对象或者为 null，其他值都不生效。
-  `"prototype"` 属性只有在设置构造函数，并且由 `new` 触发的时候，才有这种特殊效果。

## 7.5 Native prototypes

```javascript
let obj = {};

alert(obj.__proto__ === Object.prototype); // true
// obj.toString === obj.__proto__.toString == Object.prototype.toString
```

![img](https://github.com/xitu/javascript-tutorial-zh/raw/zh-hans/1-js/07-object-oriented-programming/05-native-prototypes/native-prototypes-classes.png)

```javascript
let arr = [1, 2, 3];

// it inherits from Array.prototype?
alert( arr.__proto__ === Array.prototype ); // true

// then from Object.prototype?
alert( arr.__proto__.__proto__ === Object.prototype ); // true

// and null on the top.
alert( arr.__proto__.__proto__.__proto__ ); // null
```

#### 从原型借用方法：

```javascript
function showArgs() {
  // borrow join from array and call in the context of arguments
  alert( [].join.call(arguments, " - ") );
}

showArgs("John", "Pete", "Alice"); // John - Pete - Alice
```

等价于

```javascript
function showArgs() {
  alert( Array.prototype.join.call(arguments, " - ") );
}
```

## 7.6 Methods for prototypes

- [Object.create(proto[, descriptors\])](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/create) – creates an empty object with given `proto` as `[[Prototype]]` and optional property descriptors.
- [Object.getPrototypeOf(obj)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/getPrototypeOf) – returns the `[[Prototype]]` of `obj`.
- [Object.setPrototypeOf(obj, proto)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/setPrototypeOf) – sets the `[[Prototype]]` of `obj` to `proto`.

```javascript
let animal = {
  eats: true
};

// create a new object with animal as a prototype
let rabbit = Object.create(animal);

alert(rabbit.eats); // true
alert(Object.getPrototypeOf(rabbit) === animal); // get the prototype of rabbit

Object.setPrototypeOf(rabbit, {}); // change the prototype of rabbit to {}
```

```javascript
let animal = {
  eats: true
};

let rabbit = Object.create(animal, {
  jumps: {
    value: true
  }
});

alert(rabbit.jumps); // true
```

对象的完全拷贝：

```javascript
// fully identical shallow clone of obj
let clone = Object.create(Object.getPrototypeOf(obj), Object.getOwnPropertyDescriptors(obj));
```

这样实现了 `obj` 的完整复制，包含了所有属性：可枚举的和不可枚举的，数据属性以及 seeters/getters —— 所有属性，以及正确的 `[[Prototype]]`。

### 原型简史：

为什么有这么多管理 [[Prototype]] 的方法？

- The `"prototype"` property of a constructor function works since very ancient times.
- Later in the year 2012: `Object.create` appeared in the standard. It allowed to create objects with the given prototype, but did not allow to get/set it. So browsers implemented non-standard `__proto__`accessor that allowed to get/set a prototype at any time.
- Later in the year 2015: `Object.setPrototypeOf` and `Object.getPrototypeOf` were added to the standard. The `__proto__` was de-facto implemented everywhere, so it made its way to the Annex B of the standard, that is optional for non-browser environments.
- 构造函数的 `prototype` 属性很早以前就有了。
- 2012年：`Object.create` 出现在标准中。允许使用指定 prototype 创建对象，但是不允许 get/set。所以浏览器实现了一个非标准的 `__proto__ ` 访问器，允许在任何时候 get/set 原型。
- 2015年：`Object.setPrototypeOf` 和 `Object.getPrototypeOf` 被加进了标准中。由于此时 `__proto__` 已经遍地都是了，所以被添加到了标准的附件B之中，其对于非浏览器环境是可选的。

### 获取所有属性：

有很多可以从对象中获取键/值的方法。

我们已知的有：

- [Object.keys(obj)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/keys) / [Object.values(obj)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/values) / [Object.entries(obj)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/entries) – 返回一个数组，报刊所有可枚举的字符串属性的名称/值/键值对。这些方法只列出可枚举的属性，以及以字符串作为键的。

如果我们想要 symbol 属性：

- [Object.getOwnPropertySymbols(obj)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/getOwnPropertySymbols) – 返回包含所有 symbol 属性名称的数组。

如果我们想要非可枚举属性：

- [Object.getOwnPropertyNames(obj)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/getOwnPropertyNames) – 返回包含所有字符串属性名的数组。

如果我们想要**所有**属性：

- [Reflect.ownKeys(obj)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Reflect/ownKeys) – 返回包含所有属性名称的数组。

这些方法和它们返回的属性有些不同，但它们都是对对象本身进行操作。prototype 的属性没有包含在内。

`for...in` 循环有所不同：它会对继承得来的属性也进行循环。

```javascript
let animal = {
  eats: true
};

let rabbit = {
  jumps: true,
  __proto__: animal
};

// only own keys
alert(Object.keys(rabbit)); // jumps

// inherited keys too
for(let prop in rabbit) alert(prop); // jumps, then eats
```

如果我们想要区分继承属性，有一个内置方法 obj.hasOwnProperty(key)：如果 `obj` 有名为 `key` 的自身属性（而非继承），返回值为 `true`。

```javascript
let animal = {
  eats: true
};

let rabbit = {
  jumps: true,
  __proto__: animal
};

for(let prop in rabbit) {
  let isOwn = rabbit.hasOwnProperty(prop);
  alert(`${prop}: ${isOwn}`); // jumps:true, then eats:false
}
```

## 7.8 Class patterns

### Functional class pattern

```javascript
function User(name, birthday) {
  // only visible from other methods inside User
  function calcAge() {
    return new Date().getFullYear() - birthday.getFullYear();
  }

  this.sayHi = function() {
    alert(`${name}, age:${calcAge()}`);
  };
}

let user = new User("John", new Date(2000, 0, 1));
user.sayHi(); // John, age:17
```

在这段代码中变量 `name`、`birthday` 和方法 `calcAge()` 是内部的，对对象来说是**私有的**。他们只对它的内部可见。

另一方面，`sayHi` 是外部的，**公有的**方法。创建 `user` 的外部代码可以访问它。

### Factory class pattern

我们可以完全不使用 `new` 关键字来创建一个类。

```javascript
function User(name, birthday) {
  // only visible from other methods inside User
  function calcAge() {
    return new Date().getFullYear() - birthday.getFullYear();
  }

  return {
    sayHi() {
      alert(`${name}, age:${calcAge()}`);
    }
  };
}

let user = User("John", new Date(2000, 0, 1));
user.sayHi(); // John, age:17
```

函数 User 返回了一个对象，带有公共属性和方法。除了省去了用 new 来创建对象，其他的和上面一种是一样的。

### Prototype-based classes

最重要也是最好的。前两种在实际中很少用到。

```javascript
function User(name, birthday) {
  this._name = name;
  this._birthday = birthday;
}

User.prototype._calcAge = function() {
  return new Date().getFullYear() - this._birthday.getFullYear();
};

User.prototype.sayHi = function() {
  alert(`${this._name}, age:${this._calcAge()}`);
};

let user = new User("John", new Date(2000, 0, 1));
user.sayHi(); // John, age:17
```

代码结构：

- 构造函数 User 只初始化当前对象状态。
- 所有的方法都加到了 `User.prototype` 里面。

与前两者相比的优点是：

- 在函数模式，每个对象都得拷贝一份所有的方法。
- 原型模式下，所有的方法都在 User.prototype，与所有的对象共享。对象本身只存储数据。

所以原型模式是内存使用更高效的。

不只是这些。原型可以让我们以一种高效的方式来设置继承。内置的 JavaScript对象使用的都是原型。后面还要讲到 class 语法结构。

### Prototype-based inheritance for classes

```javascript
// Same Animal as before
function Animal(name) {
  this.name = name;
}

// All animals can eat, right?
Animal.prototype.eat = function() {
  alert(`${this.name} eats.`);
};

// Same Rabbit as before
function Rabbit(name) {
  this.name = name;
}

Rabbit.prototype.jump = function() {
  alert(`${this.name} jumps!`);
};

// setup the inheritance chain
Rabbit.prototype.__proto__ = Animal.prototype; // (*)

let rabbit = new Rabbit("White Rabbit");
rabbit.eat(); // rabbits can eat too
rabbit.jump();
```

## 7.9 Classes

```javascript
function User(name) {
  this.name = name;
}

User.prototype.sayHi = function() {
  alert(this.name);
}

let user = new User("John");
user.sayHi();
```

用 class 改写：

```javascript
class User {

  constructor(name) {
    this.name = name;
  }

  sayHi() {
    alert(this.name);
  }

}

let user = new User("John");
user.sayHi();
```

注意方法之间不能有逗号。

 `class User {...}`在这里实际上做了两件事：

1. Declares a variable `User` that references the function named `"constructor"`.
2. 声明一个变量 `User` ，指向名叫 `"constructor"` 的函数。
3. Puts methods listed in the definition into `User.prototype`. Here, it includes `sayHi` and the `constructor`.
4. 把方法都挂载到 `User.prototype`上。如示例中的 `sayHi` 和 `constructor` 两个方法。

```javascript
class User {
  constructor(name) { this.name = name; }
  sayHi() { alert(this.name); }
}

// proof: User is the "constructor" function
alert(User === User.prototype.constructor); // true

// proof: there are two methods in its "prototype"
alert(Object.getOwnPropertyNames(User.prototype)); // constructor, sayHi
```

#### 静态方法

```javascript
class User {
  static staticMethod() {
    alert(this === User);
  }
}

User.staticMethod(); // true
```

```javascript
function User() { }

User.staticMethod = function() {
  alert(this === User);
};
```



## 7.10 Class inheritance, super

```javascript
class Rabbit extends Animal {
  hide() {
    alert(`${this.name} hides!`);
  }
}
```

（没看完。。。）

## 7.11 Class checking: "instanceof"

*polymorphic* function 多态函数

### instanceof

```javascript
obj instanceof Class
```

```javascript
class Rabbit {}
let rabbit = new Rabbit();

// is it an object of Rabbit class?
alert( rabbit instanceof Rabbit ); // true
```

```javascript
// instead of class
function Rabbit() {}

alert( new Rabbit() instanceof Rabbit ); // true
```

### toString

- For a number, it will be `[object Number]`
- For a boolean, it will be `[object Boolean]`
- For `null`: `[object Null]`
- For `undefined`: `[object Undefined]`
- For arrays: `[object Array]`

```javascript
let s = Object.prototype.toString;

alert( s.call(123) ); // [object Number]
alert( s.call(null) ); // [object Null]
alert( s.call(alert) ); // [object Function]
```

|               | works for                                                    | returns    |
| ------------- | ------------------------------------------------------------ | ---------- |
| `typeof`      | primitives                                                   | string     |
| `{}.toString` | primitives, built-in objects, objects with `Symbol.toStringTag` | string     |
| `instanceof`  | objects                                                      | true/false |

## 7.12 Mixins

```javascript
// mixin
let sayHiMixin = {
  sayHi() {
    alert(`Hello ${this.name}`);
  },
  sayBye() {
    alert(`Bye ${this.name}`);
  }
};

// usage:
class User {
  constructor(name) {
    this.name = name;
  }
}

// copy the methods
Object.assign(User.prototype, sayHiMixin);

// now User can say hi
new User("Dude").sayHi(); // Hello Dude!
```

### EventMixin

```javascript
let eventMixin = {
  /**
   * Subscribe to event, usage:
   *  menu.on('select', function(item) { ... }
  */
  on(eventName, handler) {
    if (!this._eventHandlers) this._eventHandlers = {};
    if (!this._eventHandlers[eventName]) {
      this._eventHandlers[eventName] = [];
    }
    this._eventHandlers[eventName].push(handler);
  },

  /**
   * Cancel the subscription, usage:
   *  menu.off('select', handler)
   */
  off(eventName, handler) {
    let handlers = this._eventHandlers && this._eventHandlers[eventName];
    if (!handlers) return;
    for (let i = 0; i < handlers.length; i++) {
      if (handlers[i] === handler) {
        handlers.splice(i--, 1);
      }
    }
  },

  /**
   * Generate the event and attach the data to it
   *  this.trigger('select', data1, data2);
   */
  trigger(eventName, ...args) {
    if (!this._eventHandlers || !this._eventHandlers[eventName]) {
      return; // no handlers for that event name
    }

    // call the handlers
    this._eventHandlers[eventName].forEach(handler => handler.apply(this, args));
  }
};
```

```javascript
// Make a class
class Menu {
  choose(value) {
    this.trigger("select", value);
  }
}
// Add the mixin
Object.assign(Menu.prototype, eventMixin);

let menu = new Menu();

// call the handler on selection:
menu.on("select", value => alert(`Value selected: ${value}`));

// triggers the event => shows Value selected: 123
menu.choose("123"); // value selected
```

