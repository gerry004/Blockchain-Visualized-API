const express = require('express')
const router = express.Router()
const Account = require('./classes/account')
const Transaction = require('./classes/transaction')
const helper = require('./helpers')
const crypto = require('crypto')

let ACCOUNTS = {}

router.post('/create-account', (req, res) => {
  const username = req.body.username
  const passphrase = req.body.passphrase

  if (ACCOUNTS[username]) {
    res.statusMessage = "Username Already Exists."
    res.status('400').end()
    return
  }

  if (passphrase && username) {
    const keyPair = helper.generateKeyPair(passphrase)
    const account = new Account(username, keyPair.publicKey, keyPair.privateKey)
    account.setPassphrase(passphrase)
    ACCOUNTS[username] = account

    res.status('200').json(account)
  }
  else {
    res.statusMessage = "Username and passphrase is required to create an account."
    res.status('400').end()
  }
})

router.post('/sign', (req, res) => {
  const to = req.body.to
  const from = req.body.from
  const amount = req.body.amount
  const passphrase = req.body.passphrase

  if (amount <= 0) {
    res.statusMessage = 'ValueError: Amount Can Not Be Less Than Zero'
    res.status('400').end()
    return
  }
  if (to == from) {
    res.statusMessage = 'Cannot Send Funds to Yourself'
    res.status('400').end()
    return
  }

  if (ACCOUNTS[to] && ACCOUNTS[from] && passphrase) {
    const transaction = new Transaction(to, from, amount)
    const transactionData = { to: to, from: from, amount: amount }
    const signature = ACCOUNTS[from].signTransaction(transactionData, passphrase)
    if (signature) {
      transaction.setSignature(signature)
      res.status('200').json(transaction)
      return
    }
    else {
      res.statusMessage = 'Could Not Sign Transaction: Passphrase Incorrect'
      res.status('400').end()
      return
    }
  }
  else {
    res.statusMessage = "Accounts Not Found"
    res.status('404').end()
    return
  }
})

router.post('/verify', (req, res) => {
  const data = req.body
  const transactionData = { to: data.to, from: data.from, amount: data.amount }
  if (helper.verify(transactionData, ACCOUNTS[data.from].publicKey, data.signature)) {
    data.isVerified = true
    res.status('200').json(data)
    return
  }
  else {
    res.statusMessage = 'Transaction Unverified'
    res.status('400').end()
    return
  }
})

router.post('/send', (req, res) => {
  const data = req.body

  const receiver = ACCOUNTS[data.to]
  const sender = ACCOUNTS[data.from]
  const amount = parseInt(data.amount)
  if (receiver && sender) {
    const senderBalance = sender.balance

    if (senderBalance > amount) {
      sender.balance -= amount
      receiver.balance += amount
      res.status('200').send('Transaction Successful.')
    } 
    else {
      res.status('400').send('Insufficient Funds.')
    }
  }
  else {
    res.statusMessage = 'Accounts Not Found'
    res.status('404').end()
    return
  }
})

router.get('/accounts', (req, res) => {
  let accounts = []
  for (key in ACCOUNTS) {
    accounts.push(ACCOUNTS[key])
  }
  res.status('200').json(accounts)
})

module.exports = router