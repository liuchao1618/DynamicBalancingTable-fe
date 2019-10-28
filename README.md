## DynamicBalancingTable-fe vue动感平衡台项目

### 项目概要

* 本项目用到的技术栈： vue-cli + vue-router + vuex + axios + vue-axios + vant( UI )

* 如何在本地运行本项目

```js

    git clone git@github.com:qiuChengleiy/shop-vue.git
    cd shop-vue
    npm i 或 cnpm i      //安装项目依赖 建议使用淘宝镜像源 cnpm 安装 具体参考官网cnpm.taobao.org
    npm run dev   //运行项目服务  在浏览器：localhost:8080/   查看

```

* 如果运行不成功请查看是否缺少配置文件 比如.babelrc或者尝试用vue-cli初始化一个vue项目再将本项目移植进去

* [项目地址](git@github.com:liuchao1618/DynamicBalancingTable-fe.git)

* 真机体验可能会带来不流畅卡顿等现象 建议使用Chrome浏览器体验

* 本项目用到的素材图片均来自唯品会网，仅学习使用，如果有问题请联系我删除 ^_^

### 项目文档说明

#### 项目结构

``` sh
├── build/ # 项目打包配置文件 vue-cli 初始化的文件
├── node_modules/ #模块文件
├── config/ #配置文件 vue-cli 初始化的配置
├── dist/  #打包后的文件存放目录
├── src/ #项目入口目录
    ├── assets/   #前端资源目录
        ├── css/ # 样式表目录/less文件存放目录
    ├── components/   # vue组件目录/.vue文件存放目录
    ├── router/  # vue路由管理目录
        ├── store.js # 路由主文件
    ├── store/ # vuex状态管理目录
        ├── store.js # 状态管理入口主文件
    ├── App.vue # 项目根组件
    ├── main.js # 项目入口文件

├── static/ #静态文件存放目录
    ├── images/   # 图片资源
    ├── data.json   # mock数据
├── test/ #测试目录
├── package.json #包文件信息
├── .babelrc
├── .editorconfig
├── .eslintignore
├── .eslintrc.js
├── .gitignore
├── .postcsssrc.js
├── index.html
├── README.md
├── vue-shop.apk
  

```

#### 功能简单介绍

##### main.js 项目入口文件

* 在主文件中，把所需要的模块加进来，vant的框架因为第一次用，所以也不知道具体加啥组件，所以索性都编译进去了~  这也导致了编译的速度有点稍慢

* 状态方面也对它做了简单的封装  /store/

```js
//导入所需模块
import Vue from 'vue'
import App from './App'
import router from './router'
Vue.config.productionTip = false

//axios
import axios from 'axios'
import VueAxios from 'vue-axios'

Vue.use(VueAxios, axios)

//状态管理
import vuex from 'vuex'
Vue.use(vuex);

//ui 框架
import Vant from 'vant';
import 'vant/lib/vant-css/index.css';

Vue.use(Vant);

//懒加载
import { Lazyload } from 'vant';
Vue.use(Lazyload);

//瀑布流
import { Waterfall } from 'vant';
Vue.use(Waterfall);

import store from './store/index'

/* VUE实例 */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})

```

#### 路由管理

* 在这里把需要跳转的组件都加进来，配合vue-router使用，因为业务逻辑不是很复杂，所以这里没有用子路由跳转,都是简单的路由处理

* 在js中控制路由跳转：
```js
this.$router.push(url);
```


```js
import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/home'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home,
    }
  ]
})

```

#### 组件

* 在写组件的过程中遇到的一些问题：

```js
// 1. 当使用ui组件时 部分样式无法直接在css中更改，解决办法： 通过自定义指令，调用原生方法用JS重写样式，将指令绑定到相应的组件上
// 2. 在开发过程中，很多部分都是一样的，所以编写可复用的组件很重要， 比如轮播 懒加载图片
// 3. 随着功能的增多，组件的体积也变得庞大，冗余的代码有点多
// 4. 组件之间的状态要更多的互通性，使得各组件互相关联起来
// 5. 在向后台发起请求时 对组件进行数据渲染时，判断难免会多，当相同的判断时用switch 比 if 会更加舒服一点
```

### 总结

* 这是我学vue做的第一个综合性的项目，整个过程耗时差不多20天左右吧,由于平时还有课程作业(大三)要做,都是挤着周末做的o(╥﹏╥)o以后继续完善这个项目

* 在做的过程中遇到了很多问题，所以收获了不少经验，再接再厉 ^_^

* 一句话总结自己： 继续踩坑

#### 始终坚信

敢于尝试的你 其实已经进步了 ^_^






















