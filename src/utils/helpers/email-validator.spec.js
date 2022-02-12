const isEmail = require('validator/lib/isEmail')

class EmailValidator {
  isValid (email) {
    return isEmail(email)
  }
}

describe('Email validator', () => {
  test('Should return true if validator returns true', () => {
    const sut = new EmailValidator()
    const isEmailValid = sut.isValid('valid_email@mail.com')
    expect(isEmailValid).toBeTruthy()
  })
})
