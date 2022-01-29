const LoginRouter = require('./login-router')
const MissingParamError = require('../errors/missing-param-error')
const InvalidParamError = require('../errors/invalid-param-error')
const UnauthorizedError = require('../errors/unauthorized-error')
const ServerError = require('../errors/server-error')

const makeSut = () => {
  const emailValidatorSpy = makeEmailValidator()
  const authUseCaseSpy = makeAuthUseCase()
  const sut = new LoginRouter(authUseCaseSpy, emailValidatorSpy)

  return {
    sut,
    authUseCaseSpy,
    emailValidatorSpy
  }
}

const makeEmailValidator = () => {
  class EmailValidatorSpy {
    isValid () {
      return this.isEmailValid
    }
  }

  const emailValidatorSpy = new EmailValidatorSpy()
  emailValidatorSpy.isEmailValid = 'valid_email@hotmail.com'
  return emailValidatorSpy
}

const makeEmailValidatorWithError = () => {
  class EmailValidatorSpy {
    isValid () {
      throw new Error()
    }
  }

  return new EmailValidatorSpy()
}

const makeAuthUseCase = () => {
  class AuthUseCaseSpy {
    async auth (email, password) {
      this.email = email
      this.password = password

      return this.accessToken
    }
  }

  const authUseCaseSpy = new AuthUseCaseSpy()
  authUseCaseSpy.accessToken = 'valid_token'
  return authUseCaseSpy
}

const makeAuthUseCaseWithError = () => {
  class AuthUseCaseSpy {
    async auth () {
      throw new Error()
    }
  }

  return new AuthUseCaseSpy()
}

describe('Login Router', () => {
  test('Should return 400 if no email is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        password: 'any_password'
      }
    }
    const httpResponse = await sut.route(httpRequest)

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('email'))
  })

  test('Should return 400 if no password is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        email: 'any_email@hotmail.com'
      }
    }
    const httpResponse = await sut.route(httpRequest)

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('password'))
  })

  test('Should return 400 if an invalid email is provided', async () => {
    const { sut, emailValidatorSpy } = makeSut()
    emailValidatorSpy.isEmailValid = false
    const httpRequest = {
      body: {
        email: 'invalid_email@hotmail.com',
        password: 'any_password'
      }
    }
    const httpResponse = await sut.route(httpRequest)

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new InvalidParamError('email'))
  })

  test('Should return 401 when invalid credential are provided', async () => {
    const { sut, authUseCaseSpy } = makeSut()
    authUseCaseSpy.accessToken = null
    const httpRequest = {
      body: {
        email: 'invalid_email@hotmail.com',
        password: 'invalid_password'
      }
    }

    const httpResponse = await sut.route(httpRequest)

    expect(httpResponse.statusCode).toEqual(401)
    expect(httpResponse.body).toEqual(new UnauthorizedError())
  })

  test('Should return 200 when valid credential are provided', async () => {
    const { sut, authUseCaseSpy } = makeSut()
    const httpRequest = {
      body: {
        email: 'valid_email@hotmail.com',
        password: 'valid_password'
      }
    }

    const httpResponse = await sut.route(httpRequest)

    expect(httpResponse.statusCode).toBe(200)
    expect(httpResponse.body.accessToken).toEqual(authUseCaseSpy.accessToken)
  })

  test('Should return 500 if no httpRequest is provided', async () => {
    const { sut } = makeSut()

    const httpResponse = await sut.route()

    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })

  test('Should return 500 if httpRequest has no body', async () => {
    const { sut } = makeSut()
    const httpRequest = {}

    const httpResponse = await sut.route(httpRequest)

    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })

  test('Should call AuthUseCase with correct params', async () => {
    const { sut, authUseCaseSpy } = makeSut()

    const httpRequest = {
      body: {
        email: 'any_email@hotmail.com',
        password: 'any_password'
      }
    }

    await sut.route(httpRequest)

    expect(authUseCaseSpy.email).toBe(httpRequest.body.email)
    expect(authUseCaseSpy.password).toBe(httpRequest.body.password)
  })

  test('Should return 500 if no AuthUseCase is provided', async () => {
    const sut = new LoginRouter()
    const httpRequest = {
      body: {
        email: 'any_email@hotmail.com',
        password: 'any_password'
      }
    }

    const httpResponse = await sut.route(httpRequest)

    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })

  test('Should return 500 if  AuthUseCase has no auth method', async () => {
    const sut = new LoginRouter({})
    const httpRequest = {
      body: {
        email: 'any_email@hotmail.com',
        password: 'any_password'
      }
    }

    const httpResponse = await sut.route(httpRequest)

    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })

  test('Should return 500 if AuthUseCase throw', async () => {
    const authUseCaseWithErrorSpy = makeAuthUseCaseWithError()

    const sut = new LoginRouter(authUseCaseWithErrorSpy)
    const httpRequest = {
      body: {
        email: 'any_email@hotmail.com',
        password: 'any_password'
      }
    }

    const httpResponse = await sut.route(httpRequest)

    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })

  test('Should return 500 if no EmailValidator is provided', async () => {
    const authUseCaseSpy = makeAuthUseCase()

    const sut = new LoginRouter(authUseCaseSpy)
    const httpRequest = {
      body: {
        email: 'any_email@hotmail.com',
        password: 'any_password'
      }
    }

    const httpResponse = await sut.route(httpRequest)

    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })

  test('Should return 500 if EmailValidator has no isEmailValid method', async () => {
    const authUseCaseSpy = makeAuthUseCase()

    const sut = new LoginRouter(authUseCaseSpy, {})
    const httpRequest = {
      body: {
        email: 'any_email@hotmail.com',
        password: 'any_password'
      }
    }

    const httpResponse = await sut.route(httpRequest)

    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })

  test('Should return 500 if EmailValidator throws', async () => {
    const authUseCaseSpy = makeAuthUseCase()
    const emailValidatorWithErrorSpy = makeEmailValidatorWithError()

    const sut = new LoginRouter(authUseCaseSpy, emailValidatorWithErrorSpy)
    const httpRequest = {
      body: {
        email: 'any_email@hotmail.com',
        password: 'any_password'
      }
    }

    const httpResponse = await sut.route(httpRequest)

    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })
})
