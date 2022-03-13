/**
 * This file is to start the server and listen on PORT defined in dev.env file
 * Default is PORT is 3000
 */

const app = require('./app')
const port = process.env.PORT || 3000

app.listen(port, () => {
  console.log('Server is listening on port', port)
})
