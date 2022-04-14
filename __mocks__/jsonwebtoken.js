module.exports = {
  token: 'any_token',
  id: '',
  sign (id, secret) {
    this.id = id
    return this.token
  }
}
