const Users = require('../models/Users')
const jwt = require('jsonwebtoken')

// Middleware - Intercept Request and verify the token suplied by client
const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '') // Getting the token from header
    const decode = await jwt.verify(token, process.env.TOKEN_SECRET) // Decoding the jwt token
    const user = await Users.findOne({ _id: decode._id, token }) // getting the user details

    if (!user) {
      throw new Error('No user found') // In case no user is found return error
    }
    req.user = user
    req.token = token

    next() //   passing control to the controller after getting the user details
  } catch (err) {
    res.status(401).send('Invalid Authentication')
  }
}

module.exports = auth
