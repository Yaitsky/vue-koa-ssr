import favicon from 'koa-favicon'
import path from 'path'

module.exports = favicon(path.resolve(__dirname, 'src/assets/logo.png'))
