---
title: Monorepo 的简单搭建
date: 2025-05-07
sidebar: 'auto'
categories:
 - Monorepo
tags:
 - Monorepo
publish: true
---
## 代码管理
代码管理一般可以归为两种分类，一种多仓库模式（MultiRepo），另一种是单体仓库模式（Monorepo）。

### 核心差异
**多仓库模式（MultiRepo）**
每个项目独立维护一个仓库，依赖通过包管理器（如 npm）共享，适用于需要独立开发、部署的小型项目或团队。

**单体仓库模式（Monorepo）**
将多个项目（或模块）存放在同一代码仓库中，共享版本控制、依赖管理和统一工作流。典型应用案例包括 Google、React、Vue 等大型项目。

### 优缺点对比

| 维度 | Monorepo | MultiRepo
| -- | -- | -- | -- |
|代码共享| ✅直接复用同一仓库内的代码，无需发布包，减少重复代码 | ❌需通过 npm 包共享代码，调试和更新流程繁琐，容易产生版本碎片化
|依赖管理| ✅统一管理依赖版本，较少重复安装和版本冲突| ❌需要手动维护夸仓库依赖关系，容易出现版本不一致问题
|协作效率| ✅原子提交，支持跨项目修改，统一CI/CD流程，简化协作| ❌夸仓库需要平凡切换上下文，流程割裂
|构建预测试| ‼️全量构建耗时时间久，需要优化增量构建| ✅独立构建和测试，灵活度高
|规模与性能| ‼️仓库体积过大，会影响Git操作性能需要分仓策略| ✅天然隔离，适合中小型或独立性强的项目

### 使用场景选择
1. Monorepo
  * 高一致性需求：需要统一技术栈、构建流程和代码规范的大型项目，比如企业级中台
  * 高频跨项目协作：多个模块紧密关联，需频繁联调的
  * 工具链复用的：工具函数，共享ESLint，TS等配置，减少构建成本的
2. MultiRepo
  * 独立开发需求：项目耦合度比较低，团队或功能模块相互独立
  * 快速开发场景：新项目需快速启动且独立

## 搭建项目
### 工具选择
工具选择使用pnpm
  1. pnpm是硬链接，可以节省硬盘，以及避免”幽灵依赖“问题
  2. 加快安装速度
  3. 完美支持workspace特性

### 环境准备
如下图所示<br/>
<img :src="$withBase('/imgs/monorepo/1.png')" alt=""><br/>

### 初始化项目
`pnpm init`

### 创建目录及文件
1. 在当前根目录执行如下命令
```shell
mkdir packages && mkdir apps
```
其中`packages`存放自包，比如工具函数以及公共的组件之类，`apps`存放的是应用
2. 再根目录创建`pnpm-workspace.yaml`文件并写入内容
```yaml
packages:
  - 'packages/**'  # 存放公共的包，比如工具函数，组件库
  - 'apps/*' # 存放项目
```
这个文件配置workspaces定义工作空间路径，配合pnpm识别管理多个项目，同时共享依赖。

3. 在`packages`下创建文件夹`vv-utils`存放工具函数。创建函数并初始化
```shell
mkdir packages/vv-utils && cd packages/vv-utils && pnpm init
```
修改`package.json`文件的`name`,`main`的值
```json
{
  "name": "@monorepo-demo/vv-utils",
  "version": "1.0.0",
  "description": "",
  "main": "src/index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "author": "",
  "license": "ISC",
}

```
为`vv-utils`安装`lodash`
```shell
pnpm add lodash --filter @monorepo-demo/vv-utils
```
注意`pnpm add [name] --filter [name2]`
  + 其中name代表的是需要装的依赖名字
  + --filter代表指定在子项目中安装依赖
  + --filter后面还可以这样写 `--filter ./packages/**` 代表在packages下面的所有子项目中安装依赖
  + -w代表所有的项目中安装依赖
  + name2代表的是当前子项目的名字，对应的是子项目下的package.json中的name字段

在`vv-utils`创建`src/copy`，并写入代码
```js
import { cloneDeep } from 'lodash-es'
export const copy = (obj) => {
  return cloneDeep(obj)
}
```
在`vv-utils`创建`src/index`，并写入代码
```js
export { default as copy } from './copy.js'
```
4. 进入到`packages`文件夹下并创建一个react项目，记得全局安装vite
```shell
cd apps && pnpm create vite project --template react
```
修改`project`下面的`package.json`文件中的`name`
```json
{
  "name": "@monorepo-demo/project",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "lint": "eslint .",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^19.1.0",
    "react-dom": "^19.1.0"
  },
  "devDependencies": {
    "@eslint/js": "^9.25.0",
    "@types/react": "^19.1.2",
    "@types/react-dom": "^19.1.2",
    "@vitejs/plugin-react": "^4.4.1",
    "eslint": "^9.25.0",
    "eslint-plugin-react-hooks": "^5.2.0",
    "eslint-plugin-react-refresh": "^0.4.19",
    "globals": "^16.0.0",
    "vite": "^6.3.5"
  }
}

```
5. 将工具包装在新建的项目里
在根目录下执行以下命令
```shell
pnpm add @monorepo-demo/vv-utils --filter @monorepo-demo/project
```
执行完毕后，查看project下面的`package.json`文件的`dependencies`
```json
"dependencies": {
    "@monorepo-demo/vv-utils": "workspace:^1.0.0",
    "react": "^19.1.0",
    "react-dom": "^19.1.0"
  },
```
6. 修改`project`的`src/App.jsx`
```jsx
import { useEffect } from 'react'
import './App.css'
import { copy } from "@monorepo-demo/vv-utils"

function App() {
  useEffect(() => {
    console.log(copy({name: 'monorepo-demo'}))
  }, [])
  return (
   <h1>Monorepo</h1>

  )
}

export default App
```
7. 在根目录下的`package.json`中添加运行命令
```json
"scripts": {
    "dev": "pnpm --filter @monorepo-demo/project dev",
    "build": "pnpm --filter @monorepo-demo/project build"
  },
```
8. 运行`pnpm dev`打开链接，然后打开控制台，就会在console里面看到输出
如下图所示<br/>
<img :src="$withBase('/imgs/monorepo/2.png')" alt=""><br/>

至此Monorepo的配置完成
