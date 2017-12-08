import { testData } from '../controllers/get-data'
import koaRouter from 'koa-router'
const router = koaRouter()

router.get('/test-data', testData)

export default router
