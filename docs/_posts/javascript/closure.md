---
title: JavaScript Closure
date: 2026-08-30
category: JavaScript

tags:
  - JavaScript
  - 闭包

description: 深入理解 JavaScript 闭包的概念、作用域、变量保存机制以及闭包在实际开发中的常见应用。
---

# JavaScript 闭包

这是我的第一篇技术文章。

## 什么是闭包

闭包是 JavaScript 中非常重要的概念。

## 一个简单的例子

```javascript
function createCounter() {
  let count = 0

  return function () {
    count++

    return count
  }
}

const counter = createCounter()

console.log(counter()) // 1
console.log(counter()) // 2
console.log(counter()) // 3
```
