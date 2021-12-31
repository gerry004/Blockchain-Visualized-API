const express = require('express')
const router = express.Router()
const Account = require('./classes/account')
const Transaction = require('./classes/transaction')
const helper = require('./helpers')
const crypto = require('crypto')
const { send } = require('process')

let ACCOUNTS = {}

router.post('/create-account', (req, res) => {
  const username = req.body.username
  const passphrase = req.body.passphrase

  if (passphrase && username) {
    const passphraseHash = helper.hash(passphrase)
    const keyPair = helper.generateKeyPair(passphraseHash)
    const publicKey = keyPair.publicKey
    const privateKey = keyPair.privateKey

    const account = new Account(username, publicKey, privateKey)
    account.setPassphrase(passphraseHash)
    ACCOUNTS[username] = account

    res.status('200').json(account)
  }
  else {
    res.statusMessage = "Username and passphrase is required to create an account."
    res.status('400').end()
  }
})

router.post('/sign', (req, res) => {
  const data = req.body

  if (data.amount <= 0) {
    res.statusMessage = 'ValueError: Amount Can Not Be Less Than Zero'
    res.status('400').end()
    return
  }
  if (data.to == data.from) {
    res.statusMessage = 'Cannot Send Funds to Yourself'
    res.status('400').end()
    return
  }

  const transaction = new Transaction(data.to, data.from, data.amount)
  const transactionToHash = { to: transaction.to, from: transaction.from, amount: transaction.amount }

  const hashedData = helper.hash(transactionToHash)
  const passphraseHash = helper.hash(data.passphrase)

  const signature = ACCOUNTS[transaction.from].signTransaction(hashedData, passphraseHash)
  transaction.setSignature(signature)

  res.status('200').json(transaction)
})

router.post('/verify', (req, res) => {
  const transaction = req.body
  const transactionToHash = { to: transaction.to, from: transaction.from, amount: transaction.amount }
  const hashedData = helper.hash(transactionToHash)
  const decrypted = crypto.publicDecrypt(ACCOUNTS[transaction.from].publicKey, Buffer.from(transaction.signature, 'base64')).toString()
  if (hashedData == decrypted) {
    console.log('Transaction Verified!')
    transaction.isVerified = true
    res.status('200').json(transaction)
  }
  else {
    res.status('400').send('Transaction is not verified.')
  }
})

router.post('/send', (req, res) => {
  const data = req.body

  const receiver = data.to
  const sender = data.from
  const amount = parseInt(data.amount)

  const senderBalance = ACCOUNTS[sender].balance

  if (senderBalance > amount) {
    ACCOUNTS[sender].balance -= amount
    ACCOUNTS[receiver].balance += amount
    res.status('200').send('Transaction Successful.')
  } 
  else {
    res.status('400').send('Insufficient Funds.')
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