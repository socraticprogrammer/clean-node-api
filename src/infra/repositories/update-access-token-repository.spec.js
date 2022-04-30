const MongoHelper = require('../helpers/mongo-helper')
let db

class UpdateAccessTokenRepository {
  constructor (userModel) {
    this.userModel = userModel
  }

  async update (userId, accessToken) {
    await this.userModel.updateOne({
      _id: userId
    }, {
      $set: {
        accessToken
      }
    })
  }
}

const makeSut = () => {
  const userModel = db.collection('users')
  const sut = new UpdateAccessTokenRepository(userModel)
  return {
    sut,
    userModel
  }
}

describe('UpdateAccessTokenRepository', () => {
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

  test('Should update the user with the given accessToken', async () => {
    const { sut, userModel } = makeSut()
    const { ops: [fakeUser] } = await userModel.insertOne({
      name: 'any_name',
      email: 'valid_email@email.com',
      password: 'hashed_password'
    })
    await sut.update(fakeUser._id, 'valid_token')
    const updatedFakeUser = await userModel.findOne({ _id: fakeUser._id })
    expect(updatedFakeUser.accessToken).toBe('valid_token')
  })

  test('Should throw if no userModel is provided', async () => {
    const { userModel } = makeSut()
    const sut = new UpdateAccessTokenRepository()
    const { ops: [fakeUser] } = await userModel.insertOne({
      name: 'any_name',
      email: 'valid_email@email.com',
      password: 'hashed_password'
    })
    const promise = sut.update(fakeUser._id, 'valid_token')
    expect(promise).rejects.toThrow()
  })
})
