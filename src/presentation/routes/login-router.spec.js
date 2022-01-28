const LoginRouter = require('./login-router')
const MissingParamError = require('../errors/missing-param')

const makeSut = () => {
  class AuthUseCase {
    auth (email, password) {
      this.email = email
      this.password = password
    }
  }

  const authUseCase = new AuthUseCase()
  const sut = new LoginRouter(authUseCase)

  return {
    sut,
    authUseCase
  }
}

describe('Login Router', () => {
  test('Should return 400 if no email is provided', () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        password: 'any_password'
      }
    }
    const httpResponse = sut.route(httpRequest)

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('email'))
  })

  test('Should return 400 if no password is provided', () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        email: 'any_email@hotmail.com'
      }
    }
    const httpResponse = sut.route(httpRequest)

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('password'))
  })

  test('Should return 500 if no httpRequest is provided', () => {
    const { sut } = makeSut()

    const httpResponse = sut.route()

    expect(httpResponse.statusCode).toBe(500)
  })

  test('Should return 500 if httpRequest has no body', () => {
    const { sut } = makeSut()
    const httpRequest = {}

    const httpResponse = sut.route(httpRequest)

    expect(httpResponse.statusCode).toBe(500)
  })

  test('Should call AuthUseCase with correct params', () => {
    const { sut, authUseCase } = makeSut()

    const httpRequest = {
      body: {
        email: 'any_email@hotmail.com',
        password: 'any_password'
      }
    }

    sut.route(httpRequest)

    expect(authUseCase.email).toBe(httpRequest.body.email)
    expect(authUseCase.password).toBe(httpRequest.body.password)
  })
})
