<template>
  <div id="app">
    <v-app>
      <img class="image" src="./assets/logo.png">
      <router-view></router-view>
    </v-app>
  </div>
</template>

<script>
export default {
  name: 'app'
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
.image {
  width: 200px;
  height: auto;
  margin: 50px auto;
}
</style>
