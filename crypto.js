const express = require('express')
const router = express.Router()
const crypto = require('crypto')

router.get('/generate-key-pair', (req, res) => {
  const passphrase = "What is a passphrase?"

  const keyPairOptions = {
    modulusLength: 2048,
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
  
  const keyPair = crypto.generateKeyPairSync('rsa', keyPairOptions);
  
  const privateKey = keyPair.privateKey;
  const publicKey = keyPair.publicKey;
  res.json({privateKey: privateKey, publicKey: publicKey})
})

router.post('/hash', (req, res) => {
  const data = req.body
  const ordered = sortObjectByKey(data)
  const hash = crypto.createHash('sha256')
  hash.update(JSON.stringify(ordered))
  res.status('200').json({hash: hash.digest('hex')})
})

function sortObjectByKey(unorderedObject) {
  const ordered = Object.keys(unorderedObject).sort().reduce(
    (obj, key) => { 
      obj[key] = unordered[key]; 
      return obj;
    }, 
    {}
  );
  return ordered
}

module.exports = router