const request = require("supertest");
const app = require("../../app");

describe("Test route /article", () => {
  test("It should response 200 on GET method", done => {
    request(app)
      .get("/article")
      .then(response => {
        expect(response.statusCode).toBe(200);
        done();
      });
  });
});