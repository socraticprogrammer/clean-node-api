module.exports = (app) => {
  app.use(async (ctx, next) => {
    await next();
    ctx.set("access-control-allow-origin", "*");
    ctx.set("access-control-allow-methods", "*");
    ctx.set("access-control-allow-headers", "*");
  });
};
