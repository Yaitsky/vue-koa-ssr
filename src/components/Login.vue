<template>
  <el-row class="content">
    <el-col :xs="24" :sm="{span: 6,offset: 9}">
      <span class="title">
       Login please
      </span>
      <el-row>
        <el-input
          v-model="account"
          placeholder="account"
          type="text">
        </el-input>
        <el-input
          v-model="password"
          placeholder="password"
          type="password"
          @keyup.enter.native="loginToDo">
        </el-input>
        <el-button type="primary" @click="loginToDo">log in</el-button>
      </el-row>
    </el-col>
  </el-row>
</template>

<script>
export default {
  data () {
    return {
      account: '',
      password: ''
    }
  },
  methods: {
    loginToDo () {
      let obj = {
        name: this.account,
        password: this.password
      }
      const result = this.$http.post('/auth/user', obj) // Send the information to the backend
      result.then((res) => {
        if (res.data.success) { // If successful
          sessionStorage.setItem('demo-token', res.data.token) // Save the token with sessionStorage
          this.$message({ // Login is successful, the prompt is displayed
            type: 'success',
            message: 'login successful!'
          })
          this.$router.push('/todolist') // Into todolist page, log in successfully
        } else {
          this.$message.error(res.data.info) // Login failed, the prompt is displayed
          sessionStorage.setItem('demo-token', null) // Clear the token
        }
      }, (err) => {
        console.log(err)
        this.$message.error('Request error!')
        sessionStorage.setItem('demo-token', null) // Clear the token
      })
      return result
    }
  }
}
</script>

<style lang="stylus" scoped>
  .el-row.content
    padding 16px
  .title
    font-size 28px
  .el-input
    margin 12px 0
  .el-button
    width 100%
    margin-top 12px
</style>
