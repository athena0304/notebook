# 理解 JavaScript 中的设计模式

当你开始一个新的项目时，一般不会立即开始编码。首先必须定义项目的目的和范围，然后列出项目的特性或规格。在可以开始编写代码之后，或者如果你正在处理一个更复杂的项目，那么你应该选择一个最适合该项目的设计模式。

## 什么是设计模式？

在软件工程中，设计模式是软件设计中常见问题的可重用解决方案。设计模式代表了经验丰富的软件开发人员所使用的最佳实践。设计模式可以看作是编程模板。

### 为什么要使用设计模式？

很多程序员要么认为设计模式浪费时间，要么不知道如何恰当地应用它们。但是使用适当的设计模式可以帮助您编写更好、更易于理解的代码，并且代码可以很容易地维护，因为它更容易理解。

最重要的是，设计模式为软件开发人员提供了一个可以讨论的通用词汇表。它们会立即向学习代码的人显示代码的意图。

例如，如果你在项目中使用装饰者模式，那么新加入的开发人员将立即知道这段代码在做什么，所以他们可以更关注于解决业务问题，而不是试图理解代码在做什么。

现在我们已经知道了什么是设计模式，以及它们为什么重要，接下来让我们深入研究 JavaScript 中使用的各种设计模式。

## 模块模式-Module Pattern

模块是一段自包含的代码，因此我们可以在不影响代码其他部分的情况下更新模块。模块还允许我们通过为变量创建单独的作用域来避免命名空间污染。当模块与其他代码片段分离时，我们还可以在其他项目中重用它们。

模块是任何现代 JavaScript 应用程序的组成部分，它有助于保持代码的整洁、分离和组织。用 JavaScript 创建模块有很多方法，模块模式是其中之一。

与其他编程语言不同，JavaScript没有访问修饰符，也就是说，不能将变量声明为私有或公共。因此，模块模式也被用来模拟封装的概念。

该模式使用IIFE(立即调用的函数表达式)、闭包和函数作用域来模拟此概念。例如:

```js
const myModule = (function() {
  
  const privateVariable = 'Hello World';
  
  function privateMethod() {
    console.log(privateVariable);
  }
  return {
    publicMethod: function() {
      privateMethod();
    }
  }
})();
myModule.publicMethod();
```

由于它是IIFE，代码立即被执行，返回的对象被分配给 `myModule` 变量。因为闭包，所以返回的对象仍然可以访问在IIFE中定义的函数和变量，即使在IIFE结束之后。

所以在 IIFE 中定义的变量和函数在外部作用域是不可见的，于是成为了 `myModule` 的私有变量。

代码执行过后，`myModule` 变量看上去是这样的：

```js
const myModule = {
  publicMethod: function() {
    privateMethod();
  }};
```

因此，我们可以调用 `publicMethod()`，后者将依次调用 `privateMethod()`。例如:

```js
// Prints 'Hello World'
module.publicMethod();
```

## 揭示模块模式-Revealing Module Pattern

揭示模块模式是由Christian Heilmann基于模块模式略微改进的版本。模块模式的问题是，我们必须创建新的公共函数，仅仅是用来调用私有函数和变量。

```js
const myRevealingModule = (function() {
  
  let privateVar = 'Peter';
  const publicVar  = 'Hello World';
  function privateFunction() {
    console.log('Name: '+ privateVar);
  }
  
  function publicSetName(name) {
    privateVar = name;
  }
  function publicGetName() {
    privateFunction();
  }
  /** reveal methods and variables by assigning them to object     properties */
return {
    setName: publicSetName,
    greeting: publicVar,
    getName: publicGetName
  };
})();
myRevealingModule.setName('Mark');
// prints Name: Mark
myRevealingModule.getName();
```



















































