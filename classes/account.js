const crypto = require('crypto')

class Account {
  constructor(publicKey, privateKey) {
    this.balance = 100
    this.publicKey = publicKey
    this.privateKey = privateKey
  }
  signTransaction(data, passphrase) {
    const signature = crypto.privateEncrypt({key: this.privateKey, passphrase: passphrase}, Buffer.from(data, 'utf8')).toString('base64')
    return signature
  }
}

module.exports = Account