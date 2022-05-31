const express = require('express')
const setupApp = require('./setup')

const app = express()

app.get('/', (req, res) => {
  res.send('hello world')
})

setupApp(app)

module.exports = app
