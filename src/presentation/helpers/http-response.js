const ServerError = require('../errors/server-error')
const UnauthorizedError = require('../errors/unauthorized-error')

module.exports = class HttpResponse {
  static badRequest (error) {
    return {
      statusCode: 400,
      body: error
    }
  }

  static unauthorizedError () {
    return {
      statusCode: 401,
      body: new UnauthorizedError()
    }
  }

  static ok (data) {
    return {
      statusCode: 200,
      body: data
    }
  }

  static serverError () {
    return {
      statusCode: 500,
      body: new ServerError()
    }
  }
}
