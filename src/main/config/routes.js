const fg = require("fast-glob");

module.exports = (router) => {
  require("../routes/login-routes")(router);
  fg.sync("**/src/main/routes/**.js").forEach((file) =>
    require(`../../../${file}`)(router)
  );
};
