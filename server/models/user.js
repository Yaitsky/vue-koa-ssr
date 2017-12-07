import db from '../config/db.js' // Introduced the user's table structure
const userModel = '../schema/user.js'
const TodolistDb = db.Todolist // Introduced into the database

const User = TodolistDb.import(userModel) // Import the table structure with the import method of sequelize, instantiated User.

const getUserById = async function (id) { // Note that async function instead of function. Async await is required for functions that need to wait for the promise result.
  const userInfo = await User.findOne({ // With await control asynchronous operation, the data returned by the Promise object is returned. It also achieved the "synchronous" wording to obtain asynchronous IO operation data
    where: {
      id: id
    }
  })

  return userInfo // Return data
}

const getUserByName = async function (name) {
  const userInfo = await User.findOne({
    where: {
      user_name: name
    }
  })

  return userInfo
}

export default {
  getUserById, // Export getUserById method will be called in the controller
  getUserByName
}
