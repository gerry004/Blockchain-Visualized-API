const crypto = require('crypto')

class Account {
  #passphraseHash = null

  constructor(username, publicKey, privateKey) {
    this.balance = 100
    this.username = username
    this.publicKey = publicKey
    this.privateKey = privateKey
  }
  setPassphrase(passphraseHash) {
    this.#passphraseHash = passphraseHash
  }
  signTransaction(data, passphraseHash) {
    if (passphraseHash == this.#passphraseHash) {
      const signature = crypto.privateEncrypt({key: this.privateKey, passphrase: passphraseHash}, Buffer.from(data, 'utf8')).toString('base64')
      return signature
    }
    else {
      return 'Passphrase Incorrect.'
    }
  }
}

module.exports = Account