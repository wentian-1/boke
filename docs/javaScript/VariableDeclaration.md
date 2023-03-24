---
title: 重学JavaScript系列-01-变量声明
date: 2023-03-23
sidebar: 'auto'
categories:
 - 重学js
tags:
 - JavaScript
publish: false
---
es变量类型是松散的，每个变量可以保存任意类型的值。在es中声明变量有三种方式**var、let、const**
其中var在所有版本中都能用，let、const只能用在es6或者更晚的版本中。
:::tip
以下代码均在浏览器端运行。
:::
## var
+ var可以多次声明，值为最近一次的声明。
```js
var msg = 'yfc';
var msg = 'hl';
```
+ var 在全局作用域中，var声明的变量会自动挂载在全局对象中。window global globalThis
+ 无法被delete删除。这种方式是全局变量而不是全局对象的属性，js具备自动化的内存管理机制，所以delete删除变量毫无意义。
```js
var msg = 'yfc';
console.log(window.msg); // yfc
delete window.msg;
console.log(window.msg); // yfc
```
+ 全局变量还有两种情况，第一直接在全局中定义名字，第二是在函数内部直接定义名字。
```js
name1 = 'yfc';
function test() {
	name2 = 'hl';
}
console.log(name1); // yfc
// console.log(name2); // ReferenceError: name2 is not defined
test();
console.log(name2); // hl
```
在函数test未调用之前，name2不存在，一旦函数调用就会创建一个全局变量。
+ 函数内部的var
```js
	function test() {
		var mgs = 'yfc';
	}
	test();
	console.log(msg); // ReferenceError: msg is not defined
```
在函数内部声明的变量会成为函数的局部变量，在函数执行完毕后销毁。
+ var的声明提升
```js
function test() {
	console.log(msg); // undefind
	var msg = 'yfc';
	console.log(msg); // yfc
}
test();
```
这里的声明提升就是将所有的变量提升至作用域的最顶层，但赋值位置不变。

## let
let作用跟var相似但又有明显区别。
+ let声明的是块级作用域，var声明的是函数作用域。
```js
{
	var name1 = 'yfc';
	let name2 = 'hl';
}
console.log(name1);
console.log(name2); // ReferenceError: name2 is not defined
```
+ 在同一个块级作用域不允许重复声明
```js
{
	let msg = 'yfc';
	let msg = 'hl'; // SyntaxError: Identifier 'msg' has already been declared
}
```
+ 暂时性死区---不会声明提升
```js
console.log(name); // ReferenceError: Cannot access 'name' before initialization
let name = 'yfc';
```
+ 不会成为全局对象的属性
```js
let msg = 'yfc';
console.log(window.msg); // undefind
```
## const
const和let基本相同，唯一的区别是const在声明时候必须赋值且不能再次更改。注意：**只使用它指向的变量引用**如果是一个对象，那么可以更改属性值。

## 风格实践
+ 使用let const 代替var
+ const优先 let次之




