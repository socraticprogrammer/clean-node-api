const supertest = require("supertest");
const { app, router } = require("../config/app");

describe("Content-Type Middleware", () => {
  let server, request;

  beforeAll(() => {
    server = app.listen();
    request = supertest(server);
  });

  test("Should return json content-type as default", async () => {
    router.get("/test_content_type", (ctx) => {
      ctx.response.body = "";
    });

    await request.get("/test_content_type").expect("Content-Type", /json/);
  });
});
