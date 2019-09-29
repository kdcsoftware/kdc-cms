const request = require("supertest");
const expect = require("chai").expect;
const clearTable = require("../helper");

const req = request("http://localhost:1001");

const blog = {
  type: "blogs",
  date: new Date().toJSON().slice(0, 10),
  title: "My First Post",
  author: "Ian Dela Cruz",
  body:
    "Aute consequat aute aliquip proident sint pariatur mollit adipisicing aliquip eiusmod commodo nulla amet. Laborum occaecat excepteur cillum consectetur et dolore elit exercitation officia enim id anim consectetur ipsum. Do consectetur proident amet reprehenderit sint qui eu. Deserunt ipsum consectetur deserunt sunt non. Laborum commodo ullamco proident commodo amet.",
  slug: "my-first-post"
};

const blogDef = {
  name: "Blogs",
  type: "blogs",
  date: "text",
  title: "text",
  author: "text",
  body: "long-text",
  slug: "text",
  "sort-key": "date"
};

describe("Content Definition", function() {
  this.beforeAll(async function() {
    await clearTable("content");
    await clearTable("content#" + blogDef.type);
    // create content definition
    await req
      .post("/api/content-definition")
      .send(blogDef)
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(201, {
        type: blogDef.type
      });
  });

  describe("POST /api/contents/" + blogDef.type, function() {
    it("it should create", function(done) {
      req
        .post("/api/contents/" + blogDef.type)
        .send(blog)
        .set("Accept", "application/json")
        .expect("Content-Type", /json/)
        .expect(
          201,
          {
            slug: blog.slug
          },
          done
        );
    });
  });

  describe("GET /api/contents/" + blogDef.type + "/" + blog.slug, function() {
    it("should get", function(done) {
      req
        .get("/api/contents/" + blogDef.type + "/" + blog.slug)
        .expect("Content-Type", /json/)
        .expect(200)
        .end(function(err, res) {
          if (err) throw err;
          const { body } = res;
          expect(body.pk).to.equal(blog.slug);
          expect(body.sk).to.equal("content#" + blogDef.type);
          expect(body.gs1pk).to.equal("content#" + blogDef.type);
          expect(body.gs1sk).to.equal(blog.date);
          expect(body.title).to.equal(blog.title);
          expect(body.body).to.equal(blog.body);
          expect(body.author).to.equal(blog.author);
          expect(body.createdAt).to.be.above(0);
          done();
        });
    });
  });

  describe("GET /api/contents/" + blogDef.type, function() {
    it("should list", function(done) {
      req
        .get("/api/contents/" + blogDef.type)
        .expect("Content-Type", /json/)
        .expect(200)
        .end(function(err, res) {
          if (err) throw err;
          const { body } = res;
          expect(body.length).to.equal(1);
          done();
        });
    });
  });

  describe("PUT /api/contents/" + blogDef.type + "/" + blog.slug, function() {
    it("it should update", function(done) {
      req
        .put("/api/contents/" + blogDef.type + "/" + blog.slug)
        .send({ title: "My Updated Post", author: "Happy Dela Cruz" })
        .set("Accept", "application/json")
        .expect("Content-Type", /json/)
        .expect(204, done);
    });
  });

  describe("GET /api/contents/" + blogDef.type + "/" + blog.slug, function() {
    it("should update body", function(done) {
      req
        .get("/api/contents/" + blogDef.type + "/" + blog.slug)
        .expect("Content-Type", /json/)
        .expect(200)
        .end(function(err, res) {
          if (err) throw err;
          const { body } = res;
          expect(body.pk).to.equal(blog.slug);
          expect(body.sk).to.equal("content#" + blogDef.type);
          expect(body.gs1pk).to.equal("content#" + blogDef.type);
          expect(body.gs1sk).to.equal(blog.date);
          expect(body.title).to.equal("My Updated Post");
          expect(body.body).to.equal(blog.body);
          expect(body.author).to.equal("Happy Dela Cruz");
          expect(body.createdAt).to.be.above(0);
          expect(body.updatedAt).to.be.above(0);
          done();
        });
    });
  });

  describe(
    "DELETE /api/contents/" + blogDef.type + "/" + blog.slug,
    function() {
      it("should delete", function(done) {
        req
          .delete("/api/contents/" + blogDef.type + "/" + blog.slug)
          .expect("Content-Type", /json/)
          .expect(204, done);
      });
    }
  );

  //   this.afterAll(async function() {
  //     await clearTable("content");
  //     await clearTable("content#" + blogDef.type);
  //   });
});
