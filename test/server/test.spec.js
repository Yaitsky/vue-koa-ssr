import server from '../../app.js'
// import request from 'supertest'

afterEach(() => {
  server.close()
})

test('hello', async () => {
  expect(true).toBe(true)
})
