import Vue from 'vue'
import App from './App'
import 'babel-polyfill'
import router from './router'
import fastclick from 'fastclick'
import VueLazyload from 'vue-lazyload'
import store from './store'
import 'common/stylus/index.styl'

/* eslint-disable no-unused-vars */
import vconsole from 'vconsole'
// console.log('哈哈哈')
fastclick.attach(document.body)
Vue.use(VueLazyload, {
  loading: require('common/image/default.png')
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  render: h => h(App),
  store,
  router
})
