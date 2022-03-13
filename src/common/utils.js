/**
 * Module to define all the methods which can be commonly used in multiple modules
 */
const multer = require('multer') // Middleware to process files
const path = require('path')
const imagesDirPath = path.join(__dirname, '../assets/profileImages') // Path to store profile images

// Form a success response
const formResponse = (statusCode, message, data) => {
  return {
    statusCode: statusCode,
    body: {
      message,
      data
    }
  }
}
// Form an error response
const formErrorResponse = (statusCode, errorMessage) => {
  return {
    statusCode: statusCode,
    body: {
      errorMessage
    }
  }
}
// Validate data for common validations
const validateData = (value) => {
  if (value === null) { return false }
  if (value === undefined) { return false }
  if (value === '') { return false }

  return true
}

/**
 * Configuring multer middleware to set storage type,maximum allowed file size,allowed file types
 * filenames,
 */
const upload = multer({
  limits: {
    fileSize: 1000000
  },
  fileFilter (req, file, cb) {
    if (!file.originalname.match(/\.(png|jpg|jpeg)$/)) {
      return cb(new Error('Only jpg,jpeg,png files are allowed'))
    }
    cb(undefined, true)
  },
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, imagesDirPath)
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null, uniqueSuffix + '.' + file.originalname.split('.')[1])
    }
  })
})

module.exports = { formErrorResponse, formResponse, validateData, upload }
