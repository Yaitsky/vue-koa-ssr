import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export function createStore () {
  return new Vuex.Store({
    state: {
      testData: 'Hello world!',
      testBoolean: false,
      apiData: 'None'
    },
    actions: {
      alertHello () {
        setTimeout(() => {
          alert('hello world!')
        }, 0)
      },
      async getDataFromAPI ({ commit }) {
        const { data } = await Vue.axios.get('/test/test-data')

        commit('setData', data)
      }
    },
    mutations: {
      changeData (state) {
        state.testBoolean = !state.testBoolean
      },
      setData (state, payload) {
        state.apiData = payload
      }
    }
  })
}
