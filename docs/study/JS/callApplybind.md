---
title: call apply bind
date: 2024-04-11
sidebar: 'auto'
categories:
 - javascript
tags:
 - javascript
publish: true
---

## call
在js中，call方法是属于一个函数原型的方法
::: tip
+ call用来调用一个函数来指定函数内部的this值，同时允许传递一个参数列表给被调用函数。    
`functionName.call(thisArg, arg1, arg2, ...)`    
+ functionName 是你想更改this指向的函数
+ thisArg 是functionName在运行时指定this的值
+ arg1,arg2,... 是传递给functionName函数的一个参数列表
:::
举个例子
```js
var persion = {
  name: 'yfc'
}
function greet(age) {
  console.log('姓名：' + this.name + ';年龄：' + age + ';所有参数：' + [...arguments])
  // 姓名：yfc;年龄：10;所有参数：10,20
}
greet.call(persion, 10, 20)
```
### 第一步
由简到难，根据上面例子，先忽略掉传参
```js
var persion = {
  name: 'yfc'
}
 function greet() {
  console.log(this.name)
}
greet.call(persion)
```
设想函数被call调用后，函数发生如下改变
```js
var persion = {
  name: 'yfc',
  greet: function() {
    console.log(this.name)
  }
}
persion.greet(); // 'yfc'
```
这个时候，虽然实现了初步功能，但是`persion`新增了参数，这不合适，不过没关系。执行完毕后删掉就好
```js
var persion = {
  name: 'yfc',
  greet: function() {
    console.log(this.name)
  }
}
persion.greet(); // 'yfc'
delete greet();
```
如此，初步思路打通
::: tip
+ 将函数设为对象的属性
+ 执行函数
+ 删除函数
:::
所以以上例子就是
```js
persion.fn = greet;
persion.fn();
delete persion.fn
```
由此尝试第一版的自定义call函数
```js
 var persion = {
  name: 'yfc'
}
Function.prototype.call2 = function(context) {
  context.fn = this;
  context.fn();
  delete context.fn;
}

function greet() {
  console.log(this.name)
}
greet.call2(persion)
```
如此，不可以传参数的已经实现
### 第二步
刚说到call可以接受多个参数，并且传递给被调用的函数，比如最开始的例子。    
那么如何实现呢？    
`arguments`   
该属性可以接受函数传入的所有的参数，所以，第一个就是thisArg，其余的是函数的参数，如此我们只需要把从第2个参数开始到最后一个取出来，放到执行函数中就好。    
```js
var persion = {
  name: 'yfc'
}
Function.prototype.call2 = function(context) {
  var args = []
  for (var i = 1; i < arguments.length; i++) {
    args.push(arguments[i])
  }
  context.fn = this;
  context.fn(...args);
  delete context.fn;
}

function greet(a, b, c) {
  console.log(a, b, c)
  console.log(this.name)
}
greet.call2(persion, 1, 2, 3, 4)
```
如此，解决了参数的问题，但是用es6的方式实现es3的方法，虽然没关系，但，，，，    
使用eval，它可以接受一个字符串，当做js代码运行
```js
var persion = {
  name: 'yfc'
}
Function.prototype.call2 = function(context) {
  var args = []
  for (var i = 1; i < arguments.length; i++) {
    args.push('arguments[' + i + ']'));
  }
  context.fn = this;
  eval('context.fn(' + args + ')');
  delete context.fn;
}

function greet(a, b, c) {
  console.log(a, b, c) // 1,2,3
  console.log(this.name)
}
greet.call2(persion, 1, 2, 3, 4)
```
::: warning
注意：细心地发现`args.push(arguments[i])` => `args.push('arguments[' + i + ']'));`     
这是因为如果参数是一个对象，`args.push(arguments[i])`这种将会失效
:::
### 第三步
考虑到`call`的第一个参数可以是`null`，如果是null，就指向Window，且接收的函数是可以有返回值的
```js
   var persion = {
  name: 'yfc'
}
Function.prototype.call2 = function(context) {
  var context = context || window
  context.fn = this;
  var args = []
  for (var i = 1; i < arguments.length; i++) {
    args.push('arguments[' + i + ']'));
  }
  let result = eval('context.fn(' + args + ')');
  delete context.fn;
  return result;
}

function greet(a, b, c) {
  console.log(a, b, c)
  console.log(this.name)
  return [a, b, c]
}
console.log(greet.call2(persion, 1, 2, 3, 4))
```
现在还有一个小瑕疵，那就是`fn`属性，我们不能保证接受的参数中没有这个属性，所以进一步完善使用     
`Symbol`    
```js
    var persion = {
  name: 'yfc'
}
Function.prototype.call2 = function(context) {
  var context = context || window
  var fn = Symbol('fn')
  context[fn] = this;
  var args = []
  for (var i = 1; i < arguments.length; i++) {
    args.push('arguments[' + i + ']'));
  }
  let result = eval('context[fn](' + args + ')');
  delete context.fn;
  return result;
}

function greet(a, b, c) {
  console.log(a, b, c)
  console.log(this.name)
  return [a, b, c]
}
console.log(greet.call2(persion, 1, 2, 3, 4))
```
唯一可惜的是`Symbol`是es6的
至此call实现完毕

