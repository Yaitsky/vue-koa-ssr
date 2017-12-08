import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
  displayName: {
    type: String,
    required: 'Необходимо указать имя пользователя'
  },
  email: {
    type: String,
    unique: 'Пользователь с таким email ({VALUE}) уже существует',
    required: 'E-mail пользователя не должен быть пустым',
    validate: [
      {
        validator: function checkEmail (value) {
          return this.deleted ? true : /^[-.\w]+@([\w-]+\.)+[\w-]{2,12}$/.test(value)
        },
        msg: 'Укажите, пожалуйста, корректный email.'
      }
    ]
  }
})

export default mongoose.model('User', userSchema)
