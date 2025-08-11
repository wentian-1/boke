---
title: 脚手架搭建
date: 2025-05-07
sidebar: 'auto'
categories:
 - 脚手架
tags:
 - JavaScript
 - Cli
publish: true
---

cli就是一个node脚本，通过node的各种方法将用户在控制台输入的命令已经不同的模板获取整合程一个搭建好的项目。使用cli可以快速搭建项目，提高开发效率。里面配置好的有模板，以及常用的相关配置，比如代码规范，统一风格等。
既然是快速搭建，那肯定是需要一些模板的。所以此次记录下开发过程，包含cli的以及模板的搭建过程。

## cli搭建
### 1. 创建文件夹并初始化
注意：
1. node版本必须大于16
2. 初始化时选择pnpm
```bash
mkdir vvrc-cli && cd vvrc-cli && pnpm init
```
如下界面一直回车
<img :src="$withBase('/imgs/01_cli/1.png')" alt=""><br/>

### 2. 修改配置并创建文件
打开所在目录修改package.json文件如下，并在根目录下创建bin/index.js，这个是node脚本的入口文件。此时目录结构以及文件内容如下

**文件内容**
```json
{
  "name": "vvrc-cli",
  "version": "1.0.0",
  "description": "",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "bin": {
    "vvrc": "./bin/index.js"
  },
  "author": "",
  "license": "ISC"
}
```
**目录结构**
/bin/index.js
```js
#!/usr/bin/env node
console.log('hello world');
```
注意：`#!/usr/bin/env node`不能省略

### 3. 运行
在当前文件根目录下使用`npm link`将该包建立一个软链接，然后在执行vvrc，就可以在控制台看到`hello world`的字样。
由于该命令有弊端，例如当仓库A和仓库B都包含同名包时，若先在仓库B执行npm link，则后续在仓库A的修改不会生效，必须先在仓库B执行npm unlink才能切换调试环境。现代前端工程推荐使用pnpm的workspace功能或yarn workspace替代npm link，它们通过硬链接而非软链接实现依赖共享，既保持调试便利性又避免版本冲突。

### 4. Monorepo风格搭建
在当前的根目录下创建`pnpm-workspace.yaml`文件，并写入内容
```yaml
packages:
  - 'packages/**'  # 存放公共的包，比如工具函数，组件库
  - 'apps/*' # 存放项目
```
这样配置后，说明`packages`和`apps`已经是一个工作空间了，子工程或者打包的产物都可以被其他子工程或者应用引用。
在跟目录下新建`packages`以及`apps`并且在`packages`创建一个文件夹`vvr-cli`用来存放脚手架主要的代码，在`apps`下创建`project`用来验证
```shell
mkdir packages && mkdir apps && mkdir packages/vvr-cli && mkdir apps/project
```
将根目录下的`bin`移动到 `packages/vvr-cli`下，cmd进入到`packages/vvr-cli `并执行`pnpm init`。

修改跟目录下的`package.json`
```json
{
  "name": "vvrc-cli",
  "version": "1.0.0",
  "description": "",
  "scripts": {
    "vvrc-cli": "pnpm --filter project vvr-cli"
  },
  "author": "",
  "license": "ISC"
}
```
在根目录下的终端输入
```shell
cd apps/project && pnpm inint && pnpm install vvr-cli --filter project
```
:::warning
注意：`pnpm install [name1] --filter [name2]`
这里的name1，name2指的是当前工作空间中的`package.json`里面的`name`值，而不是文件夹的名字。name1是指需要安装的包，name2是安装到的子项目
:::
并在`project`文件里面添加运行脚本，此时的`package.json`
```json
{
  "name": "project",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "vvr-cli": "vvr-cli"
  },
  "author": "",
  "license": "ISC",
  "dependencies": {
    "vvr-cli": "workspace:^1.0.0"
  }
}
```
此时项目的结构如下

<img :src="$withBase('/imgs/01_cli/2.png')" alt=""><br/>

在根目录下的终端里面执行`pnpm vvrc-cli`
<img :src="$withBase('/imgs/01_cli/3.png')" alt=""><br/>
此时说明改造成`monorepo`完成，接下来进行代码编写

## 核心模块编写
一个脚手架从运行命令，用户交互，文件拷贝，动态文件生成，安装依赖等步骤，所以接下来根绝这些开始实现。
1. 命令参数
Node.js中的process模块可以获取当前node进程的相关信息，比如命令参数，环境变量等，在`vvr-cli/bin/index.js`中添加以下代码
```js
#!/usr/bin/env node
const process = require('process');
console.log(process.argv);
```
:::warning
注意这里我们写的是node脚本，node是cms模块的，所以要使用内置的require导入；

当然随着js的更新，现在也支持esm模块，也就是import方式导入。node默认就是cms，要想使用ems需要两种方式，
+ 将`index.js`改为`index.mjs`
+ 或者在`packages/vvr-cli/package.json`里面指定`type: 'module'`
修改完之后需要再项目里面重新`pnpm i`
:::
然后在根目录下执行命令`pnpm vvrc-cli`就可以看到运行结果
<img :src="$withBase('/imgs/01_cli/4.png')" alt=""><br/>
在一个脚手架中传递参数还蛮重要的，比如`pnpm vvrc-cli -- --name=yfc`，`pnpm vvrc-cli -- --name:yfc`
:::warning
注意 -- -- 有两个原因是第一个会被pnpm拿走，第二个才是传递给我们的clinode进程的，所以需要两个
:::
由于我们是在根目录下启动的命令，相对于项目来说包了一层

<img :src="$withBase('/imgs/01_cli/5.png')" alt=""><br/>
<img :src="$withBase('/imgs/01_cli/6.png')" alt=""><br/>

所以在根目录下使用命令`pnpm vvrc-cli -- -- --name=cli`在控制台可以看到

<img :src="$withBase('/imgs/01_cli/7.png')" alt=""><br/>
