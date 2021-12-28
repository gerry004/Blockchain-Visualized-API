const express = require('express')
const router = express.Router()
const Account = require('./classes/account')
const generateKeyPair = require('./helpers')

// let ACCOUNTS_MAPPING = {}

router.post('/create-account', (req, res) => {
  const passphrase = req.body.passphrase

  if (passphrase) {
    const keyPair = generateKeyPair(passphrase)
    const publicKey = keyPair.publicKey
    const privateKey = keyPair.privateKey

    const account = new Account(publicKey, privateKey)
    res.json(account)
  }
  else {
    res.status('400').send('Passphrase is required to create an account.')
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