class Transaction {
  constructor(to, from, amount) {
    this.amount = amount
    this.to = to
    this.from = from
    this.signature = null
  }

  setSignature(signature) {
    this.signature = signature
  }
}

module.exports = Transaction