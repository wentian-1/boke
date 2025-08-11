---
title: 记录下日常使用的方式，以免长时间不用忘记
date: 2023-06-29
sidebar: 'auto'
categories:
 - TypeScript
tags:
 - ts
publish: true
---

## 泛型
### type
使用`type`声明一个可以是变量也可以是一个函数的类型<br>
```ts
export type TAction<State> = State | ((prevState: State) => State);
```

## 内置类型
### ReturnType
内置条件类型，用于提取函数的返回值类型
```ts
type ReturnType<T extends (...args: any) => any> = T extends (...args: any) => infer R ? R : any
```
例如：<br>
```ts
type fun = () => string
type funTest = ReturnType<fun> // string


const fun2 = <T>(params: T): { r: T } => {
	const result: ReturnType<typeof fun2> = {
		r: params
	};
	return result;
};

```
