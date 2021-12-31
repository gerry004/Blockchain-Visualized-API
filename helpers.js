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
    modulusLength: 2048,
    publicKeyEncoding: {
      type: 'spki',
      format: 'pem'
    },
    privateKeyEncoding: {
      type: 'pkcs8',
      format: 'pem',
      cipher: 'aes-256-cbc',
      passphrase: hash(passphrase)
    }
  }
  const keyPair = crypto.generateKeyPairSync('rsa', keyPairOptions)
  return { privateKey: keyPair.privateKey, publicKey: keyPair.publicKey }
}

function hash(data) {
  const hash = crypto.createHash('sha256')

  if (typeof(data) == "object") {
    const orderedObject = sortObjectByKey(data)
    hash.update(JSON.stringify(orderedObject))
    return hash.digest('hex')
  }
  else {
    hash.update(JSON.stringify(data))
    return hash.digest('hex')
  }
}

function verify(data, publicKey, signature) {
  const hashed = hash(data)
  const decrypted = crypto.publicDecrypt(publicKey, Buffer.from(signature, 'base64')).toString()
  if (hashed === decrypted) {
    return true
  }
  return false

}

module.exports = { generateKeyPair, hash, verify }