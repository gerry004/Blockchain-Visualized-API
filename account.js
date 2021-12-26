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


// const createAccount = (passphrase) => {
//   const keyPairOptions = {
//     modulusLength: 2048,
//     publicKeyEncoding: {
//       type: 'spki',
//       format: 'pem'
//     },
//     privateKeyEncoding: {
//       type: 'pkcs8',
//       format: 'pem',
//       cipher: 'aes-256-cbc',
//       passphrase: passphrase
//     }
//   }
  
//   const keyPair = crypto.generateKeyPairSync('rsa', keyPairOptions)
//   const privateKey = keyPair.privateKey
//   const publicKey = keyPair.publicKey

//   const account = new Account(publicKey, privateKey, passphrase)
//   return account
// }

// const account = createAccount('passphrase')
// console.log(account)

// account.printPublic()
// account.printPrivate()

// const privateEncrypted = account.privateEncrypt('this is a message')
// console.log(privateEncrypted)

// const publicDecrypted = account.publicDecrypt(privateEncrypted)
// console.log(publicDecrypted.toString())

// const publicEncrypted = account.publicEncrypt('this is a message')
// console.log(publicEncrypted)

// const privateDecrypted = account.privateDecrypt(publicEncrypted)
// console.log(privateDecrypted.toString())

module.exports = Account