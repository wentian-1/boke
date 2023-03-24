---
title: 重学JavaScript系列-02-数据类型
date: 2023-03-23
sidebar: 'auto'
categories:
 - 重学js
tags:
 - JavaScript
publish: true
---
es有六种基础数据类型**String、Number、Boolean、Undefined、Null、Symbol(新增)**和一种叫Object的复杂类型。Object是一种无序的键值对集合。
## String
string类型表示0或多个的16位Unicode字符序列。
### 创建方式
+ 直接以字符串字面量将字符串创建为原始值
```js
let str = 'yfc';
```
+ 使用构造函数
```js
let str1 = new String('hl');
```
虽然这两种方式都可以创建字符串，但还是有本质区别
+ typeof 返回值不同
```js
let str = 'yfc';
console.log(typeof str); // string
let str1 = new String('hl');
console.log(typeof str1); // Object
```
+ String对象始终可以使用valueOf返回原始值
```js
let str1 = new String('hl');
console.log(str1.valueOf())
```
### 字符串特点
一旦创建，值就无法改变，要修改其值必须先销毁原始的字符串。
### 类型转换
+ 使用toString
```js
const num = 1;
console.log(num.toString());
console.log(true.toString());
console.log(Symbol(2).toString());
```
::: warning
+ 注意不能直接拿着数字的字面量.toString
+ 注意null 和 undefined不能toString
+ 字符串.toString只会返回自身的一个copy
+ 数组调用会返回,拼接的字符串
+ 对象没有toString方法
:::
+ String()
```js
console.log(String(1));
console.log(String(false));
console.log(String(Symbol(2)));
console.log(String(null));
console.log(String(undefined));
console.log(String([1,2]));
console.log(String({}));
```
::: warning
+ 注意数组和toString一致
+ 对象也可以使用String，返回的是[object, object]
:::
+ 使用 + '' 的方法
```js
console.log(1+'');
console.log(null + '');
console.log(true + '');
console.log(undefined + '');
console.log([1] + '');
console.log('' + {}); // [object, object]
```
### 模板字面量
es6新定义的功能，基础语法使用``包裹
```js
let str2 = 'world';
console.log(`hello ${str2}`);
console.log(`hello ${str2.toUpperCase()}`);
console.log(`hello ${{toString: ()=> str2 + '!!'}}`);
```
::: warning
+ 注意将表达式转换为字符串时，调用了toString方法
:::
+ 支持标签函数
```js
const num1 = 20;
const num2 = 32;

const result1 = `${num1} + ${num2} = ${num1 + num2}`;
console.log(result1);

function test1(strings, ...args) {
	console.log(strings);
	console.log(args);
	return 'hello world';
}
const result2 = test1`${num1} + ${num2} = ${num1 + num2}`;
console.log(result2);
```
在标签函数中可以自定义行为

### 

