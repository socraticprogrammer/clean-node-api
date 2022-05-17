const supertest = require("supertest");
const { app, router } = require("../config/app");

describe("JSON Parser Middleware", () => {
  let server, request;

  beforeAll(() => {
    server = app.listen();
    request = supertest(server);
  });

  test("Should parse body at JSON", async () => {
    router.post("/test_json_parser", (ctx) => {
      ctx.response.body = ctx.request.body;
    });

    await request
      .post("/test_json_parser")
      .send({ name: "any_name" })
      .expect({ name: "any_name" });
  });
});
