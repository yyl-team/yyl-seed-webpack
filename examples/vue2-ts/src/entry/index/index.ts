import 'yyl-flexlayout';
import '@babel/polyfill';

import Vue from 'vue'
import App from './index.vue'
import router from '@/router'

new Vue({
  el: '#app',
  router,
  render: h => h(App)
});
