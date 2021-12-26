const express = require('express')
const router = express.Router()
const crypto = require('crypto')
const Account = require('./account')

let ACCOUNTS_MAPPING = {}

router.post('/create-account', (req, res) => {
  const passphrase = req.body.passphrase

  if (passphrase) {
    const keyPair = generateKeyPair(passphrase)
    const publicKey = keyPair.publicKey
    const privateKey = keyPair.privateKey

    const account = new Account(publicKey, privateKey, passphrase)
    ACCOUNTS_MAPPING[publicKey] = account
    res.json({ balance: account.getBalance(), public: publicKey, private: privateKey })
  }
  else {
    res.status('400').send('Passphrase is required to create an account.')
  }
})

router.post('/hash', (req, res) => {
  const data = req.body
  const ordered = sortObjectByKey(data)
  const hash = crypto.createHash('sha256')
  hash.update(JSON.stringify(ordered))
  res.status('200').json({hash: hash.digest('hex')})
})

router.get('/accounts', (req, res) => {
  let accounts = []
  for (key in ACCOUNTS_MAPPING) {
    let account = {}
    account['balance'] = ACCOUNTS_MAPPING[key].getBalance()
    account['publicKey'] = key
    accounts.push(account)
  }
  res.json(accounts)
})

function sortObjectByKey(unorderedObject) {
  const orderedObject = Object.keys(unorderedObject).sort().reduce(
    (obj, key) => { 
      obj[key] = unorderedObject[key]; 
      return obj;
    }, 
    {}
  );
  return orderedObject
}

function generateKeyPair(passphrase) {
  const keyPairOptions = {
    modulusLength: 520,
    publicKeyEncoding: {
      type: 'spki',
      format: 'pem'
    },
    privateKeyEncoding: {
      type: 'pkcs8',
      format: 'pem',
      cipher: 'aes-256-cbc',
      passphrase: passphrase
    }
  }
  const keyPair = crypto.generateKeyPairSync('rsa', keyPairOptions)
  return { privateKey: keyPair.privateKey, publicKey: keyPair.publicKey }
}

module.exports = router