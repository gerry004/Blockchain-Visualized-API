class Transaction {
  constructor(to, from, amount) {
    this.amount = amount
    this.to = to
    this.from = from
    this.signature = null
    this.isVerified = false
  }
  setSignature(signature) {
    this.signature = signature
  }
  setIsVerified(data) {
    this.isVerified = data
  }
}

module.exports = Transaction