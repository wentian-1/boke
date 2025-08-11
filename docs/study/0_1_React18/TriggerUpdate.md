---
title: 【React18】从0到1搭建一个React18--04 触发更新
date: 2023-05-25
sidebar: 'auto'
categories:
 - React
tags:
 - React
publish: true
---

## 更新方式

在react中常见的出发更新方式<br>
:::tip
1. **ReactDom.crateRoot().render**
首屏渲染的更新方法
2. **this.setState**
在类组件中出发更新的方法
3. **useState的dispatch**
在函数式组件中更新的方法
:::

## 更新组成