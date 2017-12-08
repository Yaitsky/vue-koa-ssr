import './env'
import Koa from 'koa'
import path from 'path'
import fs from 'fs'
import serve from 'koa-static'
import Router from 'koa-router'
import { createBundleRenderer } from 'vue-server-renderer'

// import route modules
import test from './server/routes/test.js'

const app = new Koa()
const router = Router()
const isProd = process.env.NODE_ENV === 'production'
const port = process.env.PORT || 8889
const resolve = file => path.resolve(__dirname, file)
const templatePath = resolve('./index.html')
const middlewares = fs.readdirSync(path.join(__dirname, './server/middlewares')).sort()
let renderer

// SSR render functions
const createRenderer = (bundle, options) => {
  return createBundleRenderer(bundle, Object.assign(options, {
    runInNewContext: false
  }))
}
const renderToStringPromise = (context, s) => {
  return new Promise((resolve, reject) => {
    renderer.renderToString(context, (err, html) => {
      if (err) {
        reject(err)
      }
      if (!isProd) {
        console.log(`Render template in ${Date.now() - s}ms`)
      }
      resolve(html)
    })
  })
}
const render = async (ctx, next) => {
  if (!renderer) {
    ctx.body = 'waiting for compilation... refresh in a moment.'
    return ctx.body
  } else {
    let req = ctx.req
    ctx.type = 'html'
    const s = Date.now()
    let context = { url: req.url }
    ctx.body = await renderToStringPromise(context, s)
    return ctx.body
  }
}
if (isProd) {
  const template = fs.readFileSync(templatePath, 'utf-8')
  const bundle = require('./dist/vue-ssr-server-bundle.json')
  const clientManifest = require('./dist/vue-ssr-client-manifest.json')
  renderer = createRenderer(bundle, {
    template,
    clientManifest
  })
  app.use(serve(path.resolve('dist'), {
    hidden: 'index.html'
  }))
} else {
  require('./build/setup-dev-server')(app, (bundle, template) => {
    renderer = createRenderer(bundle, { template })
  })
}

// middlewares
middlewares.forEach(middleware => app.use(require('./server/middlewares/' + middleware)))

// routes
router.use('/test', test.routes())
router.get('*', async (ctx, next) => render(ctx, next))

app.use(router.routes())
app.use(router.allowedMethods())

app.on('error', (err, ctx) => console.log('server error', err))

export default app.listen(port, () => {
  console.log(`Koa is listening in ${port}`)
})
