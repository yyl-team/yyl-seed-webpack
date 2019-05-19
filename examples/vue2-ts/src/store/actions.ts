import { ActionTree } from 'vuex'

const actions: ActionTree<any, any> = {
  addDemoLog(store, msg) {
    store.commit('ADD_DEMO_LOG', msg);
  }
}

export default actions;
