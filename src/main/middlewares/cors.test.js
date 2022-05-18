const supertest = require("supertest");
const { app, router } = require("../config/app");

describe("CORS Middleware", () => {
  let server, request;

  beforeAll(() => {
    server = app.listen();
    request = supertest(server);
  });

  test("Should enable CORS", async () => {
    router.get("/test_cors", (ctx) => {
      ctx.body = "";
    });

    const response = await request.get("/test_cors");
    expect(response.headers["access-control-allow-origin"]).toBe("*");
    expect(response.headers["access-control-allow-methods"]).toBe("*");
    expect(response.headers["access-control-allow-headers"]).toBe("*");
  });
});
