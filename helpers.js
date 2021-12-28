const crypto = require('crypto')

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

module.exports = generateKeyPair