---
title: VueRouter4系列学习
date: 2023-03-28
sidebar: 'auto'
categories:
 - Vue3
tags:
 - vue3
 - vue-router
publish: true
---
[官网](https://router.vuejs.org/zh/introduction.html)
::: warning
+ 下面所有demo基于
+ node 14.19
+ vite
+ pnpm
+ vue3
:::
## 初始化项目
```shell
pnpm create vite vue-router-demo --template vue
```
### 安装vue-router@4
``` shell
pnpm add vue-router@4
```
### 准备工作
+ 在src下创建router/index.js文件

+ 在src创建pages文件夹并创建以下文件
**Layout/index.vue**
```js
<template>
  <h1>Layout</h1>
  <router-view />
</template>
```
**Home/index.vue**
```js
<template>
  <h1>Home</h1>
</template>
```
**User/index.vue**
```js
<template>
  <h1>User</h1>
</template>
```
**About/index.vue**
```js
<template>
  <h1>About</h1>
</template>
```
### 配置路由
+ 在router/index引入vue-router
```js
import * as VueRouter from 'vue-router';
```
+ 引入组件和vue的异步加载组件的方法
```js
import { defineAsyncComponent } from 'vue';
import Layout from '../pages/Layout/index.vue';

function getComponent(name) {
  return defineAsyncComponent(() => import(`../pages/${name}/index.vue`));
}
const Home = getComponent('Home');
const About = getComponent('About');
const User = getComponent('User');
```
::: warning
**defineAsyncComponent**是vue的异步加载组件的方法，一般在vite中路由懒加载还需配合**import.meta.glob**使用
:::
+ 定义路由
```js
const routers = [
  {
      path: '/', component: Home
	},
	{
		path: '/about', component: About
	},
	{
		path: '/user/:id', component: User
	}
]
```
+ 创建路由实例并导出
```js
const router = VueRouter.createRouter({
  history: VueRouter.createWebHashHistory(),
  routes: routers
});

export default router;
```
+ 在App.vue中添加`<router-view />`
::: warning
`<router-view />`更像是一个标记，标记与url对应的组件展示的出口，这个标签可以放在任何位置，便于布局和做路由嵌套
:::
```js
<template>
	<router-link to="/">Home</router-link>
	<br>
	<router-link to="/about">about</router-link>
	<router-view />
</template>
```
+ 在main.js中引入router并使用
```js {4,6}
import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'

createApp(App).use(router).mount('#app')
```
+ 启动项目 看到Home 完成

### hash 和 history 模式的区别
**hash模式**<br>
指地址栏中带/#/样式的地址模式，#以及后面的字符称为散列值，也叫锚点，本身是用来做页面定位跳转的。vue是单页面应用，默认就是hash模式比如https://abc.dtxy.xyz/boke/study/Vue3CustomHook.html#%E7%BB%84%E5%90%88%E5%BC%8F%E5%87%BD%E6%95%B0-2 <br>
主要通过**window.locaion.hash**属性和**onhashchange**方法来实现路由功能<br>
**history模式**<br>
hash原本就是做页面定位的，并且hash传参是基于url的，如果传递复杂数据，会有体积限制，并且/#/看起来很丑。<br>
history不但可以通过url传参还可以根据特定的对象传递参数。<br>
[属性及方法](https://developer.mozilla.org/zh-CN/docs/Web/API/History_API)

## 基本使用
### 路由匹配
**语法** <br>
`/user/:id` => `/user/2` <br>
`/user/:id/detail/:did` => `/user/2/detail/2`
+ 修改App.vue
```js

```
+ 修改router/index.js
```js
import * as VueRouter from 'vue-router';
import Layout from '../pages/Layout/index.vue';

function getComponent(name) {
  return () => import(`../pages/${name}/index.vue`);
}
const Home = getComponent('Home');
const About = getComponent('About');
const User = getComponent('User');

const routers = [
  {
    path: '/', component: Home
  },
  {
    path: '/about', component: About
  },
  {
    path: '/user/:id', component: User
  },
  {
    path: '/user/:id/detail/:did', component: User
  }
]

const router = VueRouter.createRouter({
  history: VueRouter.createWebHashHistory(),
  routes: routers
});

export default router;
```
+ 修改App.vue
```js
<template>
  <router-link to="/">Home</router-link>
  <br>
  <router-link to="/about">about</router-link>
  <br>
  <router-link to="/user/2">user</router-link>
  <br>
  <router-link to="/user/2/detail/2">user</router-link>
  <router-view />
</template>
```

+ 修改User/index.vue
```js
<template>
  <h1>User</h1>
  <div v-if="params">
    <p>用户id: {{ params.id }}</p>
    <p v-if="params.did">详情id: {{ params.did }}</p>
  </div>
</template>

<script setup>
import { toRefs } from "vue";
import { useRoute } from "vue-router";
let { params } = toRefs(useRoute());
</script>
```
+ 打开浏览器点击user<br>
<img :src="$withBase('/imgs/vuerouter/user.jpg')" alt="user">
+ 点击userDetail <br>
<img :src="$withBase('/imgs/vuerouter/userDetail.jpg')" alt="user">
::: warning
+ `/user/:id` => `/user/2` 只能匹配/user/`任何`，像/user/2/2这种无法匹配
+ `/user/:id/detail/:did` => `/user/2/detail/2`，同理只能匹配/user/`任何`/detail/`任何`
:::

#### 匹配多部分路由
**语法**
`/use/:id*/detail/:did+`
+ 修改router/index.js
```js
{
	path: '/user/:id/detail/:did', component: User
}
=>
{
	path: '/user/:id*/detail/:did+', component: User
}
```
+ 更改地址为[http://127.0.0.1:5174/#/user/detail/2](http://127.0.0.1:5174/#/user/detail/2)
<img :src="$withBase('/imgs/vuerouter/userDetail2.jpg')" alt="user">
+ 更改地址为[http://127.0.0.1:5174/#/user/2/2/detail/2/2](http://127.0.0.1:5174/#/user/2/2/detail/2/2)
<img :src="$withBase('/imgs/vuerouter/userDetail3.jpg')" alt="user">
::: warning
+ 由此可见* 匹配的是0或者多个
+ +匹配的是1或者多个
:::
#### 可选参数
**语法**
`/user/:id?`
+ 修改router/index.js
```js
{
	path: '/user/:id', component: User
},
=>
{
	path: '/user/:id?', component: User
},
```
+ 更改地址为[http://127.0.0.1:5174/#/user](http://127.0.0.1:5174/#/user)
<img :src="$withBase('/imgs/vuerouter/user2.jpg')" alt="user">
+ 更改地址为[http://127.0.0.1:5174/#/user/2](http://127.0.0.1:5174/#/user/2)
<img :src="$withBase('/imgs/vuerouter/user3.jpg')" alt="user">
::: warning
+ 由此可见? 代表可选，匹配的是1个或者0个 /user/2/2 则匹配不到
+ * 在某些意义上也代表可选 但是*表示的事0个或者多个
+ 注意使用useRoute获取到的参数值？是单个字符串，* 是字符串数组
:::
#### 正则匹配
**语法**
`/user/:id(正则)`
+ 修改router/index.js
```js
{
	path: '/user/:id?', component: User
},
=>
{
	path: '/user/:id(\\d+)', component: User
},
```
+ 更改地址为[http://127.0.0.1:5174/#/user/detail](http://127.0.0.1:5174/#/user/detail)
<img :src="$withBase('/imgs/vuerouter/userRule1.jpg')" alt="user">
+ 更改地址为[http://127.0.0.1:5174/#/user/2](http://127.0.0.1:5174/#/user/2)
<img :src="$withBase('/imgs/vuerouter/userRule2.jpg')" alt="user">
### 命名路由
`<router-link to="/user/2">User</router-link>`这里面的to不仅可以传递字符串还可以传递v-bind的js表达式<br>
比如`<router-link :to="{ path: '/user', query: { id: '2'}}">User</router-link>`此时url会变成[http://127.0.0.1:5174/#/user?id=2](http://127.0.0.1:5174/#/user?id=2)，query的值在`useRoute().query`里面<br>
还有一种方式`<router-link :to="{ name: About, params: { id: '2'}}">About</router-link>`
+ 修改App.vue 添加以下代码
```js
<br>
<router-link :to="{ name: 'About', query: { username: 'erina' }}">About</router-link>
```
+ 修改router/index.js
```js
{
	path: '/about', component: About,
},
=>
{
	path: '/about/:username', component: About, name: 'About'
},
```
+ 修改About/index.vue
```js
<template>
  <h1>About</h1>
  <div>
    {{ params }}
  </div>
</template>

<script setup>
import { toRefs } from "vue";
import { useRoute } from "vue-router";
let { params } = toRefs(useRoute());
</script>
```
点击新加的About，路由地址变为[http://127.0.0.1:5174/#/about/erina](http://127.0.0.1:5174/#/about/erina)
<img :src="$withBase('/imgs/vuerouter/about.jpg')" alt="about">
::: warning
+ 使用明明是路由必须在router给每个路由起一个名字，并且还需定义path，使用时候也是`<router-link :to="{ name: 'About', query: { username: 'erina' }}">About</router-link>`
+ 如果router/index.js中定义的/about/:username路由只是/about，此时则不能使用params，换句话说就是使用params的时候，对象里面的属性必须是在router中path中定义的:名字，他们之间是一一对应关系。
+ 如果不想定义还想传参的话需使用`<router-link :to="{ name: 'About', state: { username: 'erina' }}">About</router-link>`数据将会在`useRouter().options.history.state`中获取到。[官方解释](https://github.com/vuejs/router/blob/main/packages/router/CHANGELOG.md#414-2022-08-22)
:::
### 路由嵌套
一些程序中，页面是由嵌套的构成的，比如管理系统中常见的布局结构，此时就用上了路由嵌套。
+ 首先在根节点中App.vue中添加顶层的`<router-view></router-view>`渲染路由匹配的组件
+ 在公共布局组件中建立`<router-view></router-view>`，用来嵌套渲染在此布局下的组件<br>
**Layout/index.vue**
```js
<template>
  <h1>Layout布局组件</h1>
  <router-view />
</template>
```
+ 修改router/index.js，为了适配嵌套关系，添加以下代码
```js
{
	path: '/layout',
	component: Layout,
	children: [
		{
			path: 'user',
			component: User,
			name: 'layoutUser'
		},
		{
			path: 'about',
			component: About,
			name: 'layoutAbout'
		}
	]
}
```
+ 修改App.vue，添加一下代码
```js
<router-link to="/layout/about">About</router-link>
<br>
<router-link :to="{ name: 'layoutUser' }">user</router-link>
<router-view />
```
+ 点击ABout
<img :src="$withBase('/imgs/vuerouter/about2.jpg')" alt="about">
+ 点击User<br>
<img :src="$withBase('/imgs/vuerouter/user4.jpg')" alt="user">
### 命名视图
同级路由也可以展示多个视图，而不是嵌套显示，比如layout路由下一次加载侧边，头部等路由
+ 新增Layout/header.vue
```js
<template>
  <h2>Header</h2>
</template>
```
+ 新增Layout/side.vue
```js
<template>
  <h2>Side</h2>
</template>
```
+ 修改Layout/index.vue
```js
<template>
  <h1>Layout布局组件</h1>
</template>
```
+ 修改router/index.js，添加以下代码
```js
<router-link to="/layout">About</router-link>
<router-view name="Header"/>
<router-view name="Side"/>
<router-view />
```
+ 修改router/index.js，添加以下代码
```js
{
	path: '/layout',
	components: {
		default: Layout,
		Header,
		Side
	},
		{
			path: 'about',
			component: About,
			name: 'layoutAbout'
		}
	]
}
```
+ 点击 About
<img :src="$withBase('/imgs/vuerouter/layout.jpg')" alt="layout">
**创建布局的时候大概率需要不同的单元组成，比如侧边栏，头部，底栏，这个时候就需要命名视图了，在一个路由里面加载多个视图。还有些不需要布局的组件，比如登录，注册，404等页面，这个时候就需要用到嵌套命名视图了。**
+ 修改Layout/index.vue
```js
<template>
	<h1>Layout布局组件</h1>
	<router-view />
</template>
```
+ 修改App.vue 添加一下代码
```js
<router-link to="/">Home</router-link>
<br>
<router-link to="/layout">layout</router-link>
<br>
<router-link to="/layout/about">layoutAbout</router-link>
<br>
<router-view name="Header"/>
<router-view name="Side"/>
<router-view />
```
+ 修改router/index.js，添加以下代码
```js
{
	path: '/', component: Home,
},
{
	path: '/layout',
	redirect: '/layout/about',
	components: {
		default: Layout,
		Header,
		Side
	},
	children: [
		{
			path: 'about', component: About,
			
		}
	]
},
```
+ 点击layout或者layoutAbout
<img :src="$withBase('/imgs/vuerouter/layout2.jpg')" alt="layout">
**大多时候我们不希望在App里面增加布局**
+ 修改App.vue
```js
<router-link to="/home">Home</router-link>
<br>
<router-link to="/layout/about">layoutAbout</router-link>
<br>
<router-view />
```
+ 新建Layout/layout.vue
```js
<template>
  <h1>Layout布局组件</h1>
  <router-view name="Header"/>
  <router-view name="Side"/>
  <router-view />
</template>
```
+ 修改Layout/index.vue
```js
<template>
  <router-view />
</template>
```
+ 修改router/index.js
```js
{
	path: '/', component: Layout2,
	children: [
		{
			path: 'layout',
			components: {
				default: Layout,
				Header,
				Side
			},
			children: [
				{
					path: 'about', component: About,

				}
			]
		}
	]
},
{
	path: '/home', component: Home,
},
```
+ 点击layoutAbout
<img :src="$withBase('/imgs/vuerouter/layout3.jpg')" alt="layout">


