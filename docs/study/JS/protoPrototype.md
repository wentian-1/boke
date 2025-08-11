---
title: 原型与原型链
date: 2023-08-28
sidebar: 'auto'
categories:
 - javascript
tags:
 - javascript
publish: true
---

## prototype
每一个函数都有一个prototype属性，是一个对象，它是构造函数的原型，就是由此构造函数创建的实例对象的原型。<br />
::: warning
prototype 是函数独有的属性
:::
```js
  function Animal() {
}
Animal.prototype.name = '动物'
```
构造函数与实力原型关系图
<img :src="$withBase('/imgs/js/proto/1.jpg')" alt=""><br/>

## __proto__
每一个除了null的对象在创建的时候都会与另一个对象进行关联，用来“继承”属性，这个对象就是原型。<br />
为什么继承加了引号？严格来说继承是是复制操作，然后js并不会复制对象，它仅仅是创建了对象域对象之间的关联。

所以根据以上两点可以得出关联
```js
function Animal() {}
Animal.prototype.name = '动物'
const cat = new Animal();
console.log(cat.__proto__ === Animal.prototype) // true
console.log(Animal.prototype.__proto__ === Object.prototype) // true
```
`__proto__`并不是原型中的属性，而是来自于对象的`prototype`属性中
所以实例对象，构造函数，实例原型就有了以下关系
<img :src="$withBase('/imgs/js/proto/2.jpg')" alt=""><br/>

既然实例对象的proto属性指向了，构造函数的prototype，那么`Animal`构造函数和`Function`有什么关系呢？？<br />
`Animal.__proto__ === Function.prototype`
```js
console.log(Animal.__proto__ === Function.prototype) // true
```
这是因为js中所有的函数都是Function的实例，无论是通过何种方式创建函数，js引擎都会执行以下步骤
+ 创建一个新的空对象
+ 将这个对象内部的[[prototype]]也就是proto连接到Function.prototype
+ 将新对象的值赋值给函数的prototype属性
+ 如果这个函数是通过new Function方式创建的，那么还会把Function.prototype赋值给函数的constructor


## constructor
`constructor`是一个特殊属性，存在于每一个对象中上，指向该对象的构造函数，它表明了原型和构造函数之间的关系，如果修改原型对象，须同时修改`constructor`属性，避免错误的发生。
```js
console.log(cat.constructor === Animal.prototype.constructor) // true
console.log(Animal === Animal.prototype.constructor) // true
```
所以
<img :src="$withBase('/imgs/js/proto/3.jpg')" alt=""><br/>
其中实例对象并没有`constructor`属性，但是能读取值还是因为，在实例上面没查到，就去原型上找，原型上有。

## 实例与与原型
```js
function Animal() {}
Animal.prototype.name = '动物'
const dog = new Animal()
console.log(dog.name); // 动物
```
当我们查看`dog`的属性`name`时候，如果找不到就会去`dog`的原型`dog.__proto__`中去寻找，也就是`Animal.prototype`中寻找。
如果依然找不到就回去原型的原型中去寻找，那么原型的原型是什么呢？
## 原型的原型
前面说过原型是一个对象，原型对象就是通过`Object`构造函数生成的，所以综上所述原型的原型指向构造函数的原型
<img :src="$withBase('/imgs/js/proto/4.jpg')" alt=""><br/>
## 原型链
在实例调用一个属性而找不到的时候，就会去实例的原型里面找，如果还找不到就会去原型的原型中寻找，找到`Object.prototype.__proto__`为止，因为`Object.prototype.__proto__ === null`，这种层层相连的结构被称为原型链。
<img :src="$withBase('/imgs/js/proto/5.jpg')" alt=""><br/>
