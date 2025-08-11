---
title: 闭包
date: 2024-04-08
sidebar: 'auto'
categories:
 - javascript
tags:
 - javascript
publish: true
---
## 闭包
就是一个函数，创建它的上下文已经销毁，但它依然可以访问自由变量。    
通常会出现在以下情况  
::: tip
1、当一个内部函数访问其外部函数的局部变量时候，即使外部函数执行完毕，这些变量仍然会保存到内存中，以便内部函数使用。    
2、当一个函数作为返回值返回，并且在外部函数执行完毕后仍然被调用，这个返回的函数就会形成闭包。    
:::

::: warning
换句话说就是，即使创建它的上下文已经销毁，但它仍然存在且内部使用了自由变量（不是入参，也不是自己内部的局部变量，也不是全局变量）。
:::
## 举个例子
```js
var scope = "global scope";
function checkscope() {
  var scope = "local scope";
  function f() {
    return scope;
  }
  return f;
}
var foo = checkscope();
foo();
```
下面给出详细分析过程
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
3、与此同时`checkscope`函数创建，保存作用域链道内部`[[scope]]`属性
```js
checkscope.[[scope]] = [globalContext.VO]
```
4、执行`checkscope`函数，创建`checkscope`执行上下文，并压入执行上下文栈
```js
ECStack = [checkscopeContext, globalContext]
```
5、初始化`checkscope`函数上下文
  1、复制`[[scope]]`属性作为作用域链
  2、使用`arguments`属性创建活动对象
  3、初始化活动对象，即加入形参，函数声明，变量声明
  4、将活动对象压入作用连的最顶端
```js
checkscopeContext = {
  VO: {
    arguments: {
      length: 0
    },
    scope: undefined,
    f: reference to function f(){}
  },
  Scope: [VO, globalContext.VO],
  this: undefined
}
```
于此同时，函数`f`被创建，保留作用域链到`[[scope]]`属性
```js
f.[[scope]] = [checkscopeContext.VO, globalContext.VO]
```
6、函数`checkscope`执行完毕，其执行上下文从执行上下文栈中弹出
```js
ECStack = [globalContext]
```
7、函数`f`执行，创建`f`函数执行上下文，并压入执行上下文栈
```js
ECStack = [fContext, globalContext]
```
8、初始化`f`函数上下文
  1、复制`[[scope]]`属性为作用域链
  2、根据`arguments`属性创建活动对象
  3、初始化活动对象，即加入形参，函数声明，变量声明
  4、将活动对象添加到作用域链的最顶端
```js
fContext = {
  VO: {
    arguments: {
      length: 0
    }
  },
  Scope: [VO, checkscopeContext.VO, globalContext.VO],
  this: undefined
}
```
9、函数`f`执行完毕，其执行上下文从执行上下文中弹出
```js
ECStack = [globalContext]
```
从上面过程可以看出，`f`函数在执行上下文中维护一个作用域链
::: warning
`fContext.Scope = [VO, checkscopeContext.VO, globalContext.VO]`
:::
就是因为如此，所以在函数`checkscope`执行完毕，其执行上下文销毁后，依然可以访问到`checkscopeContext.AO`的值，它依然存在于内存中，正因为如此，从而实现了闭包的概念。
所以
::: tip
1、即使创建它的上下文已经销毁，它任然存在（比如内部函数从父函数中返回）
2、在内部函数中使用了自由变量
:::

## 例子2
```js
var data = [];
for(var i = 0; i <3; i++) {
  data[i] = function () {
    console.log(i);
  }
}
data[0]();
data[1]();
data[2]();
```
1、执行代码，创建全局执行上下文，并压入栈
```js
ECStack = [globalContext]
```
2、初始化全局上下文
```js
globalContext = {
  VO: {
    data: [function, function, function],
    i: 3
  },
  Scope: [globalContext.AO],
  this: globalContext.AO
}
```
3、初始化全局上下文的同时三个函数被创建，复制作用域链到内部属性`[[scope]]`
```js
data[0]Context.[[scope]] = [globalContext.VO];
data[1]Context.[[scope]] = [globalContext.VO];
data[2]Context.[[scope]] = [globalContext.VO];
```
4、执行函数`data[0]`,创建其执行上下文，并压入执行上下文栈
```js
ECStack = [data[0]Context, globalContext]
```
5、初始化函数`data[0]`执行上下文
```js
data[0]Context = {
  AO: {
    arguments: {
      length: 0
    }
  },
  Scope: [AO, globalContext.AO]
}
```
注意这个时候发现活动对象里面并没有变量`i`，所以顺着作用域链继续查找，发现`globalContext.AO`中`i`=3。
6、函数`data[0]`执行完毕，出栈
```js
ECStack = [globalContext]
```
至于`data[1]`,`data[2]`的分析过程一致，不再赘述。

## 例子3
将上面例子加上闭包
```js
var data = [];
for (var i = 0; i < 3; i++) {
  data[i] = (function(i) {
    return function() {
      console.log(i);
    }
  })(i);
}
data[0]();
data[1]();
data[2]();
```
1、执行代码，创建全局执行上下文，并压入栈
```js
ECStack = [globalContext]
```
2、初始化全局上下文
```js
globalContext = {
  VO: {
    data: [function, function, function],
    i: 3
  },
  Scope: [globalContext.AO],
  this: globalContext.AO
}
```
3、初始化全局上下文的同时三个自执行函数创建，复制作用域链到内部属性`[[scope]]`
```js
匿名函数1Context.[[scope]] = [globalContext.AO]
```
4、执行自执行函数1---data[0],创建其执行上下文，并压入执行上下文栈
```js
ECStack = [自执行函数1Context, globalContext]
```
5、初始化自执行函数的执行上下文
  1、复制`[[scope]]`属性作为作用域链
  2、使用`arguments`属性创建活动对象
  3、初始化活动对象，即加入形参，函数声明，变量声明
  4、将活动对象压入作用连的最顶端
```js
自执行函数1Context = {
  AO : {
    arguments: {
      0: 0,
      length: 1
    },
    i: 0,
    匿名函数: reference to function(){},
    Scope: [AO, globalContext.AO],
    this: undefined
  }
}
```
于此同时，匿名函数创建，复制作用域链到匿名函数的`[[scope]]`属性
```js
匿名函数1Context.[[scope]] = [自执行函数1Context.AO, globalContext.AO]
```
6、自执行函数1执行完毕，弹出上下文
```js
ECStack = [globalContext]
```
7、data[1],data[2]跟上面步骤一样，只不过自执行函数2和自执行函数3的变量对象分别是1和2
8、data[1]执行，创建匿名函数执行下下文，并压入执行上下文栈
```js
ECStack = [匿名函数Context, globalContext]
```
9、初始化匿名函数执行上下文
```js
匿名函数Context = {
  AO: {
    arguments: {
      length: 0
    }
    i: undefined
  },
  Scope: [AO, 自执行函数Context.AO, globalContext.AO],
  this: undefined
}
```
10、根据作用域链查找`i`的值，执行完毕，出栈
```js
ECStack = [globalContext]
```
data[1],data[2]一致     
所以    
::: tip
1、即使创建它的上下文已经销毁，它仍然存在（比如，内部函数从父函数中返回）    
2、在代码中引用了自由变量（不是全局变量，不是内部变量，不是参数）
:::