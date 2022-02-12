module.exports = {
  email: null,
  isEmailValid: true,
  isEmail (email) {
    this.email = email
    return this.isEmailValid
  }
}
