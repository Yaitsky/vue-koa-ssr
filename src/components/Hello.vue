<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <h2>Essential Links</h2>
    <ul>
      <li><a href="https://vuejs.org" target="_blank">Core Docs</a></li>
      <li><a href="https://forum.vuejs.org" target="_blank">Forum</a></li>
      <li><a href="https://gitter.im/vuejs/vue" target="_blank">Gitter Chat</a></li>
      <li><a href="https://twitter.com/vuejs" target="_blank">Twitter</a></li>
      <br>
      <li><a href="http://vuejs-templates.github.io/webpack/" target="_blank">Docs for This Template</a></li>
    </ul>
    <h2>Ecosystem</h2>
    <ul>
      <li><a href="http://router.vuejs.org/" target="_blank">vue-router</a></li>
      <li><a href="http://vuex.vuejs.org/" target="_blank">vuex</a></li>
      <li><a href="http://vue-loader.vuejs.org/" target="_blank">vue-loader</a></li>
      <li><a href="https://github.com/vuejs/awesome-vue" target="_blank">awesome-vue</a></li>
      <br>
      <div class="test-block">
        <v-btn color="success" class="test-block__btn" @click="changeData">Поменять данные</v-btn>
        <v-btn color="primary" class="test-block__btn" @click="getData">Получить данные</v-btn>
        <v-btn color="error" class="test-block__btn" @click="getError">Получить ошибку 404</v-btn>
        <div>{{ testData }}</div>
        <div>Изменение в store.state - {{ testBoolean ? 'Да' : 'Нет' }}</div>
        <div>Получение с сервера в store.state - {{ apiData }}</div>
      </div>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'hello',
  data () {
    return {
      msg: 'Welcome to Your SSR Vue.js + Vuetify.js + Koa.js App'
    }
  },
  computed: {
    testData () {
      return this.$store.state.testData
    },
    testBoolean () {
      return this.$store.state.testBoolean
    },
    apiData () {
      return this.$store.state.apiData
    }
  },
  methods: {
    changeData () {
      this.$store.commit('changeData')
    },
    getData () {
      this.$store.dispatch('getDataFromAPI')
    },
    getError () {
      this.axios.get('/asdfg')
        .then((data) => {
          console.log(data)
        })
        .catch(err => {
          alert(`No match route on vue-router and server routes, statusText - ${err.response.statusText}`)
        })
    }
  }
}
</script>

<style scoped lang="scss">
h1, h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}

.test-block {
  margin-top: 50px;

  &__btn {
    margin-bottom: 20px;
  }
}

</style>
