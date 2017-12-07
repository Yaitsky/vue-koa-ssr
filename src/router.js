import Vue from 'vue'
import Router from 'vue-router'
import Login from './components/Login'
import TodoList from './components/TodoList'

Vue.use(Router)
export function createRouter () {
  const router = new Router({
    mode: 'history',
    routes: [
      {
        path: '/',
        component: Login
      },
      {
        path: '/todolist',
        component: TodoList
      },
      {
        path: '*',
        redirect: '/'
      }
    ]
  })
  if (typeof window !== 'undefined') {
    router.beforeEach((to, from, next) => {
      const token = sessionStorage.getItem('demo-token')
      if (to.path === '/') { // If it is to jump to the login page
        if (token !== 'null' && token !== null) {
          next('/todolist') // If there is a token turn to todolist does not return to the login page
        }
        next() // Otherwise jump back to the login page
      } else {
        if (token !== 'null' && token !== null) {
          Vue.prototype.$http.defaults.headers.common['Authorization'] = 'Bearer ' + token // Notice that there is a space after the Bearer
          next() // If there is a token turn normal
        } else {
          next('/') // Otherwise jump back to the login page
        }
      }
    })
  }
  return router
}
