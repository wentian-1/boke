---
title: Js执行上下文
date: 2023-08-29
sidebar: 'auto'
categories:
 - javascript
tags:
 - javascript
publish: true
---
## 执行上下文
在js中，执行上下文是一个抽象的概念，它定义了变量或者函数的执行环境。每当代码执行时候，它都会创建一个执行上下文。
### 组成
每个执行上下文都包含三个重要的属性
+ 变量对象(Variable VO)
+ 作用域链(Scope chain)
+ this
### 创建过程
#### 全局上下文
当js开始执行时候，首先创建全局执行上下文，这个上下文的变量对象包含全局的变量和函数声明。简而言之就是全局对象    
1、可以通过this引用
```js
console.log(this) // Window
```
2、预定义了很多属性和方法
```js
console.log(Math.random())
```
3、作为全局变量的宿主
```js
var a = 10;
console.log(window.a) // 10
```
4、客户端环境中，全局对象的window指向自己（Node中指向的global）
```js
var a = 10;
console.log(this.window.a) // 10
```
#### 函数上下文
当一个函数被调用，js引擎会创建一个函数执行上下文，这个上下文的VO，包含函数的参数，局部变量和`arguments`对象。  

### 生命周期
执行上下文的生命周期包含创建、执行和销毁的三个阶段。    
1、创建：创建变量对象，建立作用域链，确定this的指向     
2、执行：变量对象变成活动对象，完成赋值和函数引用，执行代码     
3、销毁：执行上下文出栈，内存等待被回收
<img :src="$withBase('/imgs/js/excute/1.jpg')" alt=""><br/>

### 变量对象
在我们写代码时候会创建很多变量和对象，解释器在拿到js代码后首先找到变量和函数的定义，然后执行上下文创建的时候生成变量对象。      
以函数为例
当代用某个函数时，这个函数会进入函数调用栈，此时处于栈的顶端，会先进入执行上下文的创建阶段，包含三个部分。

1、创建函数的`arguments`对象，检查当前上下文中的参数，建立该对象下的属性和属性值，没有实参的话，属性值为`undefined`    
2、检查这个函数内部所有的`function`关键字的函数声明，然后根据函数名字创建一个属性名，该属性指向该函数在内存地址的引用，如果该函数名已经在存，则会被新的引用覆盖。    
3、检查这个函数内部的所有变量声明，然后根据变量名创建一个属性名，属性值为`undefined`，如果变量名称跟已经声明的形式参数或函数相同，则变量声明不会影响已经存在的这类属性。
<img :src="$withBase('/imgs/js/excute/2.jpg')" alt=""><br/>
从数据接口上来看VO
<img :src="$withBase('/imgs/js/excute/3.jpg')" alt=""><br/>
举个例子
```js
  function fun() {
  var v1 = 1;
  var v2 = 2;

  function f1() {}

  function f2() {}

  function v2() {}
  v1 = 3;
}
fun(4)
```
在进入执行上下文中，这时候AO是：
```js
AO = {
  arguments: {
    0: 4,
    length: 1
  },
  f1: reference to function f1(){},
  f2: reference to function f2(){},
  v1: undefined,
  v2: reference to function v2(){},
}
```
在代码执行阶段，会顺序执行代码，根据代码，修改变量对象的值    
这个时候的AO
```js
AO = {
  arguments: {
    0: 4,
    length: 1
  },
  f1: reference to function f1(){},
  f2: reference to function f2(){},
  v1: 1,
  v2: reference to function v2(){},
}
```
### 活动对象
以函数环境为例子，在进入执行阶段之前，变量对象中的属性都不可以访问，进入执行阶段后，变量对象变成活动对象，里面的属性都能被访问，然后执行代码，所以活动对象是变量对象的另一种形式，本质上是一个，只是在不同生命周期的不同表达。

### 作用域链
当查找变量时候会从当前上下文中查找，如果没有找到，就会从词法层面的父级执行上下文的变量中查找，直接找到全局上下文变量对象，也就是全局对象，这种多个执行上下文变量对象形成的链表就是作用域链。

#### 函数创建
函数的作用域在函数定义的时候就已经创建好了，这是因为函数内部拥有一个[[scope]]属性，当函数创建时候后，会保存所有的父变量对象到其中，可以理解为[[scope]]就是所有父级变量对象的层级连，但不代表是完整的作用域链！    
举个例子
```js
function fun() {
  function child() {
  }
}
```
函数创建时各自的[[scope]]
```js
fun.[[scope]] = [
  globalContext.VO
]
child.[[scope]] = [
  funContext.VO,
  globalContext.VO,
]
```
#### 函数激活
当函数激活时，进入函数上下文，创建VO/AO后，就会将活动对象添加到作用域的前端。这个时候执行上下文的作用域链`Scope=[AO].concat([[scope]])`
举个例子
```js
var v = "global scope"
function f() {
  var v2 = 'local scope'
  return v2;
}
f()
```
执行过程如下：
1、`f`函数被创建，保存作用域链到内部`[[scope]]`属性

