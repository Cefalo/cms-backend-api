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

/* POST /article */
describe("Test POST /article", () => {
  test("It should response 200 on POST method", done => {
    request(app)
      .post(`${process.env.API_ENPOINT_BASE}/article`)
      .send(article)
      .then(response => {
        const respArticle = JSON.parse(response.text);
        expect(response.statusCode).toBe(200);
        expect(respArticle.title).toBe(article.title);
        done();
      });
  });
});

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

/* PUT /article/:artId */
describe("Test PUT /article/:articleId", () => {
  test("It should response 200 on PUT method", done => {
    request(app)
      .get(`${process.env.API_ENPOINT_BASE}/article`)
      .then(response => {
        expect(response.statusCode).toBe(200);

        const articles = JSON.parse(response.text);
        if (articles && articles.length) {
          let art=articles[0],
            newTitle='Test: Hello test world';

            art.title=newTitle;

            request(app)
            .put(`${process.env.API_ENPOINT_BASE}/article/${art._id}`)
            .send(art)
            .then(resp => {
              expect(resp.statusCode).toBe(200);
              const respArticle = JSON.parse(resp.text);
              expect(respArticle.title).toBe(newTitle);
              done();
            });
        }
        else {
          done();
        }
      });
  });
});

/* DELETE /article/:artId */
describe("Test DELETE /article/:articleId", () => {
  test("It should response 200 on DELETE method", done => {
    request(app)
      .get(`${process.env.API_ENPOINT_BASE}/article`)
      .then(response => {
        expect(response.statusCode).toBe(200);

        const articles = JSON.parse(response.text);
        if (articles && articles.length) {
          let artId=articles[0]._id;
            request(app)
            .delete(`${process.env.API_ENPOINT_BASE}/article/${artId}`)
            .then(resp => {
              expect(resp.statusCode).toBe(200);
              done();
            });
        }
        else {
          done();
        }
      });
  });
});