/**
 * This file binds all the parts of the app
 * Creates an instance of express app and registers routes to serve and exports it so it can be
 * used in index.js file to start the app
 */

require('./db/db-connection') // Creates connection with mongoDB
const express = require('express')
const usersRoute = require('./router/user-routes')
const path = require('path')
const assets = path.join(__dirname, './assets')
const profileImages = path.join(assets, '/profileImages')
const app = express()

app.use('/user/assets/profile_image', express.static(profileImages)) // Instructing express to serve static content from this path
app.use(express.json()) // Middleware provided by express - Parses the JSON coming in as request body
app.use(usersRoute)

module.exports = app
