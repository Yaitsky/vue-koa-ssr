import { testData } from '../controllers/test.js'
import koaRouter from 'koa-router'
const router = koaRouter()

router.get('/test-data', testData)

export default router
