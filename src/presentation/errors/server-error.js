module.exports = class ServerError extends Error {
  constructor () {
    super('Internal error')
    this.name = 'ServerError'
  }
}
