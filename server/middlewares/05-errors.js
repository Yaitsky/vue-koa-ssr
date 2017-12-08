module.exports = async (ctx, next) => {
  try {
    await next()
  } catch (err) {
    if (err.status === 401) {
      ctx.status = 401
      ctx.body = {
        success: false,
        token: null,
        info: 'Protected resource, use Authorization header to get access'
      }
    } else if (err.status === 404) {
      ctx.status = 404
      ctx.body = { message: 'Not found' }
    } else {
      console.log('No handled server error ', err)
      throw err
    }
  }
}
