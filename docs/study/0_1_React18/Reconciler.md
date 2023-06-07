---
title: 【React18】从0到1搭建一个React18--03 Reconciler--协调器
date: 2023-06-06
sidebar: 'auto'
categories:
 - React
tags:
 - React
publish: true
---

## 前言
Reconciler是React的核心逻辑模块，它负责协调，生成Fiber树（React中的虚拟DOM）、协调和调度、产生操作指令。
## 考古
在以前JQ统治的时期，前端想要渲染数据需要使用JQ调用各种方法来出发浏览器的绘制进而渲染。属于过程驱动<br>
<img :src="$withBase('/imgs/0_1_React18/Reconciler_JQ.jpg')" alt="eslint">
## 后来者
随着前端框架的流行，渲染视图也不再是之前的过程驱动，而变成了状态驱动，最具代表性的莫过于vue和react。
<img :src="$withBase('/imgs/0_1_React18/Reconclier_VR.jpg')" alt="eslint">
他们两者都不直接操作dom了，而是选择使用描述UI的方法，react采用了jsx，vue使用了模板语法。<br>
他们都不在直接调用宿主环境的API了，而是运行时的核心模块来调用宿主环境的API来更改页面。<br>
react不支持模板语法，没有编译优化，是一个纯运行时的js库，而vue是有编译优化的是一个前端框架。

## 消费jsx的过程
### ReactElement类型
ReactElement是react中的一种数据结构，是React.createElemet的返回的一个简单的对象。只能表达某个ReactElement中有哪些数据，并不能表达两个ReactElement之间的关系。

:::tip
缺点：
  1. 无法表达节点之间的关系
  2. 无法表达状态
:::

### fiberNode
::: tip
  1. 介于ReactElement和真实dom之间
  2. 能够表达节点之间的关系
  3. 不仅能作为数组存储单元，也能作为工作单元
:::