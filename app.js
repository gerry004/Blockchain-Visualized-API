const express = require('express')
const app = express()

// Using Body-Parser as Middleware
const parser = require("body-parser");
app.use(parser.urlencoded({ extended: false }));
app.use(parser.json());

// Enable Cross Origin Requests
const cors = require('cors');
const options = {
  origin: ['http://localhost:8080', 'http://localhost:3000', 'https://gerry004.github.io']
  }
app.use(cors(options))

// Register Routes
const crypto = require('./endpoints')
app.use('/crypto/', crypto)

// Start Listening on Port
app.listen(process.env.PORT || 3000, () => {
  console.log('Listening at http://localhost:3000')
})