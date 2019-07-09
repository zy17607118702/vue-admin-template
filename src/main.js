import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
//引入全部sxss
import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import '@/icons' // icon
import '@/permission' // permission control 进度条
import router from './router'

import '@/icons' // icon
import '@/permission' // permission control
//elementui 国际化功能
import i18n from './lang' // Internationalization
Vue.use(ElementUI, { size: 'mini', i18n: (key, value) => i18n.t(key, value) })
//瀑布流插件 用于侧边栏
import VueMasonry from 'vue-masonry-css'
Vue.use(VueMasonry)
/**
 * This project originally used easy-mock to simulate data,
 * but its official service is very unstable,
 * and you can build your own service if you need it.
 * So here I use Mock.js for local emulation,
 * it will intercept your request, so you won't see the request in the network.
 * If you remove `../mock` it will automatically request easy-mock data.
 */
import '../mock' // simulation data


Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  i18n,//国际化
  render: h => h(App)
})
