const express = require('express')
const router = express.Router()
const Account = require('./classes/account')
const Transaction = require('./classes/transaction')
const helper = require('./helpers')
const ApiError = require('./classes/apiError')

let ACCOUNTS = {}

router.post('/create-account', (req, res) => {
  const username = req.body.username
  const passphrase = req.body.passphrase
  try {
    if (ACCOUNTS[username]) {
      throw new ApiError(400, 'Username Already Exists')
    }

    if (passphrase && username) {
      const keyPair = helper.generateKeyPair(passphrase)
      const account = new Account(username, keyPair.publicKey, keyPair.privateKey)
      account.setPassphrase(passphrase)
      ACCOUNTS[username] = account

      res.status('200').json(account)
    }
    else {
      throw new ApiError(400, 'Username nad Passphrase Required')
    }
  }
  catch(error) {
    console.log(error)
    res.statusMessage = error.statusMessage
    res.status(error.statusCode).end()
  }
})

router.post('/sign', (req, res) => {
  const to = req.body.to
  const from = req.body.from
  const amount = req.body.amount
  const passphrase = req.body.passphrase
  try {
    if (amount <= 0) {
      throw new ApiError(400, 'Amount Can Not Be Less Than Zero')
    }
    if (to == from) {
      throw new ApiError(400, 'Can Not Send Funds To Yourself')
    }
  
    if (ACCOUNTS[to] && ACCOUNTS[from]) {
      const transaction = new Transaction(to, from, amount)
      const transactionData = { to: to, from: from, amount: amount }
      const signature = ACCOUNTS[from].signTransaction(transactionData, passphrase)
      transaction.setSignature(signature)
      res.status('200').json(transaction)
    }
    else {
      throw new ApiError(404, 'Accounts Not Found')
    }
  }
  catch(error) {
    console.log(error)
    res.statusMessage = error.statusMessage
    res.status(error.statusCode).end()
  }
})

router.post('/verify', (req, res) => {
  const data = req.body
  const transactionData = { to: data.to, from: data.from, amount: data.amount }
  try {
    if (helper.verify(transactionData, ACCOUNTS[data.from].publicKey, data.signature)) {
      data.isVerified = true
      res.status('200').json(data)
      return
    }
    else {
      throw new ApiError(400, 'Transaction Unverified')
    }
  } 
  catch(error) {
    console.log(error)
    res.statusMessage = error.statusMessage
    res.status(error.statusCode).end()
  }
})

router.post('/send', (req, res) => {
  const data = req.body

  const receiver = ACCOUNTS[data.to]
  const sender = ACCOUNTS[data.from]
  const amount = parseInt(data.amount)

  try {
    if (receiver && sender) {
      const senderBalance = sender.balance
  
      if (senderBalance > amount) {
        sender.balance -= amount
        receiver.balance += amount
        res.status('200').send('Transaction Successful')
      } 
      else {
        throw new ApiError(400, 'Insufficient Funds')
      }
    }
    else {
      throw new ApiError(404, 'Accounts Not Found')
    }
  }
  catch(error) {
    console.log(error)
    res.statusMessage = error.statusMessage
    res.status(error.statusCode).end()
  }
})

router.get('/accounts', (req, res) => {
  try {
    let accounts = []
    for (key in ACCOUNTS) {
      accounts.push(ACCOUNTS[key])
    }
    res.status('200').json(accounts)
  }
  catch(error) {
    console.log(error)
  }
})

module.exports = router