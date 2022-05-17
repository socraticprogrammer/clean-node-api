const cors = require("../middlewares/cors");
const jsonParser = require("../middlewares/jsonParser");

module.exports = (app) => {
  app.use(cors);
  app.use(jsonParser);
};
