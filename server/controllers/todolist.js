import todolist from '../models/todolist.js'

const getTodolist = async function (ctx) {
  const id = ctx.params.id // Get the url passed in the parameters in the id
  const result = await todolist.getTodolistById(id) // By await "synchronous" to return the query results
  ctx.body = {
    success: true,
    result // The result of the request will be returned to the body of the response
  }
}

const createTodolist = async function (ctx) {
  const data = ctx.request.body
  const success = await todolist.createTodolist(data)
  ctx.body = {
    success
  }
}

const removeTodolist = async function (ctx) {
  const id = ctx.params.id
  const userId = ctx.params.userId
  const success = await todolist.removeTodolist(id, userId)

  ctx.body = {
    success
  }
}

const updateTodolist = async function (ctx) {
  const id = ctx.params.id
  const userId = ctx.params.userId
  let status = ctx.params.status
  status === '0' ? status = true : status = false // State reversal (update)

  const success = await todolist.updateTodolist(id, userId, status)

  ctx.body = {
    success
  }
}

export default {
  getTodolist,
  createTodolist,
  removeTodolist,
  updateTodolist
}
