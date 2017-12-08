import { shallow, createLocalVue } from 'vue-test-utils'
import Vuetify from 'vuetify'
import Vuex from 'vuex'
import Hello from '../../src/components/Hello.vue'

const localVue = createLocalVue()

localVue.use(Vuex)
localVue.use(Vuetify)

let actions
let store

beforeEach(() => {
  actions = {
    actionClick: jest.fn(),
    actionInput: jest.fn()
  }
  store = new Vuex.Store({
    state: {},
    actions
  })
})

test('Should have test-block and three buttons', () => {
  const wrapper = shallow(Hello, { store, localVue })
  const testBlockFlag = wrapper.contains('.test-block')
  expect(testBlockFlag).toBeTruthy()
})
