---
title: Vue3及其生态的使用
date: 2023-03-20
sidebar: 'auto'
categories:
 - 框架
tags:
 - vue3
publish: true
---
## vue3
### setup
setup是一个函数，是所有组合api的使用入口。返回值只能是渲染函数或者对象。
#### 初体验
```js
<template>
	<span>姓名:{{name}}</span>
	<button @click="say">say</button>
</template>

<script>
	import {
		h
	} from 'vue'
	export default {
		beforeCreate() {
			console.log('beforeCreate')
		},
		setup() {
			console.log('setup')
			const name = 'yfc'
			const say = () => {
				console.log(`hello${name}`)
			}
			// return () => h('div', {
			// 	class: 'div'
			// }, [
			// 	h('h2', 'hello')
			// ])
			return {
				name,
				say
			}
		}

	}
</script>
```
+ 返回值是一个对象，对象内的值或者方法都可以在模板中使用
+ 返回值是一个渲染函数，那么会覆盖定义好的模板
+ 根据以上例子发现，setup运行在beforeCreate之前，所以不能像vue2那样用this访问实例
:::warning
+ setup通常情况下不能被async修饰，因为这样会返回一个promise
+ 尽量不要和vue2混用，如果变量重复，则setup优先
+ setup访问不了vue2配置的属性方法，但vue2可以访问到setup的
:::
#### 访问props
props值是一个对象，是组件外部传递过来且在组件内部声明过得属性
子组件 pages/steup/index.vue
```js
<template>
	<span>props：{{name}} {{sum}}</span>
</template>

<script>

import { toRef } from 'vue'
export default {
	props: {
		name: String,
		sum: Number
	},
	setup(props) {
		const sum = toRef(props, "sum")
		return {
			name: props.name,
			sum
		}
	}
}
</script>
```
父组件 App.vue
```js
<template>
	<SetupDemo name='setupDemo' :sum="sum" />
	<button @click="sumClick">{{sum}}</button>
</template>

<script setup>
	import {
		ref
	} from 'vue';
	import SetupDemo from '../src/pages/setup/index.vue';
	let sum = ref(0)
	const sumClick = () => {
		sum.value += 1
	}
</script>
```
如上所示，如果需要传递过来的props属性具有响应式，需要使用toRef转换。
#### 访问上下文
setup第二个参数是上下文对象，都是非响应式的，里面包含
+ attrs 值是一个非响应式对象，是传递过来的，但是没有在props中定义的，等价于$attrs
+ slots 非响应式对象 等价于$slots
+ emit  触发事件 等价于$emit
+ expose 暴漏公共属性
**attrs** 有状态对象，会随着组件自身的更新而更新，但他的属性都不是响应式的，可在onBeforeUpdate中编写逻辑
```js
<template>	
	<p>
		attrs: {{ isEven === 1  ? '奇数' :'偶数'}}
	</p>
</template>

<script>
import { ref } from 'vue';
import { onBeforeUpdate } from 'vue'
export default {
	setup(props, { attrs}) {
		let isEven = ref(1)
		onBeforeUpdate(() => {
			const sum = attrs.sum
			if (sum % 2 === 0) {
				isEven.value = 2
			} else {
				isEven.value = 1
			}
		})
		return {
			isEven
		}
	}
}
</script>
```
**emit** 用法不变
```js
<template>
	<p>emits <button @click="onClick">点击调用父方法</button></p>
</template>

<script>
 export default {
	setup(props, { emit }) {
		const onClick = () => {
			emit('handleClick', 10)
		}
		return {
			onClick
		}
	}
 }
</script>

<template>
	<SetupDemo name='setupDemo' :sum="sum" @handleClick="handleClick">
	</SetupDemo>
	<button @click="sumClick">{{sum}}</button>
</template>

<script setup>
	import {
		ref
	} from 'vue';
	import SetupDemo from '../src/pages/setup/index.vue';
	let sum = ref(1)
	const sumClick = () => {
		sum.value += 1
	}
	const handleClick = (v) => {
		sum.value += v
	}
</script>
```
 **expose** 限制暴露给父组件的属性
