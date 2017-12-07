import '../../env'
import Sequelize from 'sequelize'

const Todolist = new Sequelize(`mysql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@localhost/todolist`, {
  define: {
    timestamps: false // Cancel Sequelzie automatically adds a timestamp to the datasheet（createdAt以及updatedAt）
  }
})

export default {
  Todolist // Exposing the Todolist to the interface makes the Model call easy
}
