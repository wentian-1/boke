---
title: Vue3 自定义hook
date: 2023-03-28
sidebar: 'auto'
categories:
 - 框架
tags:
 - vue3
publish: true
---
## 组合式函数
组合式函数是一个利用Vue组合式Api来封装和复用的有状态逻辑函数。就是利用Vue的组合式Api结合业务逻辑，取出相似的功能进行函数封装，并根据传入的参数进行响应式处理并返回。注意，并非是纯函数，纯函数一再强调在执行过程不会产生副作用，而组合式函数是有状态逻辑的函数
## 为什么要用组合式函数
### 传统Mixin的短板
::: danger
+ 不清晰数据的来源，当多个mixin时，当前实例的属性的来源于哪个mixin变得不清晰，追溯和理解变得困难
+ 命名空间冲突，多个mixin可能会有相同的属性名，造成冲突
+ 隐式的跨mixin交流，多个mixin需要依赖共享的属性名来进行相互作用
+ [和Mixin的对比](https://cn.vuejs.org/guide/reusability/composables.html#comparisons-with-other-techniques)
:::
### 组合式函数
::: warning
+ 更好的逻辑复用，本质就是一个函数，可以通过组合各种函数来实现更加高效简洁的复用
+ 更灵活的代码组织，相对于配置式的只能写在method中，组合式可以把功能相近的代码写在一起，或者是把其抽出放在一个外部文件中
+ 更好的类型推导，组合式API主要利用最基本的变量和函数，所以更好的享受完整的类型指导
+ 更小的代码体积
+ [why](https://cn.vuejs.org/guide/extras/composition-api-faq.html#what-is-composition-api)
:::
### 分页封装为hook的例子
+ demo/index.vue
```js
<template>
  <ul>
    <li v-for="(item, index) in result.list" :key="index">{{ item }}</li>
  </ul>
  <p>
    <button @click="prePage">上一页</button>
    <span>当前页：{{ searchParams.pageIndex }}</span>
    <button @click="nextPage">下一页</button>
    <select v-model="searchParams.pageSize">
      <option :value="10">10</option>
      <option :value="20">20</option>
      <option :value="30">30</option>
      <option :value="40">40</option>
    </select>
  </p>
  <Teleport to="body">
    <div v-if="result.loading" class="modal">
      <p>加载中...</p>
    </div>
  </Teleport>
</template>
<script setup>
import { reactive } from "vue";
import useList from "./useLIst";
const axios = (params) =>
  new Promise((resolve, reject) => {
    let pageIndex = params.pageIndex;
    let pageSize = params.pageSize;
    setTimeout(() => {
      let arr = new Array(pageSize).fill(0).map((item, index) => {
        return (pageIndex - 1) * pageSize + index + 1;
      });
      resolve(arr);
    }, 2000);
  });

let searchParams = reactive({
  pageSize: 10,
  pageIndex: 1
});

let { result } = useList(axios, searchParams);

const prePage = () => {
  if (searchParams.pageIndex > 1) {
    searchParams.pageIndex -= 1;
  }
};
const nextPage = () => {
  searchParams.pageIndex += 1;
};
</script>
```
+ useList.js
```js
import { reactive, isReactive, watchEffect } from "vue";

export default function useList(callback, params) {
  let result = reactive({
    list: [],
    loading: true
  })

  function doFetch() {
    result.loading = true;
    callback(params).then(res => {
      result.list = res;
      result.loading = false;
    }, err => {
      result.loading = false;
    })
  }
  if (isReactive(params)) {
    watchEffect(doFetch)
  }

  return {
    result
  }
}
```
