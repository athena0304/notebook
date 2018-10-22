## 面向对象编程：更改原型时，记得设置构造函数属性

手动给新对象重新设置`原型`对象，会产生一个重要的副作用：删除了`constructor`属性！我们来看一下，上一个挑战中`duck`的`constructor`属性输出到控制台的结果：

> console.log(duck.constructor)
> // 哎呀，控制台中输出了 undefined！

为了解决这个问题，凡是手动给新对象重新设置过原型对象的，都别忘记在原型对象中定义一个`constructor`属性：

> Bird.prototype = {
>   constructor: Bird, // 定义 constructor 属性
>   numLegs: 2,
>   eat: function() {
> ​    console.log("nom nom nom");
>   },
>   describe: function() {
> ​    console.log("My name is " + this.name); 
>   }
> };



## 面向对象编程：了解对象的原型来自哪里

就像人们从父母那里继承基因一样，对象也可直接从创建它的构造函数那里继承其`原型`。请看下面的例子：`Bird`构造函数创建了一个`duck`对象：

> function Bird(name) {
>   this.name = name;
> }
>
> let duck = new Bird("Donald");

`duck`从`Bird`构造函数那里继承了它的`原型`，你可以使用`isPrototypeOf`方法来验证他们之间的关系：

> Bird.prototype.isPrototypeOf(duck);
> // 返回 true



函数式编程：

使全局数组`bookList`在函数内部不会被改变。`add`函数可以将指定的`bookName`增加到数组末尾。`remove`函数可以从数组中移除指定`bookName`。两个函数都返回数组，并且任何参数都应该添加到`bookName`前面。

```javascript
function add (list,bookName) {
  return [...list, bookName];
}

function remove (list,bookName) {
  if (list.indexOf(bookName) >= 0) {
    return list.filter((item) => item !== bookName);
    }
}
```

