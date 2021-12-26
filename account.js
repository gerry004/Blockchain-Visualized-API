const crypto = require('crypto')

function Account(publicKey, privateKey, passphrase) {
  // data
  balance = 0

  // power
  const getBalance = () => balance
  
  const printPublic = () => console.log(publicKey)
  const printPrivate = () => console.log(privateKey)

  const publicEncrypt = (message) => {
    const encryptedMessage = crypto.publicEncrypt(publicKey, Buffer.from(message))
    return encryptedMessage
  }

  const privateEncrypt = (message) => {
    const encryptedMessage = crypto.privateEncrypt({key: privateKey, passphrase: passphrase}, Buffer.from(message))
    return encryptedMessage
  }

  const publicDecrypt = (message) => {
    const decryptedMessage = crypto.publicDecrypt(publicKey, Buffer.from(message))
    return decryptedMessage
  }

  const privateDecrypt = (message) => {
    const decryptedMessage = crypto.privateDecrypt({key: privateKey, passphrase: passphrase}, Buffer.from(message))
    return decryptedMessage
  }

  //api
  return {
    getBalance,
    publicEncrypt,
    privateEncrypt,
    privateDecrypt,
    publicDecrypt,
    printPublic,
    printPrivate
  }
}

module.exports = Account