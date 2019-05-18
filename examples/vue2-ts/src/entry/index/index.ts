import 'yyl-flexlayout';
import '@babel/polyfill';
import Vue from 'vue';
import Router from 'vue-router'
import { mapActions } from 'vuex';
import "./index.scss";

import store from '../../vuex/store.js';

// const pageIndex: AsyncComponent = (): any => import(/* webpackChunkName: "pageIndex" */ '~@/page/index.vue')
import pageIndex from '~@/page/index.vue';
// const pageSub: AsyncComponent = (): any => import(/* webpackChunkName: "pageSub" */ '~@/page/sub.vue');
import pageSub from '~@/page/sub.vue';

Vue.use(Router);

const router = new Router();

new Vue({
  store,
  router,
  methods: {
    // ...mapActions(['addDemoLog'])
  },
  mounted() {
    // this.addDemoLog('index.js ready');
  }
}).$mount('#app');
