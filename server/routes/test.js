import test from '../controllers/test.js'
import koaRouter from 'koa-router'
const router = koaRouter()

router.get('/test-data', test.testData)

export default router
