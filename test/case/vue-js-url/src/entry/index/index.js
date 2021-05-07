import Vue from 'vue'
import { mapActions } from 'vuex'
import VueRouter from 'vue-router'

import Tofu from '@yy/tofu-ui/build'
import '@yy/tofu-ui/build/index.css' // 注册UI库

import store from '../../vuex/store.js'
import './index.scss'

const pageIndex = () =>
  import(/* webpackChunkName: "pageIndex" */ '../../components/page/p-index/p-index.vue')
const pageSub = () =>
  import(/* webpackChunkName: "pageSub" */ '../../components/page/p-sub/p-sub.vue')

/**
 *  注册并创建与 vm 实例绑定的UI组件 alias
 *  vm.$messgebox
 *  vm.$toast
 */
const { Messagebox, Toast } = Tofu
Vue.use(Messagebox)
Vue.use(Toast)
Vue.use(Tofu.Preview)

Vue.use(VueRouter)

const router = new VueRouter({
  routes: [
    {
      path: '/index',
      component: pageIndex
    },
    {
      path: '/sub',
      component: pageSub
    },
    {
      path: '*',
      redirect: '/index'
    }
  ]
})

new Vue({
  store,
  router,
  methods: {
    ...mapActions(['addDemoLog'])
  },
  mounted() {
    this.addDemoLog('index.js ready')
  }
}).$mount('#app')
