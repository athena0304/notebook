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

### Recursion and stack
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