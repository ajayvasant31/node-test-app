/**
 * User schema to create a model to store and interact with data from MongoDB
 *
 * Schema contains following fields
 * 1)firstname type String
 * 2)lastname type String
 * 3)email type String - contains extra validation to check if value provided satisfies the email expression
 * 4)password type String
 * 5)profile_image type String
 * 6)password_salt type String
 * 7)timestamp
 *
 * Schema contains additional methods to support operations on User model
 *
 * Static method
 * 1)findByCredentials - finds and returns a user by email and password
 *
 * Object methods
 * 1)generateToken - generates new token for the user
 * 2)toJSON - converts user model object into object
 *
 * Middleware method
 * pre - using to check if the password is changed if yes then generate new password
 */
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const validator = require('validator')
const Schema = mongoose.Schema

const UserSchema = new Schema({
  firstname: {
    type: String,
    required: true
  },
  lastname: {
    type: String,
    required: true
  },
  email: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true,
    validate (value) {
      if (!validator.isEmail(value)) {
        throw new Error('Invalid Email')
      }
    }
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    trim: true
  },
  password_salt: {
    type: String,
    required: true
  },
  profile_image: {
    type: String
  },
  token: {
    type: String
  }
},
{
  timestamps: true
})

UserSchema.statics.findByCredentials = async (email, password) => {
  const user = await Users.findOne({ email })
  if (!user) {
    return null
  }

  const isValid = await bcrypt.compare(password + user.password_salt, user.password)
  if (!isValid) {
    return null
  }
  return user
}

UserSchema.methods.generateToken = async function () {
  const user = this
  const token = jwt.sign({ _id: user._id.toString() }, process.env.TOKEN_SECRET)
  user.token = token
  await user.save()
  return token
}

UserSchema.pre('save', async function (next) {
  const user = this
  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, Number(process.env.SALT_ROUNDS))
  }
  next()
})

UserSchema.methods.toJSON = function () {
  const user = this
  const UserObj = user.toObject()
  delete UserObj.password
  delete UserObj.token
  delete UserObj.password_salt
  return UserObj
}

const Users = mongoose.model('Users', UserSchema)

module.exports = Users
