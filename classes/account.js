const crypto = require('crypto')

class Account {
  constructor(publicKey, privateKey) {
    this.balance = 100
    this.publicKey = publicKey
    this.privateKey = privateKey
  }
  // data = { hashedData, hashedPassphrase }
  signTransaction(data, passphrase) {
    const signature = crypto.privateEncrypt({key: this.privateKey, passphrase: passphrase}, Buffer.from(data, 'utf-8'))
    return signature
  }

  // data = { amount: number, publicAddress: fromPublicAddress, signature: privatelyEncrypted }
  // -> boolean
  // const verifyTransaction = (data) => {
  //   const signature = data[signature]
  //   const publicKey = data[publicKey]
  //   const decryptedMessage = crypto.publicDecrypt(publicKey, Buffer.from(message))
  //   return data[amount] === decryptedMessage
  // }

}

module.exports = Account