import user from '../models/user.js'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'

const getUserInfo = async function (ctx) {
  const id = ctx.params.id // Get the url passed in the parameters in the id
  const result = await user.getUserById(id) // By await "synchronous" to return the query results
  ctx.body = result // The result of the request will be returned to the body of the response
}

const postUserAuth = async function (ctx) {
  const data = ctx.request.body // post data exists request.body
  const userInfo = await user.getUserByName(data.name)
  if (userInfo != null) { // If no such user will return null
    if (!bcrypt.compareSync(data.password, userInfo.password)) {
      ctx.body = {
        success: false, // The success flag is for the convenience of the front-end to determine whether the return is correct or not
        info: '密码错误！'
      }
    } else {
      const userToken = {
        name: userInfo.user_name,
        id: userInfo.id
      }
      const secret = 'vue-koa-demo' // Specify the key
      const token = jwt.sign(userToken, secret) // Issue token
      ctx.body = {
        success: true,
        token: token // Return token
      }
    }
  } else {
    ctx.body = {
      success: false,
      info: '用户不存在！' // If the user does not exist the return user does not exist
    }
  }
}

export default {
  getUserInfo,
  postUserAuth
}
