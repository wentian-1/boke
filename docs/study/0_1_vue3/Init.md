---
title: 【Vue3】从0到1搭建一个Vue3--01 搭建框架
date: 2023-05-25
sidebar: 'auto'
categories:
 - React
tags:
 - React
publish: true
---
# 前言

记录下学习Vue3源码的过程

```shell
pnpm i rollup rollup-plugin-typescript2 @rollup/plugin-node-resolve @rollup/plugin-json execa -D -W
```
::: tip
1. `@rollup/plugin-node-resolve` 处理解析第三方插件
2. `@rollup/plugin-json` 处理json
3. `execa` 用来处理多进程的
4. `@rollup-plugin-typescript2` 解析ts
:::


```json
  {
  	"buildOptions": {
  		"name": "VueShared",
  		"formats": [
  			"esm-bundler",
  			"esm-browser",
  			"cjs",
  			"global"
  		]
  	}
  }

```
::: tip
1. `esm-bundler` 用于打包成浏览器可用的 bundle 的基于 ES 模块规范的 Vue 运行时构建。
2. `esm-browser` 基于 ES 模块规范的 Vue 运行时构建，适用于浏览器环境。
3. `cjs` 规范的 Vue 运行时构建，适用于 Node.js 环境
4. `global` 不需要模块化支持的全局引入的 Vue 运行时构建。
:::