## apply
`apply` 跟`call`类似，不同的是`apply`第二个参数接受的是一个数组
具体实现
```js
Function.prototype.apply2 = function(context, arr) {
  var context = context || window;
  var fn = Symbol('fn');
  context[fn] = this;
  var result;
  if (!arr || !Array.isArray(arr)) {
    result = context[fn]();
  } else {
    var args = [];
    for (var i = 0; i < arr.length; i++) {
      args.push('arr[' + i + ']');
      result = eval('context[fn](' + args + ')');
    }
  }
  delete context[fn];
  return result;

}

function greet(...args) {
  console.log(this.name, args)
}
var persion = {
  name: 'yfc'
}
greet.apply2(persion, [{
  name: 'hl'
}]);
```

## bind
`bind`会创建一个新的函数，一个参数为运行时的`this`，其余参数为函数运行时的参数，所以
::: tip
1、返回一个函数
2、可以接受多个参数
:::
```js
var persion = {
  name: 'yfc'
}
function greet() {
  console.log(this.name)
}
var greet2 = greet.bind(persion);
greet2();
```
### 第一步
关于this的指向可以借用`call`或者`apply`实现
```js
    var persion = {
  name: 'yfc'
}

function greet() {
  console.log(this.name)
}

Function.prototype.bind2 = function(context) {
  var self = this;
  return function() {
    return self.apply(context)
  }
}
greet.bind2(persion)()
```
### 第二步
接受参数，`bind`可以接受参数，而返回的函数也可以接受参数
```js
var persion = {
  name: 'yfc'
}

function greet() {
  console.log(arguments)
  console.log(this.name)
}

Function.prototype.bind2 = function(context) {
  var self = this;
  var args = Array.prototype.slice.call(arguments, 1);
  return function() {
    var bindArgs = Array.prototype.slice.call(arguments);
    return self.apply(context, args.concat(bindArgs));
  }
}
greet.bind2(persion, 1, 2, 3)(4, 5, 6)
```
### 第三部
::: tip
如果目标函数是可构造的，绑定函数也可以使用`new `运算符进行构造。这样做的效果就好像目标函数本身被构造一样。前置的参数会像通常一样传递给目标函数，而提供的`this`值会被忽略（因为构造函数会准备自己的`this`
:::
也就是说，`bind`返回的函数作为构造函数使用的时候，`bind`绑定的`this`值就会被忽略
```js

var name = 'hl'
var persion = {
  name: 'yfc'
}

function greet(name, age) {
  this.habit = 'it';
  console.log(this.name); // undefined
  console.log(name); // wk
  console.log(age); // 20
}
greet.prototype.friend = 'kevin';
var bindGreet = greet.bind(persion, 'wk')
var obj = new bindGreet('20');
console.log(obj.habit); // it
console.log(obj.friend); // kevin
```
这个时候`name`值已经是`undefined`了，尽管全局和函数里面都声明了，说明`this`绑定已经失效，这个时候this已经指向`obj`了