/**
 * User routes to perform different operations for user module
 * 1) /user/signup - Singup new user
 * 2) /user/login - Login
 * 3) /user/logout - Logout
 * 4) /user/profileImage - Upload or Update user profile image
 * 5) /user/updateDetails - Update user profile details i.e. [firstname,lastname,email,password]
 * 6) /user/me - Get details of the currently logged in user
 */

const express = require('express')
const route = express.Router()
const auth = require('../middleware/auth') // Middleware to authenticate requests
const userModuleController = require('../controllers/user-controller') // Contoller logic to perform actual operations
const { upload } = require('../common/utils') // Common helper methods - upload : used to save images to localDisk

route.post('/user/signup', userModuleController.userSignup)
route.post('/user/login', userModuleController.userLogin)
route.post('/user/logout', auth, userModuleController.userLogout)
route.post('/user/profileImage', auth, upload.single('profile_image'), userModuleController.uploadUserProfileImage)
route.post('/user/updateDetails', auth, userModuleController.updateUserDetails)
route.get('/user/me', auth, userModuleController.getUserDetails)

module.exports = route
