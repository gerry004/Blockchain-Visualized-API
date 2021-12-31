const crypto = require('crypto')
const helper = require('../helpers')

class Account {
  #passphraseHash = null

  constructor(username, publicKey, privateKey) {
    this.balance = 100
    this.username = username
    this.publicKey = publicKey
    this.privateKey = privateKey
  }
  setPassphrase(passphrase) {
    this.#passphraseHash = helper.hash(passphrase)
  }
  authenticatePassphrase(passphrase) {
    const passphraseHash = helper.hash(passphrase)
    if (this.#passphraseHash === passphraseHash) {
      return true
    }
    return false
  }
  signTransaction(data, passphrase) {
    if (this.authenticatePassphrase(passphrase)) {
      const hashedData = helper.hash(data)
      const signature = crypto.privateEncrypt({key: this.privateKey, passphrase: this.#passphraseHash}, Buffer.from(hashedData, 'utf8')).toString('base64')
      return signature
    }
    else {
      return false
    }
  }
}

module.exports = Account