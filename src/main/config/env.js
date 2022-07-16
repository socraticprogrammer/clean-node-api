module.exports = {
  mongoUrl:
    process.env.MONGO_URL ||
    "mongodb://cleanuser:clean1234@localhost:27017/cleandb",
  port: process.env.PORT || 3000,
  tokenSecret: process.env.TOKEN_SECRET || "secret",
};
