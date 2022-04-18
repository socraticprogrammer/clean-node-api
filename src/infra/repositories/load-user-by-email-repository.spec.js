const MongoHelper = require('../helpers/mongo-helper')
const LoadUserByEmailRepository = require('./load-user-by-email-repository')
const MissingParamError = require('../../utils/errors/missing-param-error')
let db

const makeSut = () => {
  const userModel = db.collection('users')
  const sut = new LoadUserByEmailRepository(userModel)

  return {
    userModel,
    sut
  }
}

describe('LoadUserByEmail Repository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
    db = await MongoHelper.getDb()
  })

  beforeEach(async () => {
    await db.collection('users').deleteMany()
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  test('Should return null if no user is found', async () => {
    const { sut } = makeSut()
    const user = await sut.load('invalid_email@email.com')
    expect(user).toBeNull()
  })

  test('Should return an user if user is found', async () => {
    const { sut, userModel } = makeSut()
    const { ops: [fakeUser] } = await userModel.insertOne({
      name: 'any_name',
      email: 'valid_email@email.com',
      password: 'hashed_password'
    })
    const user = await sut.load('valid_email@email.com')
    expect(user).toEqual({
      _id: fakeUser._id,
      password: fakeUser.password
    })
  })

  test('Should throw if no email is provided', () => {
    const { sut } = makeSut()
    const promise = sut.load()
    expect(promise).rejects.toThrow(new MissingParamError('email'))
  })
})
