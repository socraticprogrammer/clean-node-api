module.exports = {
  mongoUrl:
    process.env.MONGO_URL || 'mongodb://root:1234@db:27017/clean-node-api',
  port: process.env.PORT || 3000,
  tokenSecret: process.env.TOKEN_SECRET || 'secret'
}
