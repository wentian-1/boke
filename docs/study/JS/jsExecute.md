---
title: Js执行
date: 2023-08-29
sidebar: 'auto'
categories:
 - javascript
tags:
 - javascript
publish: true
---

## 词法作用域
js使用的是词法作用域也叫静态作用域，也就是说函数的作用域在定义时候已经决定，比如：
```js
  var value = 'global';
  function fun1() {
    console.log(value); // global
  }
  function fun2() {
    var value = 'local';
    fun1();
  }
  fun2();
```

## 执行顺序
看以下两段代码
```js
var foo = ()=>{
  console.log('foo1')
}
foo() // foo1
var foo = ()=>{
  console.log('foo2')
}
foo() // foo2
```

```js
function foo() {
  console.log('foo1')
}
foo() // foo2
function foo() {
  console.log('foo2')
}
foo() // foo3
```
这是因为js引擎并非一行行地分析和执行程序，而是一段段进行分析。当执行一段代码时候，首先会进行一个准备工作，比如第一个例子的变量提升，第二个的函数提升。

## 可执行代码
在js中可执行代码（executable code）包含三种：全局代码、函数代码、eval代码

## 执行上下文栈
在工作中需要写的函数有很多，那么如何管理创建那么多执行上下文呢？
JavaScript引擎创建了执行上下文栈（Execution context stack，ECS）来管理执行上下文
首先我们定义一个执行栈，是一个先进后出，后进先出的结构
```js
ESStack = []
```
当代码执行的时候首先进入到一个全局环境global，所以执行栈中会放入一个globalContext，然后每次遇到函数调用（eval用的较少，暂不考虑）就会创建一个函数环境然后压入执行栈，当函数执行完毕后，就会从执行栈中弹出，直到当前执行程序结束，执行栈才会被清空。<br />
比如以下代码
```js
function f3() {
  console.log('f3')
}
function f2() {
  f3()
}
function f1() {
  f2()
}
f1()
```
当执行一个函数时候，就会创建一个执行上下文，并压入执行上下文栈，当函数执行完毕时候，就会将函数的执行上下文从栈中弹出，下面模拟下上面代码的执行
```js
// f1()
ESStack.push(<f1> functionContext);
// f1中调用了f2
ESStack.push(<f2> functionContext);
// f2中调用了f3
ESStack.push(<f3> functionContext);
// f3执行完毕
ESStack.pop()
// f2执行完毕
ESStack.pop()
// f1执行完毕
ESStack.pop()
```
接下来看一下代码
```js
var scope = "global scope";
function checkscope(){
    var scope = "local scope";
    function f(){
        return scope;
    }
    return f();
}
checkscope();
```
```js
ESStack.push(<checkscope> functionContext);
ESStack.push(<f> functionContext);
ESStack.pop();
ESStack.pop();
```

```js
var scope = "global scope";
function checkscope(){
    var scope = "local scope";
    function f(){
        return scope;
    }
    return f;
}
checkscope()();
```
```js
ESStack.push(<checkscope> functionContext);
ESStack.pop();
ESStack.push(<f> functionContext);
ESStack.pop();
```
虽然结果一样，但是执行上下文栈不一样。







