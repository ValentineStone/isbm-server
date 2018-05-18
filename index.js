const express = require('express')
const jwt = require('express-jwt')
const handleRequest = require('./handleRequest.js')

const app = express()

const cors = (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')//, DELETE, HEAD, PUT, PATCH')
  if (req.method === 'OPTIONS') {
    res.sendStatus(200)
  }
  else
    next()
}

app.use(
  cors,
  jwt({
    secret: 'pinkiepie',
    requestProperty: 'auth',
    credentialsRequired: false
  }),
  express.json({ strict: false }),
  handleRequest
)

app.listen(4000, '0.0.0.0', () => {
  console.log('ISBM-Server is listening @0.0.0.0:4000')
})