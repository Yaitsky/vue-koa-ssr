import db from '../config/db.js' // Introduced todolist table structure
const todoModel = '../schema/list.js'
const TodolistDb = db.Todolist // Introduced into the database

const Todolist = TodolistDb.import(todoModel)

const getTodolistById = async function (id) {
  const todolist = await Todolist.findAll({ // Find all todolist
    where: {
      user_id: id
    },
    attributes: ['id', 'content', 'status'] // Just return the results of these three fields can be
  })

  return todolist // Return data
}

const createTodolist = async function (data) {
  await Todolist.create({
    user_id: data.id,
    content: data.content,
    status: data.status
  })
  return true
}

const removeTodolist = async function (id, userId) {
  const result = await Todolist.destroy({
    where: {
      id,
      user_id: userId
    }
  })
  return result === 1 // Returns 1 if the record was successfully deleted, 0 otherwise
}

const updateTodolist = async function (id, userId, status) {
  const result = await Todolist.update(
    {
      status
    },
    {
      where: {
        id,
        user_id: userId
      }
    }
  )
  return result[0] === 1 // Returns an array, the successful update entry is 1 otherwise 0. Since only one entry is updated, only one element is returned
}

export default {
  getTodolistById,
  createTodolist,
  removeTodolist,
  updateTodolist
}
