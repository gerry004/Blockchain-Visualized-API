// const crypto = require('crypto')

class Account {
  constructor(publicKey, privateKey) {
    this.balance = 100
    this.publicKey = publicKey
    this.privateKey = privateKey
  }

  // data = { amount: number, publicAddress: fromPublicAddress }
  // -> data = { amount: number, publicAddress: fromPublicAddress, signature: privatelyEncrypted }
  // const signTransaction = (data) => {
  //   const amount = data[amount]
  //   const signature = crypto.privateEncrypt({key: privateKey, passphrase: passphrase}, Buffer.from(amount))
  //   data[signature] = signature
  //   return data
  // }

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