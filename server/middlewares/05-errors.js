module.exports = async (ctx, next) => {
  try {
    await next()
  } catch (e) {
    const preferredType = ctx.accepts('html', 'json')
    ctx.set('X-Content-Type-Options', 'nosniff')
    if (e.status) {
      ctx.status = e.status

      if (preferredType === 'json') {
        ctx.body = {
          error: e.message
        }
      } else {
        ctx.body = e.message
      }
    } else if (e.name === 'ValidationError') {
      const errors = {}

      ctx.status = 400
      for (let field in e.errors) {
        errors[field] = e.errors[field].message
      }

      if (preferredType === 'json') {
        ctx.body = {
          errors: errors
        }
      } else {
        ctx.body = 'Некорректные данные.'
      }
    } else {
      ctx.body = 'Error 500'
      ctx.status = 500
      console.error(e.message, e.stack)
    }
  }
}
