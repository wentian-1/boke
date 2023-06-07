---
title: Fiber的探究
date: 2023-05-25
sidebar: 'auto'
categories:
 - React
tags:
 - React
publish: true
---
## 出身
fiber出现的目的就是为了解决react在大型应用中卡顿的问题，它是react中最小粒度的执行单元，但是在每次遍历更新的时候都是用的虚拟dom，故此可理解为fiber就是react的虚拟dom。
## 浏览器绘制
大多浏览器的刷新率为60hz，即一秒钟刷新60次。浏览器的页面或者动画也是一帧一帧渲染出来的，为了保证用户看起来流畅所以渲染的帧率要和屏幕刷新率一致。既一秒60帧，所以一帧的时间约等于16mm。<br>
浏览器的每一帧包括样式计算，布局和绘制，然后js引擎和页面的渲染引擎是在同一个线程中，所以GUI和js执行是互斥的，如果某个js的任务执行过长，那么浏览器就会推迟渲染就会卡顿。
## fiber
fiber的出现可以让Reconciler的过程变成可中断的，能够适当的让出执行权，让浏览器快速响应用户的交互。
### 工作原理
fiber是最小的执行单元，每次执行一个单元后，react就会计算还剩余多少时间，如果有时间就执行Reconciler，如果没有时间就把执行权教给GPU。
<img :src="$withBase('/imgs/0_1_React18/fiber1.jpg')" alt="eslint">
### 相互之间的关系
fiber是一种数据结构里面记载了很多属性<br>
1. 静态结构属性，比如tag（fiber的类型） key type（dom元素的类型）
2. 用于标记和其他fiber关系的属性 child（子） return（父） sibline（兄） index（排行老几索引0开始）
3. 动态工作单元的属性 pendingProps（将要更新的props）memoizedState（记录上一次更新完毕后的props）
4. 调度优先级相关 lanes childLanes
每一个fiber都有child，return，sibline，index属性，他们之间形成了fiber树。
<img :src="$withBase('/imgs/0_1_React18/fiber2.jpg')" alt="eslint">
### 遍历
深度优先遍历，从上到小，如果有子则遍历子，如果没有子看是否有兄弟，然后判断兄弟有没有子，依次类推，有子就遍历子，没子就遍历兄弟，没兄弟就返回上级，知道没有父则遍历完成。自身所有的子节点完成后，自身完成。
<img :src="$withBase('/imgs/0_1_React18/fiber3.jpg')" alt="eslint">
### element fiber dom之间的关系
**element**就是开发者用jsx语法写的结构，都会创建成element对象的形式，上面保存了props，children等信息，是react视图层在代码层级上的体现。<br>
**fiber**是介于element和dom之间的一种数据结构，每个element都对应一个fiber，element的改变都是经过fiber层的处理形成，调用宿主环境的API形成新的dom。<br>
**dom**就是浏览器页面在开发者眼中的直观表现。
<img :src="$withBase('/imgs/0_1_React18/fiber4.jpg')" alt="eslint">