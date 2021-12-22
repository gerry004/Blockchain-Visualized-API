const express = require('express')
const app = express()
const cors = require('cors');
const port = 3000

const options = {
  origin: ['http://localhost:8080', 'http://localhost:3000', 'https://gerry004.github.io']
  }

app.use(cors(options))

app.get('/hello', (req, res) => {
  console.log("hello world route")
  res.json({data: 'Hello World!'})
})
const crypto = require('./crypto')

app.use('/crypto/', crypto)

app.listen(process.env.PORT || port, () => {
  console.log(`Listening at http://localhost:${port}`)
})