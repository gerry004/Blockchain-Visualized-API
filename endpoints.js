const express = require('express')
const router = express.Router()
const Account = require('./classes/account')
const Transaction = require('./classes/transaction')
const helper = require('./helpers')
const crypto = require('crypto')

let ACCOUNTS = {}

router.post('/create-account', (req, res) => {
  const passphrase = req.body.passphrase

  if (passphrase) {
    const keyPair = helper.generateKeyPair(helper.hash(passphrase))
    const publicKey = keyPair.publicKey
    const privateKey = keyPair.privateKey

    const account = new Account(publicKey, privateKey)

    const hashedPassphrase = helper.hash(passphrase)
    ACCOUNTS[hashedPassphrase] = account

    res.json(account)
  }
  else {
    res.status('400').send('Passphrase is required to create an account.')
  }
})

router.post('/sign', (req, res) => {
  const data = req.body
  const transaction = new Transaction(data.to, data.from, data.amount)
  const transactionToHash = { to: transaction.to, from: transaction.from, amount: transaction.amount }
  
  const hashedData = helper.hash(transactionToHash)
  const hashedPassphrase = helper.hash(data.passphrase)

  const signature = ACCOUNTS[hashedPassphrase].signTransaction(hashedData, hashedPassphrase)
  transaction.setSignature(signature)
  res.status('200').json(transaction)
})

router.post('/verify', (req, res) => {
  const transaction = req.body
  const transactionToHash = { to: transaction.to, from: transaction.from, amount: transaction.amount }
  const hashedData = helper.hash(transactionToHash)
  const decrypted = crypto.publicDecrypt(transaction.from, Buffer.from(transaction.signature, 'base64')).toString()
  if (hashedData == decrypted) {
    console.log('Transaction Verified!')
    transaction.isVerified = true
    res.status('200').json(transaction)
  }
  else {
    res.status('400').send('Transaction is not verified.')
  }
})

// req.body = { to: public, from: public, amount: number }
router.post('/send', (req, res) => {
  const receiver = req.body.to 
  const sender = req.body.from
  const amount = req.body.amount
  console.log(receiver, sender, amount)

  const senderBalance = ACCOUNTS_MAPPING[sender].getBalance()
  console.log(senderBalance)
  if (senderBalance > amount) {
    console.log('Sufficient Funds')
  } else {
    res.status('400').send('Insufficient Funds.')
  }
})

// router.post('/hash', (req, res) => {
//   const data = req.body
//   const ordered = sortObjectByKey(data)
//   const hash = crypto.createHash('sha256')
//   hash.update(JSON.stringify(ordered))
//   res.status('200').json({hash: hash.digest('hex')})
// })

// router.get('/accounts', (req, res) => {
//   let accounts = []
//   for (key in ACCOUNTS_MAPPING) {
//     let account = {}
//     account['balance'] = ACCOUNTS_MAPPING[key].getBalance()
//     account['publicKey'] = key
//     accounts.push(account)
//   }
//   res.json(accounts)
// })

module.exports = router