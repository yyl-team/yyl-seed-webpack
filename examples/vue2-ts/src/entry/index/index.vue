<template lang="pug">
  #app 666
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import pageIndex from '~@/page/index.vue';
// const pageIndex: AsyncComponent = (): any => import(/* webpackChunkName: "pageIndex" */ '~@/page/index.vue')
import pageSub from '~@/page/sub.vue';
// const pageSub: AsyncComponent = (): any => import(/* webpackChunkName: "pageSub" */ '~@/page/sub.vue');

@Component({
  components: {
    pageIndex,
    pageSub
  }
})
export default class EntryIndex extends Vue {}


// import Vue from 'vue';
// import Router from 'vue-router'
// import { mapActions } from 'vuex';
// import "./index.scss";

// import store from '../../vuex/store.js';

// Vue.use(Router);
</script>
<style lang="scss">
@charset "utf-8";
@import "../../sass/normalize";
@import "../../sass/_mixin";
$psdWidth: 750;

.just-img {
  position: fixed;
  right: 10px; /* no */
  bottom: 10px; /* no */
  width: 100px;
  height: auto;
  z-index: 3;
}
#app {
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
}
</style>