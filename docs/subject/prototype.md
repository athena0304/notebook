# 原型相关

# 一道题

```js
function Parent() {
    this.a = 1;
    this.b = [1, 2, this.a];
    this.c = { demo: 5 };
    this.show = function () {
        console.log(this.a , this.b , this.c.demo );
    }
}
function Child() {
    this.a = 2;
    this.change = function () {
        this.b.push(this.a);
        this.a = this.b.length;
        this.c.demo = this.a++;
    }
}
Child.prototype = new Parent(); 
var parent = new Parent();
var child1 = new Child();
var child2 = new Child();
child1.a = 11;
child2.a = 12;
parent.show();
child1.show();
child2.show();
child1.change();
child2.change();
parent.show();
child1.show();
child2.show();
```

#### 题目涉及的知识点

- this的指向
- 原型机原型链
- 类的继承
- 原始类型和引用类型的区别
  每一个知识点都可以拿出来做单独的专题研究。

#### 解题需要的知识点细节

- 1.构造函数，都有一个`prototype`属性，指向构造函数的原型对象，实例会共享同一个原型对象;
- 2.实例生成时，会在内存中产生一块新的堆内存，对实例的一般操作将不影响其他实例，因为在堆内存里占据不同空间，互不影响;
- 3.每一个实例都有一个隐式原型`__proto__`指向构造函数的原型对象;
- 4.`this`的指向问题,常见的情况包含如下几种：
  - 4.1 **作为对象方法时，谁调用就指向谁**(本题中主要涉及这一条)
  - 4.2 作为函数调用时，指向全局顶层变量`window`
  - 4.3 作为构造函数调用时，即`new`操作符生成实例时，构造函数中的this指向实例
  - 4.4 `call`和`apply`方法中，显示指定`this`的绑定为指定上下文
- 5.字面量的方式(*也有资料将literal翻译为\**直接量**,个人认为后一种翻译其实更直观更形象*)进行对象和数组赋值（数组本质也是对象）时，都是引用，即在堆内存生成资源，在栈内存生成变量，然后变量指向资源的地址。
- 6.原型链的查找规则遵循**最短路径**原则，即先查找实例属性，然后顺着原型链去查找指定的属性，直至原型链末端的`Object.prototype`和`null`，如果实例自身及整个原型链都不存在所查找的属性则返回`undefined`
- 7.赋值语句对于原始值赋值和引用类型赋值时的细节区别.

<p data-height="265" data-theme-id="0" data-slug-hash="YJVgRE" data-default-tab="js,result" data-user="athena0304" data-pen-title="一道原型题" class="codepen">See the Pen <a href="https://codepen.io/athena0304/pen/YJVgRE/">一道原型题</a> by Athena (<a href="https://codepen.io/athena0304">@athena0304</a>) on <a href="https://codepen.io">CodePen</a>.</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

## 又一道题

```js
var F=function(){};

Object.prototype.a=function(){

console.log('a()')

};

Function.prototype.b=function(){

console.log('b()')

}

var f=new F();

f.a()//a()

f.b()//报错找不到b这个函数

F.a()//a()

F.b()//b()
```



![prototype](/Users/athena/code/notebook/assets/prototype.png)![clipboard.png](https://img.javascriptcn.com/b6cc4ca8c741ce8db483d6e0070a5721?imageView2/2/w/800)

![clipboard.png](https://img.javascriptcn.com/5c1b0d233c325c787d2ccb689fa63f01?imageView2/2/w/800)

![clipboard.png](https://img.javascriptcn.com/f8c3506af898d6cd6ebaccdae7ad0ebb?imageView2/2/w/800)

直角表示是构造函数，圆角表示对象