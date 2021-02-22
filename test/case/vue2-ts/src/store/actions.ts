import { ActionTree } from 'vuex'

const actions: ActionTree<any, any> = {
  async addDemoLog({ commit }, msg) {
    await new Promise(() => {
      commit('ADD_DEMO_LOG', msg)
    })
  }
}

export default actions
