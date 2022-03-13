/**
 * Business logic layer
 *
 * Operations list
 * 1)userSignup
 * 2)userLogin
 * 3)userLogout
 * 4)uploadUserProfileImage
 * 5)updateUserDetails
 * 6)getUserDetails
 */

const Users = require('../models/Users')
const randomize = require('randomatic')
const { STATUS_CODE } = require('../common/constants') // Common status codes
const { formErrorResponse, formResponse, validateData } = require('../common/utils') // Util methods to form responses and validate data
const { unlink } = require('fs') // method to delete file from local storage
const unlinkPromise = require('util').promisify(unlink) // promisifying fs method
const path = require('path')
const imagesDirPath = path.join(__dirname, '../assets/profileImages') // Path to profile images

const userModuleController = {
  userSignup: async (req, res, next) => {
    try {
      const salt = randomize('A0a#$*', 10)
      req.body.password_salt = salt
      req.body.password += salt
      const user = new Users(req.body)
      const token = await user.generateToken()
      const result = await user.save()
      if (!validateData(result)) {
        res.send(formErrorResponse(STATUS_CODE.BAD_REQUEST, 'Bad data'))
      } else {
        res.send(formResponse(STATUS_CODE.SUCCESS, 'New user is created', { user, token }))
      }
    } catch (err) {
      res.send(formErrorResponse(STATUS_CODE.FAILURE, err.message))
    }
  },

  userLogin: async (req, res, next) => {
    try {
      const user = await Users.findByCredentials(req.body.email, req.body.password)
      if (!validateData(user)) {
        res.send(formErrorResponse(STATUS_CODE.BAD_REQUEST, 'Invalid credentials'))
      } else {
        const token = await user.generateToken()
        if (validateData(user.profile_image)) {
          user.profile_image = `http://${process.env.HOST_NAME}/user/assets/profile_image/${user.profile_image}`
        }
        res.send(formResponse(STATUS_CODE.SUCCESS, 'User logged in successfully', { user, token }))
      }
    } catch (err) {
      res.send(formErrorResponse(STATUS_CODE.FAILURE, err.message))
    }
  },

  userLogout: async (req, res, next) => {
    try {
      req.user.token = null
      await req.user.save()
      res.send(formResponse(STATUS_CODE.SUCCESS, 'User successfully logged out', {}))
    } catch (err) {
      res.send(formErrorResponse(STATUS_CODE.FAILURE, err.message))
    }
  },

  uploadUserProfileImage: async (req, res, next) => {
    try {
      if (validateData(req.user.profile_image)) {
        await unlinkPromise(`${path.join(imagesDirPath, req.user.profile_image)}`)
      }
      req.user.profile_image = req.file.filename
      await req.user.save()
      const profileImage = `http://${process.env.HOST_NAME}/user/assets/profile_image/${req.file.filename}`
      res.send(formResponse(STATUS_CODE.SUCCESS, 'Profile image updated successfully', { profileImage }))
    } catch (err) {
      res.send(formErrorResponse(STATUS_CODE.FAILURE, err.message))
    }
  },

  updateUserDetails: async (req, res, next) => {
    try {
      const allowedUpdates = ['firstname', 'lastname', 'email', 'password']
      const updates = Object.keys(req.body)
      const isValidUpdate = updates.every((item) => allowedUpdates.includes(item))
      if (!isValidUpdate) {
        return res.send(formErrorResponse(STATUS_CODE.BAD_REQUEST, 'Invalid update operation'))
      }

      updates.forEach((update) => {
        if (update === 'password') {
          const salt = randomize('A0a#$*', 10)
          req.user.password_salt = salt
          req.user[update] = req.body[update] + salt
        } else {
          req.user[update] = req.body[update]
        }
      })

      await req.user.save()

      res.send(formResponse(STATUS_CODE.SUCCESS, 'User details updated successfully', { user: req.user }))
    } catch (err) {
      res.send(formErrorResponse(STATUS_CODE.FAILURE, err.message))
    }
  },

  getUserDetails: async (req, res, next) => {
    try {
      if (validateData(req.user.profile_image)) {
        req.user.profile_image = `http://${process.env.HOST_NAME}/user/assets/profile_image/${req.user.profile_image}`
      }
      res.send(formResponse(STATUS_CODE.SUCCESS, 'User details fetched successfully', { user: req.user }))
    } catch (err) {
      res.send(formErrorResponse(STATUS_CODE.FAILURE, err.message))
    }
  }
}

module.exports = userModuleController
