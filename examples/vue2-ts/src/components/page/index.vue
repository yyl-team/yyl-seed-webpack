<template lang="pug">
div.p-index
  components(is="vNav")
  components(is="vDemo")
</template>
<style lang="scss">
@charset 'utf-8';
.p-index {
  height: 100%;
  background: #fff;
}
</style>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Action } from "vuex-class";
import vDemo from "~@/widget/demo/demo.vue";
import vNav from "~@/widget/nav.vue";

@Component
export default class PageIndex extends Vue {
  @Action addDemoLog(msg: string): void;
  components: {
    vDemo,
    vNav
  }
  mounted() {
    const vm = this
    vm.addDemoLog('page index is ready')
    vm.addDemoLog(`now in ${process.env.NODE_ENV}`)
  }
}
</script>
