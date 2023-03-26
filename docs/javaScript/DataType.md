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
const num2 = 10;
console.log(num2.toString(2));
console.log(num2.toString(8));
console.log(num2.toString(10));
console.log(Sy.toString(16));
```
::: warning
+ 注意不能直接拿着数字的字面量.toString
+ 注意null 和 undefined不能toString
+ 字符串.toString只会返回自身的一个copy
+ 数组调用会返回,拼接的字符串
+ 对象没有toString方法
+ 对于数值调用toString方法时候可以传递参数，表示转换为几进制，其余类型传参无用
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

## number
number是JavaScript中唯一的数值类型，JavaScript中的数字类型是基于IEEE 754标准来实现的浮点数，并且是双精度格式（64位二进制）。
### 创建方式
+ 直接以数字字面量创建为原始值
```js
const num1 = 123;
console.log(num1);
```
+ 使用构造函数
```js
const num2 = new Number(123);
console.log(num2);
```
虽然这两种方式都可以穿件，但和string一样，typeof的返回值不同，一个是number，一个是object，并且使用构造函数创建的数值的valueOf返回原始值。
+ 数值有二级制，八进制，十进制，十六进制。平常创建的数值默认为十进制。对于数值调用toString方法传入2, 8, 16可将数值转换为相应的进制值。
```js
const num3 = 10;
const num4 = 0b10;
const num5 = 0o10;
const num6 = 0x10;
```
### Number的特点
+ 整数的安全范围
```js
-Number.MAX_SAFE_INTEGER-Number.MAX_SAFE_INTEGER
```
一旦超过这个值，那么精度将会丢失，比如数据库中的64位id，一般这种情况需要转换为字符串。
+ 较小的数值
二进制精度一直存在较小值运算精度丢失问题，比如
```js
console.log(0.1+0.2 === 0.3) // false
```
所以在处理小数运算时候要特别注意，最常见的方式是设置误差范围，通常称为“机械精度”，值为2^-52，在es6中存储在**Number.EPSILON**中
```js
console.log(Math.abs(0.1+0.2-0.3) < Number.EPSILON) // true
```
+ 不是数字的数字 NaN
NaN not a number，是一个警戒值，用于指出数学运算没有成功，失败后返回的结果。
```js
console.log(10 / 'a'); // NaN
```
NaN 是一个特殊值，和自身不相等。
```js
NaN === NaN // false
NaN != NaN // true
```
+ 无穷数
无穷大**Number.POSITIVE_INFINITY**
无穷小**Number.POSITIVE_INFINITY**
```js
console.log(1/ 0 === Number.POSITIVE_INFINITY); // true
console.log(-1/ 0 === Number.POSITIVE_INFINITY); // false
```
+ 零值
js中有个常规的0，还有一个-0，-0可以作为常量，也可以是数学运算的返回值，**只限于乘法除法**
```js
console.log(-0); // 0
console.log(-1 + 1); // 0
console.log(1 - 1); // 0
console.log(-1 * 0); // -0
console.log(0 / -1); // -0
```
有意思的是將-0




