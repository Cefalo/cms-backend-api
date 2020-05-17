const request = require("supertest");
const app = require("../../app");

describe("Test GET /article", () => {
  test("It should response 200 on GET method", done => {
    request(app)
      .get("/article")
      .then(response => {
        expect(response.statusCode).toBe(200);
        done();
      });
  });
});


const article = {
    title: "Test: how to test express API POST request?",
    body: ["<h2>Article body sub heading</h2>","<p>Article body paragraph</p>"]
};

/* POST /article */
describe("Test POST /article", () => {
    test("It should response 200 on POST method", done => {
      request(app)
        .post("/article")
        .send(article)
        .then(response => {
            const respArticle=JSON.parse(response.text);
            expect(response.statusCode).toBe(200);
            expect(respArticle.title).toBe(article.title);
            done();
        });
    });
  });