# 基础知识

## 检查素数

```js
function isPrime (n) {
    for (let i = 2; i < n; i++) {
        if(n % i == 0) return false
    }
    return true
}
```

## 递归计算x的n次方

```js
// 写法一：迭代
function pow(x, n) {
  let result = 1;

  // multiply result by x n times in the loop
  for (let i = 0; i < n; i++) {
    result *= x;
  }

  return result;
}

// 写法二：递归
function pow(x, n) {
  if (n == 1) {
    return x;
  } else {
    return x * pow(x, n - 1);
  }
}

// 写法三：三元运算符递归
function pow(x, n) {
  return (n == 1) ? x : (x * pow(x, n - 1));
}

// 调用
alert( pow(2, 3) ); // 8
```

![img](https://javascript.info/article/recursion/recursion-pow.png)