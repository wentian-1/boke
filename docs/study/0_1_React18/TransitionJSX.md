---
title: 【React18】从0到1搭建一个React18--02 实现jsx
date: 2023-05-25
sidebar: 'auto'
categories:
 - React
tags:
 - React
publish: true
---
## React项目结构
+ react 宿主环境无关的共用方法，比如createElement cloneElement
+ react-reconciler 协调器，与宿主环境无关，整个react核心逻辑
+ 宿主环境的包，比如浏览器react-dom
+ shared 公用的辅助方法和类型定义，宿主环境无关
## JSX转换
由于jsx转换输入react包所以<br>
**在packages中创建react**
**react初始化**
```shell
pnpm init
```
**修改package.json**
```json {4,5}
{
	"name": "react",
	"version": "1.0.0",
	"description": "React公用方法",
	"module": "index.ts",
	"scripts": {
		"test": "echo \"Error: no test specified\" && exit 1"
	},
	"author": "",
	"license": "ISC"
}

```

::: warning
字段对应commonjs规范，是入口文件，我们用的是rollup，是原生支持esm，需要使用module。
:::


::: tip
jsx的转换包括两个部分，一个是编译时，一个是运行时。<br>
+ 编译阶段采用的是babel，由babel自动转换
+ 运行时需要自主实现：
   1. 实现jsx方法
   2. 实现打包流程
   3. 实现调试打包的环境
:::

## 实现jsx方法
### jsxDEV方法(dev环境)
对应开发环境
1. 定义所需的类型<br>
**创建`/packages/shared/`文件夹**在该文件夹下运行`pnpm init`生成package.json文件，修改文件
```json
{
	"name": "shared",
	"version": "1.0.0",
	"description": "所有公用的方法以及类型定义",
	"scripts": {
		"test": "echo \"Error: no test specified\" && exit 1"
	},
	"author": "",
	"license": "ISC"
}

```

**创建`/packages/shared/ReactTypes.ts`文件并定义ReactElement所需要的ts类型**
```ts
export type TRef = any;
export type TProps = any;
export type TKey = any;
export type TElementType = any;
export interface IReactElement {
	$$typeof: symbol | number;
	type: TElementType;
	ref: TRef;
	props: TProps;
	key: TKey;
	__mark: string;
}
```
**创建`/packages/shared/ReactSymbols.ts`文件并定义ReactElement所对应的类型**
```ts
const supperSymbol = typeof Symbol === 'function' && Symbol.for;

export const REACT_ELEMENT_TYPE = supperSymbol
	? Symbol.for('react.element')
	: 0xfc7;

```

2. 创建jsx
### jsx方法
`jsxDEV`对应开发环境, `jsx`对应生产
**创建`/packages/react/src/jsx.ts`**
```ts
import {
	IReactElement,
	TKey,
	TProps,
	TRef,
	TElementType
} from 'shared/ReactTypes';
import { REACT_ELEMENT_TYPE } from 'shared/ReactSymbols';

// jsx或者createElement返回的结果是一个ReactElemt的数组结构
/**
 * 定义ReactElemt
 * @param type 标签类型
 * @param key key
 * @param ref ref
 * @param props props
 */
const ReactElement = function (
	type: TElementType,
	key: TKey,
	ref: TRef,
	props: TProps
): IReactElement {
	const element = {
		// 区分是否是ReactElement的数据结构
		$$typeof: REACT_ELEMENT_TYPE,
		key,
		ref,
		props,
		type,
		__mark: 'yfc' // 区分真实的React
	};
	return element;
};

export const jsx = (type: TElementType, config: any, ...args: any[]) => {
	let key: TKey = null;
	let ref: TRef = null;
	const props: TProps = {};

	for (const prop in config) {
		const element = config[prop];
		if (prop === 'key' && element !== undefined) {
			key = '' + element;
			continue;
		}
		if (prop === 'ref' && element !== undefined) {
			ref = element;
			continue;
		}
		if ({}.hasOwnProperty.call(config, prop)) props[prop] = element;
	}

	const argsLen = args.length;
	if (argsLen) {
		if (argsLen === 1) {
			props.children = args[0];
		} else {
			props.children = args;
		}
	}

	return ReactElement(type, key, ref, props);
};

export const jsxDEV = (type: TElementType, config: any) => {
	let key: TKey = null;
	let ref: TRef = null;
	const props: TProps = {};

	for (const prop in config) {
		const element = config[prop];
		if (prop === 'key' && element !== undefined) {
			key = '' + element;
			continue;
		}
		if (prop === 'ref' && element !== undefined) {
			ref = element;
			continue;
		}
		if ({}.hasOwnProperty.call(config, prop)) props[prop] = element;
	}
	return ReactElement(type, key, ref, props);
};

```

### React.createElement
**创建`/packages/react/index.ts`**
```ts
import { jsxDEV } from './src/jsx';

export default {
	version: '0.0.1',
	createElement: jsxDEV
};

```

