module.exports = async (ctx, next) => {
  await next();
  ctx.response.type = "json";
};
