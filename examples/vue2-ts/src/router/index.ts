import Vue, { AsyncComponent } from 'vue'
import Router, { RouteConfig, Route, NavigationGuard } from 'vue-router'
import pageIndex from '~@/page/index.vue';
// const pageIndex: AsyncComponent = (): any => import(/* webpackChunkName: "pageIndex" */ '~@/page/index.vue')
import pageSub from '~@/page/sub.vue';
// const pageSub: AsyncComponent = (): any => import(/* webpackChunkName: "pageSub" */ '~@/page/sub.vue');

Vue.use(Router)

const routes: RouteConfig[] = [
  {
    path: '*',
    redirect: '/index'
  }, {
    path: '/index',
    component: pageIndex
  }, {
    path: '/sub',
    component: pageSub
  }
]

const router: Router = new Router({
  mode: 'history',
  base: '/',
  routes
})
export default router