```js
f.[[scope]] = [
  globalContext.VO
]
```
2、执行`f`函数，创建`f`函数的执行上下文，`f`函数的执行上下文被压入执行上下文栈
```js
ECStack = [
  fContext,
  golbalContext
]
```
3、`f`函数不会立刻执行，首先开始准备工作，复制函数`[[scope]]`属性创建作用域链
```js
fContext = {
  Scope: f.[[scope]]
}
```
4、第二步：用arguments创建变量对象，随后初始化活动对象，加入形参，函数声明，变量声明
```js
fContext = {
  AO: {
    arguments: {
      length: 0
    },
    v2: undefined
  },
  Scope: f.[[scope]]
}
```
5、第三步：将活动对象压入`f`的作用域链顶端
```js
fContext = {
  AO: {
    arguments: {
      length: 0
    },
    v2: undefined
  },
  Scope: [AO, Scope]
}
```

6、开始执行函数，修改AO的属性值
```js
fContext = {
  AO: {
    arguments: {
      length: 0
    },
    v2: 'local scope'
  },
  Scope: [AO, Scope]
}
```
7、查找`v2`的值，返回后函数执行完毕，函数上下文从执行上下文栈中弹出
```js
ECStack = [
  globalContext
]
```
### 全过程

#### 例子1
```js
var scope = 'global scope';
function checkscope() {
  var scope = 'local scope';
  function f() {
    return scope;
  }
  return f();
}
checkscope();
```
1、执行全局代码，创建全局上下文，全局上下文被压入执行上下文栈
```js
ECStack = [globalConetxt];
```
2、初始化全局上下文
```js
globalContext = {
  VO: [global],
  scope: [globalContext.VO],
  this: globalContext.VO
}
```
初始化的同时，函数`checkscope`被创建，保存作用域到`checkscope.[[scope]]`属性中
```js
checkscope.[[scope]]=[globalContext.VO]
```
3、执行`checkscope`函数，创建函数执行上下文，然后压入上下文执行栈
```js
ECStack = [
  checkscopeContext,
  globalContext
]
```
4、初始化`checkscope`函数上下文     
  1、复制`[[scope]]`属性，创建作用域链    
  2、创建活动对象    
  3、初始化活动对象，加入形参，函数声明，变量声明     
  4、将活动对象压入`checkscope`作用域链的顶端    
同时`f`函数被创建，保存作用域到`f`函数的内部属性`[[scope]]`
```js
checkscopeContext = {
  AO: {
    argiments: {
      length: 0
    },
    scope: undefined,
    f: reference to function f(){}
  },
  Scope: [AO, globalContext.VO],
  this: undefined
}
```
5、`f`函数执行，创建`f`函数执行上下文，并压入执行上下文栈
```js
ECStack = [
  fContext,
  checkscopeContext,
  globalContext
]
```
6、`f`函数初始化上下文    
 1、复制`[[scope]]`属性确定作用域链    
 2、用arguments创建活动对象    
 3、初始化活动对象，形参，函数声明，变量声明    
 4、将活动对象压入`f`作用域顶端    
```js
fContext = {
  VO: {
    arguments: {
      length: 0
    }
  },
  Scope: [AO, checkscopeContext.AO, globalContext.AO],
  this: undefined
}
```
7、函数`f`执行，沿着作用域链查找`scope`值，返回`scope`值    
8、函数`f`执行完毕，`f`执行上下文从执行上下文栈中弹出
```js
ECStack = [
  checkscopeContext,
  globalContext
]
```
9、函数`checkscope`执行完毕，`checkscope`执行上下文从执行上下文栈中弹出
```js
ECStack = [
  globalContext
]
```
#### 例子2
```js
var scope = 'global scope';
function checkscope() {
  var scope = 'local scope';
  function f() {
    return scope;
  }
}
checkscope();
```
1、执行代码，创建全局上下文，并压入执行上下文栈
```js
ECStack = [globalContext]
```
2、初始化全局上下文
```js
globalContext = {
  VO: [global],
  Scope: [globalContext.VO],
  this: globalContext.VO
}
```
同时，函数`checkscope`创建，保存作用域到函数内部属性`[[scope]]`
```js
checkscope.[[scope]] = [globalContext.VO]
```
3、执行`checkscope`函数，创建函数上下文，并压入执行上下文栈
```js
ECStack = [
  checkscopeContext,
  globalContext
]
```
4、初始化函数`checkscope`上下文
  1、复制`[[scope]]`属性，确定作用域链
  2、根据`arguments`创建活动对象
  3、初始化活动对象，即加入形参，函数声明，变量声明
  4、将活动对象压入`checkscope`作用域链的顶端

```js
checkscopeContext = {
  VO: {
    arguments: {
      length: 0
    },
    scope: undefined,
    f: reference to function f()
  },
  Scope: [AO, globalContext.AO],
  this: undefined
}
```
与此同时`f`函数创建，保存作用域到`[[scope]]`属性
```js
f.[[scope]] = [checkscopeContext.AO, globalContext.AO]
```
5、`checkscope`函数执行完毕，从执行上下文中出栈
```js
ECStack=[
  globalContext
]
```
6、`f`函数执行，创建`f`执行上下文，且入栈
```js
ECStack=[
  fContext,
  globalContext
]
```
7、`f`函数执行上下文初始化
  1、复制`[[scope]]`属性，确定作用域链     
  2、根据`arguments`参数，创建活动对象    
  3、初始化活动对象，即加入形参，函数声明，变量声明    
  4、将活动对象添加到`f`作用域链的最顶端    
```js
fContext = {
  AO: {
    arguments: {
      length: 0
    }
  },
  Scope: [AO, checkscopeContext.AO, globalContext.AO],
  this: undefined
}
```
8、`f`函数执行，沿着作用域查找`scope`的值    
9、`f`函数执行完毕，从执行上下文栈中弹出
```js
ECStack = [globalContext]
```