```js
<template>
	<p>emits <button @click="onClick">点击调用父方法</button></p>
</template>

<script>
 export default {
	setup(props, { emit, expose }) {
		const onClick = () => {
			emit('handleClick', 10)
		}
		expose({fun: onClick})
		return {
			onClick
		}
	}
 }
</script>
```
``` js
<template>
	<SetupDemo ref="son" name='setupDemo' :sum="sum" @handleClick="handleClick">
	</SetupDemo>
	<button @click="sumClick">{{sum}}</button>
</template>

<script setup>
	import {
    onMounted,
		ref
	} from 'vue';
	import SetupDemo from '../src/pages/setup/index.vue';
	let sum = ref(1)
	const sumClick = () => {
		sum.value += 1
	}
	const handleClick = (v) => {
		sum.value += v
	}

	const son = ref(null)
	onMounted(() => {
		console.log(son.value.fun)
	})
	
</script>
```
由此可以expose()不传参数的话不暴露任何东西，传递对象形式的可暴漏指定属性。

### ref reactive
ref是将传入的值变为响应式的对象，通过.value获取值，但在模板中不需要
```js

```
```js
<template>
<RefDemo />
</template>
<script setup>
import RefDemo from './index.vue'
</script>
```
::: tip
+ 其中如果ref接受的是一个基本数据类型，那么内部是采用Object.defineProperty方式实现响应式
+ 如果是对象 内部会调用reactive的方法 采用的Proxy方式实现
+ reactive只能接受对象，不需要.value，是深层次的响应
:::

### computed
计算属性，可以接受一个getter 函数或者接受一个带有get set函数的对象
```js
<template>
  <p>区号<input v-model="phone.first" /></p>
  <p>座机号<input v-model="phone.two" /></p>
  <p>完整号码<input v-model="finallPhone2" /></p>
</template>

<script setup>
import { computed, reactive } from "vue";

let phone = reactive({
  first: "",
  two: "",
});

let finallPhone = computed(() => phone.first + "-" + phone.two);
finallPhone.value ++

let finallPhone2 = computed({
  get: () => phone.first + "-" + phone.two,
  set: (value) => {
    if (value && value.includes('-')) {
      const arr = value.split('-')
      phone.first = arr.shift()
      phone.two = arr.join('')
    }
  }

});

</script>
```
::: tip
+ computed 接受getter函数则返回值是一个只读的ref对象，修改则抛出警告
+ 接受一个带有get set函数对象的话，可以创建一个完整的ref对象，可进行读写
:::
### watch
监听函数，只有在监听源发生改变时候才会执行回调函数。<br>
监听源分为四种
+ 返回一个值的函数
+ 一个ref
+ 一个reactive
+ 或者由上面几种组成的数组
#### 监听ref
```js
<template>
  <button @click="name += '.'">姓名：{{ name }}</button>
  <button @click="age += 1">年龄：{{ age }}</button>
</template>

<script setup>
import { reactive, ref, watch } from "vue";

let name = ref("yfc");
let age = ref(27);

watch(name, (name, prevName) => {
  console.log(`name:${name} prevName:${prevName}`);
});

watch(() => name.value, (name, prevName) => {
  console.log(`name:${name} prevName:${prevName}`);
})

watch([name, age], (newData, oldData) => {
  console.log(`newData:${newData} oldData:${oldData}`);
})
</script>
```
+ 监听ref和监听ref定义的变量的value值在这里并无区别
+ 监听多个值的时候，新老数据结构皆是数组

#### 监听reactive
```js
<template>
  <button @click="job.job1.salary += 10">薪资：{{ job.job1.salary }}</button>
  <button @click="job.age += 1">工龄：{{ job.age }}</button>
</template>

<script setup>
import { reactive, ref, watch } from "vue";
let job = reactive({
  job1: {
    salary: 100,
  },
  age: 10,
});

watch(job, (newData, oldData) => {
  console.log(newData, oldData);
});

watch(
  () => job.job1,
  (newData, oldData) => {
    console.log(newData, oldData);
  }
);

watch(
  () => job.age,
  (newData, oldData) => {
    console.log(newData, oldData);
  }
);
</script>
```
监听对象分为三种情况
+ 监听整个对象，此时deep强制开启，手动设置false无用，获取不到老的值
+ 监听对象基础数据类型，类似于监听ref
+ 监听对象的对象，类似于监听对象，此时需要开启deep:true，依然回去不到老的值

