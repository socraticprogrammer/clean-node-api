const { randomUUID } = require("crypto");
const MongoHelper = require("../helpers/mongo-helper");
const env = require("../../main/config/env");

(async () => {
  try {
    await MongoHelper.connect(env.mongoUrl);
    const userModel = await MongoHelper.getCollection("users");

    await userModel.insertOne({
      _id: randomUUID(),
      email: "example@example.com",
      password: "$2a$12$IfTYc9dNuv/5iZ97SJ.YVOA41L0aGJeUZkovQ9zGcu3BwGjgtQify",
    });
  } catch (error) {
    console.error(error);
  } finally {
    await MongoHelper.disconnect();
  }
})();
