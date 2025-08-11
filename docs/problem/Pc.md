---
title: Pc端遇到的问题
date: 2023-03-23
sidebar: 'auto'
categories:
 - 问题记录
tags:
 - JavaScript
publish: true
---
## vue3 修改了reactive包括对象的某个属性值是数组的整个值 页面不响应
**错误例子**
```js
import { reactive, toRefs } from 'vue'
const state = reactive({
  tabs: ['a', 'b', 'c']
})
state.tabs = ['x', 'y', 'z']
```
在Vue 3中使用响应式时，它会创建一个响应式代理对象，用于跟踪对象属性的更改。但是，当您重新分配整个数组时，代理不再跟踪更改，因为对数组的引用已经更改，代理不再有办法知道数组何时更改。
为了解决这个问题，您可以使用Vue 3中的toRefs函数来创建对数组本身的响应式引用。这将允许对数组的更改进行跟踪，并相应地更新UI。
**正确例子**
```js
import { reactive, toRefs } from 'vue'
const state = reactive({
  tabs: ['a', 'b', 'c']
})
const tabsRef = toRefs(state).tabs
tabsRef.value = ['x', 'y', 'z']
```
通过使用toRefs，您可以获得对tab数组的响应性引用，对数组的更改将被跟踪并触发对UI的更新。请注意，value属性必须用于访问实际数组，因为toRefs返回一个以属性名称为键的对象，并且实际值存储在每个键的value属性下。
## 解决项目配置完别名后比如`@middlewares/exception`在vscode中不能使用command+鼠标左键找到源码问题
**例子package.json**
```json
	"_moduleAliases": {
		"@root": ".",
		"@controller": "controller",
		"@config": "config",
		"@middlewares": "middlewares",
		"@services": "services",
		"@models": "models",
		"@routers": "routers",
		"@sequelize": "sequelize",
		"@utils": "utils"
	},
```
**在根目录新建jsconfig.json**
```json
{ 
  "compilerOptions": { 
    "baseUrl": ".", 
    "paths": { 
      "@middlewares/*": ["middlewares/*"], 
      "@utils/*": ["utils/*"],
      
    }, 
    "experimentalDecorators": true 
  }, 
  "resolveExtensions": [".js", ".vue", ".ts"], 
  "exclude": [ 
    "node_modules", 
    "**/node_modules/*" 
  ] 
}
```
**文件中引用的**
```js
const { error } = require('@utils/log');
const exception = require('@middlewares/exception');
```

## vuex或者redux，使用vite或者webpack在分模块组合module时的不同
以redux为例
目录结构
```
├── index.js
├── modules
│   ├── permission.js
│   ├── user.js
│   └── test.js
**vite方式**
```js
<!-- index.js -->
import { configureStore } from "@reduxjs/toolkit";

const files = import.meta.globEager("./modules/*.js");
const reducer = {};

Object.keys(files).forEach((key) => {
	reducer[key.replace(/(\.\/|\.js)/g, "").replace("modules/", "")] =
		files[key].default;
});

export default configureStore({
	reducer,
});

```
**webpack方式**
```js
// index.js
import { configureStore } from "@reduxjs/toolkit";
import { createRequire } from "module"; 
const files = require.context("./modules", false, /\.js$/);
const reducer = {};
files.keys().forEach((key) => {
	reducer[key.replace(/(\.\/|\.js)/g, "").replace("modules/", "")] =
		files(key).default;
});
export default configureStore({
	reducer,
})
```