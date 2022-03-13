/**
 * Using mongoose library to connect to mongoDB by passing connection URL and options
 */

const mongoose = require('mongoose')
mongoose.connect(process.env.DB_URL, {})