#### 停止监听器
默认情况下组件销毁，监听器停止，大多数不需要手动停止。<br>
但监听器返回一个函数，运行函数即可停止监听。
``` js
<template>
  <button @click="job.age += 1">工龄：{{ job.age }}</button>
  <button @click="()=>stop()">停止监听</button>
</template>

<script setup>
import { onMounted, reactive, ref, watch } from "vue";

let job = reactive({
  job1: {
    salary: 100,
  },
  age: 10,
});

const stop = watch(
  () => job.age,
  (newData, oldData) => {
    console.log(newData, oldData);
  }
);

</script>
```
#### 监听器的第三个参数
+ deep 是否深度遍历 Boolean
+ immediate 是否立即执行  Boolean
+ flush 监听器的执行时机，取值为 'pre' | 'post' | 'sync'，默认在组件渲染前执行。post会推迟到组件渲染之后执行。sync是依赖发生改变时候立即触发，多个依赖可能造成数据一致性问题，谨慎使用。
+ onTrack onTrigger 监听器调试选项，只会在开发模式下工作。

### watchEffect
立即运行一个函数，并且追踪依赖，在依赖发生改变时执行。类似于useEffect。<br>
不过watchEffect不需要显式指定依赖，它会自己收集依赖
```js
<template>
  <button @click="name += '.'">姓名：{{ name }}</button>
  <button @click="age += 1">年龄：{{ age }}</button>
  <button @click="job.job1.salary += 10">薪资：{{ job.job1.salary }}</button>
  <button @click="job.age += 1">工龄：{{ job.age }}</button>
  <button @click="()=>stop()">停止监听</button>
</template>

<script setup>
import { ref, watchEffect, reactive } from "vue";

let name = ref("yfc");
let age = ref(27);

let job = reactive({
  job1: {
    salary: 100,
  },
  age: 10,
});

const stop = watchEffect(() => {
  console.log(name)
  console.log(age)
  console.log(job)
})
</script>
```
watch继承watchEffect，所以wacth支持的参数watchEffect同样支持。默认开启了immediate。<br>
用到谁就监听谁，监听到点，比如上面没用到job里面的属性值，上文中改变工龄和薪资则不会触发。
### 生命周期
由于vue3使用了组合式Api，也主持配置项形式的写法，所以有两种方式，组合式和配置式
```js
<template>
  <button @click="sum++">{{ sum }}</button>
</template>

<script>
import {
  onMounted,
  onBeforeMount,
  onBeforeUpdate,
  onUpdated,
  onBeforeUnmount,
  onUnmounted,
  onActivated,
  onDeactivated,
  onServerPrefetch,
  ref,
} from "vue";
export default {
  setup() {
    const sum = ref(0);
    onBeforeMount(() => console.log("onBeforeMount"));
    onMounted(() => console.log("onMounted"));
    onBeforeUpdate(() => console.log("onBeforeUpdate"));
    onUpdated(() => console.log("onUpdated"));
    onBeforeUnmount(() => console.log("onBeforeUnmount"));
    onUnmounted(() => console.log("onUnmounted"));
    onActivated(() => console.log("onActivated"));
    onDeactivated(() => console.log("onDeactivated"));
    onServerPrefetch(() => console.log("onServerPrefetch"));
    console.log("setup");
    return {
      sum,
    };
  },
  beforeCreate() {
    console.log("beforeCreate");
  },
  created() {
    console.log("created");
  },
  beforeMount() {
    console.log("beforeMount");
  },
  mounted() {
    console.log("mounted");
  },
  beforeUpdate() {
    console.log("beforeUpdate");
  },
  updated() {
    console.log("updated");
  },
  beforeUnmount() {
    console.log("beforeUnmount");
  },
  unmounted() {
    console.log("unmounted");
  },
  activated() {
    console.log("activated");
  },
  deactivated() {
    console.log("deactivated");
  },
  serverPrefetch() {
    console.log("serverPrefetch");
  },
};
</script>

<style>
</style>

```
+ **setup**会在所有选项式Api钩子之前调用，在组合式api中可以再次发送api请求，但是不能操作dom。
+ **beforeCreate**在组件实例初始化完成，props解析之后，data和computed处理之前立即调用。
+ **created** 组件实例处理完所有与状态相关（响应式数据，计算属性，方法，监听属性）的选项后立即调用，此时挂载阶段未开始，$el属性任然不可用。
+ **beforeMount** 组件被挂载前调用，此时响应式状态设置完成，虚拟dom完成，render函数首次执行渲染。ps：服务端渲染时不会被调用。
+ **mounted** 组件被挂载后调用，所有同步组件已经被挂在（不包含异步组件或者Suspense树内的组件），真实dom挂载完成。ps：服务端渲染时候不会调用。
+ **beforeUpdate** 在组件因为一个响应式状态变更而更新其dom之前调用，此时还可以改变状态。ps：服务端渲染时不会被调用。
+ **updated** 在组件因为一个响应式状态变更而更新其dom之后调用。ps：这个钩子在服务端渲染不会被调用，并且不能在里面更改响应式状态。
+ **beforeUnmount** 在组件卸载之前调用，此时组件实例依然可以使用。
+ **unmounted** 所有的子组件都已经被卸载，计算属性，监听器停止，可以在这个函数中清理副作用。ps： 服务端渲染不会被调用。
+ **activated** 使用的KeepAlive缓存的组件被激活时候调用，ps：服务端渲染不会被调用。
+ **deactivated** 使用的KeepAlive缓存的组件被移出时候调用，ps：服务端渲染不会被调用。
+ **serverPrefetch** 组件实例在服务器上被渲染前要完成的衣服函数，如果狗子返回一个Promise，服务端渲染会在渲染该组件前等待该Promise完成。
### 工具函数
+ isRef 判断某个值是否是ref
```js
let num = ref(10);
console.log(isRef(num)); // true
let obj = ref({num: 10});
console.log(isRef(obj)); // true
```
+ unRef 如果参数是ref则返回.value值，否则返回参数本事
```js
let num = ref(10);
let num2 = 10;
console.log(unref(num)); // 10
console.log(unref(num2)); // 10
```
+ toRef 继续响应式对象上的一个属性，创建一个对应的ref，二者相互关联，一个变化，另一个也变化
```js
let people = reactive({ age: 27 });
let age = toRef(people, 'age');
age.value += 1;
console.log(people.age); // 28
people.age +=1 ;
console.log(age.value); // 29
```
+ toRefs 和toRef一样不过是批量
```js
let cat = reactive({ name: 'yfc', age: 1 });
let { name, age: age1 } = toRefs(cat);
console.log(name.value, age1.value) // yfc 1
```
+ isProxy 检查一个对象是否由reactive()、readonly()、shallowReactive() 或 shallowReadonly() 创建的代理
```js
let num = ref(10);
let people = reactive({ age: 27 });
const readOnlyValue = readonly({});
let shallowReactiveValue = shallowReactive({name: 'yfc', job: {age: 6}});
let shallowReadonlyValue = shallowReadonly({name: 'yfc', job: {age: 6}});

console.log(isProxy(num)); // false
console.log(isProxy(obj)); // false
console.log(isProxy(people)); // true
console.log(isProxy(readOnlyValue)); // true
console.log(isProxy(shallowReactiveValue)); // true
console.log(isProxy(shallowReadonlyValue)); // true
```
+ isReactive 检查一个对象是否是由reactive() shallowReactive() 创建的代理
注意ref传入对象底层还是根据reactive创建的代理，所以ref创建对象的.value传入isReactive返回依然是true
```js
let people = reactive({ age: 27 });
let obj = ref({num: 10});
let shallowReactiveValue = shallowReactive({name: 'yfc', job: {age: 6}});
console.log(isReactive(people));  // true
console.log(isReactive(shallowReactiveValue)); // true
console.log(isReactive(obj.value)); // true
console.log(isReactive(obj)); // false
```
+ isReadonly 检查传入的值是否是只读对象，只读对象可以更改，但是无法对对象直接赋值
```js
const readOnlyValue = readonly({});
let shallowReadonlyValue = shallowReadonly({name: 'yfc', job: {age: 6}});
console.log(isReadonly(readOnlyValue)); // true
console.log(isReadonly(shallowReadonlyValue)); // true
```
+ shallowRef只会对浅层起作用，只会对.value的更改起作用而不会响应对.value.的值
```js
let shallowRefValue = shallowRef({ name: 'yfc' });

shallowRefValue.value.name = 'hl'; // 不会触发响应式
shallowRefValue.value = { name: 'hl'}; // 会触发响应式
```
+ triggerRef 对一个浅层副作用的深层修改时候，强制触发响应
```js
let shallowRefValue = shallowRef({ name: 'yfc' });

watchEffect(() => {
  console.log(shallowRefValue.value.name)
})

shallowRefValue.value.name = 'hl'; // 不会触发响应式
triggerRef(shallowRefValue); // 触发响应式
```
+ shallowReactive reactive的浅层次形式
```js
let shallowReactiveValue = shallowReactive({name: 'yfc', job: {age: 6}});
shallowReactiveValue.name = 'hl'; // 响应
shallowReactiveValue.job.age++; // 不响应
```
+ shallowReadonly readonly的浅层次形式
```js
let shallowReadonlyValue = shallowReadonly({name: 'yfc', job: {age: 6}});
shallowReadonlyValue.value = 'hl'; // 无用且警告
shallowReadonlyValue.job.age++; // 有用
```
+ toRaw 返回由 reactive()、readonly()、shallowReactive() 或者 shallowReadonly() 创建的代理对应的原始对象。
``` js
let dog = reactive({ age: 2 });
let dogRef = ref({ age: 2 })

watchEffect(() => {
  console.log(dog);
})
let dogRow = toRaw(dog);
dogRow.age++; // 不响应 但是dog内部的数据已被更改

let dogRefRow = toRaw(dogRef.value);
dogRefRow.age++; // 不响应 但是dogRef.value内部的数据已被更改
watchEffect(() => {
  console.log(dogRef);
})
```
### setup 作为属性
在script标签上添加setup属性，里面的代码会被编译成setup（）函数的内容。带有setup标签的script中的代码每次实例被创建都会执行。
+ 声明的顶层函数，变量，import导入的内容都能在模板中直接使用
+ 使用props
+ 使用emits
+ 限制声明的绑定
+ 使用slots
+ 使用attrs
+ 注意顶层如果使用await 会被编译成setup，只能与Suspense内置组件组合使用<br>
**子组件**
```js
<template>
  <p>组件传值: {{ num }}</p>
  <button @click="callback">调用父方法</button>
  <p>子组件自己的值: {{ age }}</p>
</template>

<script setup>
import { onMounted, ref, useAttrs, useSlots } from "vue";

let age = ref(27);

const props = defineProps({
  num: {
    type: Number,
    default: 0,
  },
});

const emit = defineEmits(["fun"]);

const callback = () => {
  emit("fun", 123);
};

defineExpose({ age });

const attr = useAttrs();
const slots = useSlots();
onMounted(() => {
  console.log(attr);
  console.log(slots);
});
</script>

<style>
</style>
```
**父组件**
```js
<template>
  <ScriptSetup :num="num" @fun="fun" ref="son" cao="cao">
  <template v-slot>
    <div>slot</div>
  </template>
  </ScriptSetup>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import ScriptSetup from './index.vue';
let num = ref(0)
const son = ref(null)
const fun = (v) => {
  num.value++
}
onMounted(() => {
  console.log(son.value)
})

</script>

<style>
</style>
```
### 全局变量
```js
const app = Vue.createApp({})
app.config.globalProperties.$http = () => {}

import { getCurrentInstance, onMounted } from "vue";
export default {
  setup( ) {
    const { ctx } = getCurrentInstance(); //获取上下文实例，ctx=vue2的this
    onMounted(() => {
      console.log(ctx, "ctx");
      ctx.http();
    });
  },
};
```
### 自定义hook函数
[自定义hook](https://abc.dtxy.xyz/boke/study/Vue3CustomHook.html)







## Router

