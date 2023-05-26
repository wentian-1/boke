---
title: 【React18】从0到1搭建一个React18
date: 2023-05-25
sidebar: 'auto'
categories:
 - React
tags:
 - React
publish: true
---
# 前言
记录下学习React18源码的过程
## 风格选择
mono-repo和multi-repo是两种不同的代码组织结构。mono-repo（单存储库）是将所有代码和组件存储在一个巨大的代码库中的方法，而multi-repo（多存储库）是将所有代码和组件存储在多个小的代码库中的方法。

### mono-repo
**特点**：统一用一个仓库管理所有的项目<br />
**优点**：方便统一操作各个项目，可以方便的追踪项目之前的依赖关系<br />
**缺点**: 代码库越来越大，失去部分灵活性，强依赖mono-repo的管理工具，复杂度变大，维护难度也变大<br />

### multi-repo
**特点**：每个项目都用一个git仓库托管，大多数工程其实都是以multi-repo方式管理的<br />
**优点**：复杂度低，可以灵活的定制自己的workflow<br />
**缺点**：难以追踪项目之前的依赖关系<br />

## pnpm初始化
```shell
npm install pnpm -g
pnpm init
```
初始化mono-repo相关配置，在根目录下创建 [pnpm-workspace.yaml](https://www.pnpm.cn/pnpm-workspace_yaml)
```yaml
packages:
# 表示packages下面的直接子级就是一个个项目
  - 'packages/*'
```
## 定制开发规范
### lint
**安装eslint**
```shell
pnpm i eslint -D -w
```

::: warning
其中-D是代表--dev，这个项目是mono-repo，意味着同一项目下有很多子项目，子项目有各自的git和package.json。开发规范是集体的，所以-w就代表安装到根目录下的package.json中
:::

**初始化**
```shell
npx eslint --init -w
```
<img :src="$withBase('/imgs/0_1_React18/eslint.jpg')" alt="eslint">
<img :src="$withBase('/imgs/0_1_React18/missing_peer.jpg')" alt="missing_peer">
这是因为"missing peer"意味着您安装的某个依赖项需要其他某些依赖项，但您没有安装这些依赖项。这通常是由于版本不兼容或缺失的依赖项造成的。您需要安装所需的所有依赖项，以确保您的应用程序能够正常工作。<br />

**安装typescript**<br/>
::: warning
注意：这是mono-repo项目，公共的东西都要加上-w
:::

```shell
pnpm i -D -w typescript
```
**修改.eslintrc.json**
```json
{
  "env": {
    "browser": true,
    "es2021": true
  },
  // 继承其余eslint的配置
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "prettier",
    "plugin:prettier/recommended"
  ],
  "overrides": [],
  // 指定用什么样的方式将代码解析成ast语法树
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "ecmaVersion": "latest",
    "sourceType": "module"
  },
  // 规则的合集
  "plugins": ["@typescript-eslint"],
  "rules": {
    "prettier/prettier": "error",
    "no-case-declarations": "off",
    "no-constant-condition": "off",
    "@typescript-eslint/ban-ts-comment": "off"
  }
}
```
**安装ts的eslint插件**
```shell
pnpm i -D -w @typescript-eslint/eslint-plugin 
```
### prettier
**安装prettier**
```json
pnpm i -D -w prettier
```
在根目录创建.prettierrc.json
```json
{
  "printWidth": 80,
  "tabWidth": 2,
  "useTabs": true,
  "singleQuote": true,
  "semi": true,
  "trailingComma": "none",
  "bracketSpacing": true
}
```
eslint也有风格检查，为了避免冲突，将prettier集成到eslint中<br>
**修改.eslintrc.json**
```json
 "plugins": ["@typescript-eslint", "prettier"],
```
**安装所需插件**
`eslint-config-prettier`覆盖eslint本身的规则配置<br>
`eslint-plugin-prettier`用Prettier来接管修复代码`eslint --fix`<br>
```shell
pnpm i -D eslint-config-prettier eslint-plugin-prettier
```
**修改package.json**
```json
"scripts": {
  "test": "echo \"Error: no test specified\" && exit 1",
  "lint": "eslint --ext .js,.ts,.jsx,.tsx --fix --quiet ./packages"
},
```
## 规范检查 
### git
**初始化git**
```shell
git init
```
**根目录新增.gitignore文件**
```json
/node_modules
```
### husky
**安装husky**
```shell
pnpm i -D -w husky
```
**初始化**
```shell
npx husky install
```
**添加命令到执行脚本**
```shell
npx husky add .husky/pre-commit "pnpm run lint"
```
### git提交信息检查
**安装必要的库**
```shell
pnpm i commitlint @commitlint/cli @commitlint/config-conventional -D -w
```
**根目录创建文件.commitlintrc.js**
```js
module.exports = {
  extends: ["@commitlint/config-conventional"]
}
```
**集成到husky中**
```shell
npx husky add .husky/commit-msg "npx --no-install commitlint -e $HUSKY_GIT_PARAMS"
```
**使用`git cz`**
配置使用git cz命令自动生成符合规则的提交条件<br>
**安装所需依赖**
```shell
pnpm i -D -w commitizen cz-conventional-changelog
```
**修改package.json**
```json
"scripts": {
  "commit": "git add . && git cz"
},
"config": {
  "commitizen": {
    "path": "node_modules/cz-conventional-changelog"
  }
},
```
现在项目中执行`git cz`或者`pnpm commit`来提交规范的commit
### lint-staged
由于husky每次检查的是所有的代码，速度过慢，采用`lint-staged`来优化只检测
**安装lint-staged**
```shell
pnpm i -D -w int-staged
```
**修改./husky/pre-commit**
```shell
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

pnpm lint-staged
```
**修改package.json**
```json
"lint-staged": {
  "*.{js,jsx,ts,tsx}": [
    "pnpm run lint"
  ]
},
```
## ts配置
**根目录新建tsconfig.json**
```json
{
 "compileOnSave": true,
 "compilerOptions": {
  "target": "ESNext",
  "useDefineForClassFields": true,
  "module": "ESNext",
  "lib": ["ESNext", "DOM"],
  "moduleResolution": "Node",
  "strict": true,
  "sourceMap": true,
  "resolveJsonModule": true,
  "isolatedModules": true,
  "esModuleInterop": true,
  "noEmit": true,
  "noUnusedLocals": true,
  "noUnusedParameters": true,
  "noImplicitReturns": false,
  "skipLibCheck": true,
  "baseUrl": "./packages"
 }
}
```
## 打包工具
由于我们创建的不是业务项目，而是库，需要工具尽可能简洁，打包产物可读性高，原生支持esm，所以选择rollup
```shell
pnpm i -D -w rollup
```
**根目录新建scripts**
目的存放所有工具的配置脚本
**在scripts中新建rollup**
存放rollup相关配置