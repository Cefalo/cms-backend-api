const request = require("supertest");
const app = require("../../app");

describe("Test GET /article", () => {
  test("It should response 200 on GET method", done => {
    request(app)
      .get(`${process.env.API_ENPOINT_BASE}/article`)
      .then(response => {
        expect(response.statusCode).toBe(200);
        done();
      });
  });
});


const article = {
  title: "Test: how to test express API POST request?",
  body: ["<h2>Article body sub heading</h2>", "<p>Article body paragraph</p>"]
};


/* GET /article/:artId */
describe("Test POST /article/:articleId", () => {
  test("It should response 200 on GET method", done => {
    request(app)
      .get(`${process.env.API_ENPOINT_BASE}/article`)
      .then(response => {
        expect(response.statusCode).toBe(200);
        const articles = JSON.parse(response.text);
        if (articles && articles.length) {
          request(app)
            .get(`${process.env.API_ENPOINT_BASE}/article/${articles[0]._id}`)
            .then(response => {
              expect(response.statusCode).toBe(200);
              done();
            });
        }
        else {
          done();
        }
      });
  });
});
