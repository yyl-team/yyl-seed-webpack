export default {
  async addDemoLog (store, msg) {
    await new Promise(() => {
      store.commit('ADD_DEMO_LOG', msg)
    }, 200)
  }
}
