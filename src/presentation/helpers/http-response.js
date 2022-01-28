const MissingParamError = require('../errors/missing-param')

module.exports = class HttpResponse {
  static badRequest (paramName) {
    return {
      statusCode: 400,
      body: new MissingParamError(paramName)
    }
  }

  static unauthorized () {
    return {
      statusCode: 401
    }
  }

  static serverError () {
    return {
      statusCode: 500
    }
  }
}
