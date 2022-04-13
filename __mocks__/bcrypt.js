module.exports = {
  isValid: true,
  compare (value, hash) {
    this.value = value
    this.hash = hash
    return this.isValid
  }
}
