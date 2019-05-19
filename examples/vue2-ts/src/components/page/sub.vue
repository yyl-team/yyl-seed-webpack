<template lang="pug">
div.p-sub
  components(is="vNav")
  components(is="vDemo")
</template>
<style lang="scss">
@charset 'utf-8';
.p-sub {
  background: #ddd;
  height: 100%;
}
</style>
<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Action } from "vuex-class";
import vDemo from "~@/widget/demo/demo.vue";
import vNav from "~@/widget/nav.vue";

@Component
export default class PageSub extends Vue {
  @Action addDemoLog(msg: string): void;
  components: {
    vDemo,
    vNav
  }
  mounted() {
    const vm = this
    vm.addDemoLog('page sub is ready')
  }
}
</script>
