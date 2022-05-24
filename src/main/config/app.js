const Koa = require("koa");
const Router = require("koa-router");
const setupApp = require("./setup");

const router = new Router({
  prefix: "/api",
});
const app = new Koa();

router.get("/", (ctx) => {
  ctx.body = "Hello world!";
});

setupApp(app);

app.use(router.routes());
app.use(router.allowedMethods());

module.exports = { app, router };
