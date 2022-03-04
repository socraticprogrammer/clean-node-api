const { MissingParamError } = require('../../utils/errors')
const AuthUseCase = require('./auth-usecase')

const makeLoadUserByEmailRepository = () => {
  class LoadUserByEmailRepositorySpy {
    async load (email) {
      this.email = email
      return this.user
    }
  }
  const loadUserByEmailRepositorySpy = new LoadUserByEmailRepositorySpy()
  loadUserByEmailRepositorySpy.user = {
    id: 'any_id',
    password: 'hashed_password'
  }

  return loadUserByEmailRepositorySpy
}

const makeEncrypter = () => {
  class EncrypterSpy {
    async compare (password, hashedPassword) {
      this.password = password
      this.hashedPassword = hashedPassword
      return this.isValid
    }
  }

  const encrypterSpy = new EncrypterSpy()
  encrypterSpy.isValid = true
  return encrypterSpy
}

const makeTokenGenerator = () => {
  class TokenGeneratorSpy {
    async generate (userId) {
      this.userId = userId
      return this.accessToken
    }
  }

  const tokenGeneratorSpy = new TokenGeneratorSpy()
  tokenGeneratorSpy.accessToken = 'any_token'
  return tokenGeneratorSpy
}

const makeSut = () => {
  const loadUserByEmailRepositorySpy = makeLoadUserByEmailRepository()
  const encrypterSpy = makeEncrypter()
  const tokenGeneratorSpy = makeTokenGenerator()

  const sut = new AuthUseCase({
    loadUserByEmailRepository: loadUserByEmailRepositorySpy,
    encrypter: encrypterSpy,
    tokenGenerator: tokenGeneratorSpy
  })

  return {
    sut,
    loadUserByEmailRepositorySpy,
    encrypterSpy,
    tokenGeneratorSpy
  }
}

const makeSuts = (dependency) => {
  return new AuthUseCase(dependency)
}

describe('Auth UseCase', () => {
  test('Should throw if no email is provided', async () => {
    const { sut } = makeSut()
    const promise = sut.auth()

    expect(promise).rejects.toThrowError(new MissingParamError('email'))
  })

  test('Should throw if no password is provided', async () => {
    const { sut } = makeSut()
    const promise = sut.auth('any_email@mail.com')

    expect(promise).rejects.toThrow(new MissingParamError('password'))
  })

  test('Should call LoadUserByEmailRepository with correct email', async () => {
    const { sut, loadUserByEmailRepositorySpy } = makeSut()
    await sut.auth('any_email@mail.com', 'any_password')
    expect(loadUserByEmailRepositorySpy.email).toBe('any_email@mail.com')
  })

  test('Should return null if an email is invalid ', async () => {
    const { sut, loadUserByEmailRepositorySpy } = makeSut()
    loadUserByEmailRepositorySpy.user = null
    const accessToken = await sut.auth('invalid_email@mail.com', 'any_password')
    expect(accessToken).toBeNull()
  })

  test('Should return null if an password is invalid ', async () => {
    const { sut, encrypterSpy } = makeSut()
    encrypterSpy.isValid = false
    const accessToken = await sut.auth('valid_email@mail.com', 'invalid_password')
    expect(accessToken).toBeNull()
  })

  test('Should call Encrypter with correct values', async () => {
    const { sut, loadUserByEmailRepositorySpy, encrypterSpy } = makeSut()
    await sut.auth('valid_email@mail.com', 'any_password')
    expect(encrypterSpy.password).toBe('any_password')
    expect(encrypterSpy.hashedPassword).toBe(loadUserByEmailRepositorySpy.user.password)
  })

  test('Should call TokenGenerator with correct userId', async () => {
    const { sut, loadUserByEmailRepositorySpy, tokenGeneratorSpy } = makeSut()
    await sut.auth('valid_email@mail.com', 'valid_password')
    expect(tokenGeneratorSpy.userId).toBe(loadUserByEmailRepositorySpy.user.id)
  })

  test('Should return an accessToken if correct credentials are provided', async () => {
    const { sut, tokenGeneratorSpy } = makeSut()
    const accessToken = await sut.auth('valid_email@mail.com', 'valid_password')
    expect(accessToken).toBe(tokenGeneratorSpy.accessToken)
    expect(accessToken).toBeTruthy()
  })

  test('Should throw if invalid dependencies are provided', async () => {
    const invalid = {}
    const loadUserByEmailRepository = makeLoadUserByEmailRepository()
    const encrypter = makeEncrypter()

    const suts = [
      makeSuts(),
      makeSuts({}),
      makeSuts({}),
      makeSuts({ loadUserByEmailRepository: invalid }),
      makeSuts({
        loadUserByEmailRepository
      }),
      makeSuts({
        loadUserByEmailRepository,
        encrypter: invalid
      }),
      makeSuts({
        loadUserByEmailRepository,
        encrypter
      }),
      makeSuts({
        loadUserByEmailRepository,
        encrypter,
        tokenGenerator: invalid
      })
    ]

    suts.forEach(sut => {
      const promise = sut.auth('any_email@email.com', 'any_password')
      expect(promise).rejects.toThrowError()
    })
  })
})
