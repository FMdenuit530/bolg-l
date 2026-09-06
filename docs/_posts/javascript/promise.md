---
title: JavaScript Promise
date: 2026-08-30
description: 学习 JavaScript Promise 的基本概念和异步编程中的常见用法。
category: JavaScript
tags:
  - JavaScript
  - Promise
---

# JavaScript Promise

Promise 是 JavaScript 异步编程中非常重要的一个概念。

## 什么是 Promise

Promise 可以用来处理异步操作。

## 基本用法

```javascript
const promise = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve('操作成功')
  }, 1000)
})

promise.then((result) => {
  console.log(result)
})
```
