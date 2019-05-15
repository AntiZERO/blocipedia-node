const request = require("request");
const server = require("../../src/server");
const base = "http://localhost:3000/wikis/";
const Wiki = require("../../src/db/models").Wiki;
const User = require("../../src/db/models").User;
const sequelize = require("../../src/db/models/index").sequelize;


describe("routes : wikis", () => {

  beforeEach((done) => {
    this.wiki;
    this.user;

    sequelize.sync({ force: true }).then((res) => {
      User.create({
        username: "testUser",
        email: "user@test.com",
        password: "1234567890"
      })
        .then((user) => {
          this.user = user;

          Wiki.create({
            title: "Testing Wiki Title",
            body: "This is a regularly scheduled emergency broadcast system",
            userId: this.user.id
          })
            .then((wiki) => {
              this.wiki = wiki;

              request.get({
                url: "http://localhost:3000/auth/fake",
                form: {
                  userId: this.user.id,
                  email: this.user.email
                }
              },
                (err, res, body) => {
                  done();
                }
              )
            })
            .catch((err) => {
              console.log(err);
              done();
            });
        });
    });
  });

  describe("GET /wikis", () => {

    it("should return a status code of 200", (done) => {
      request.get(base, (err, res, body) => {
        expect(res.statusCode).toBe(200);
        done();
      });
    });
  });

  describe("GET /wikis/new", () => {

    it("should render a 'new' wiki view", (done) => {
      request.get(`${base}new`, (err, res, body) => {
        expect(err).toBeNull();
        expect(body).toContain("New Wiki");
        done();
      });
    });
  });

  describe("POST /wikis/create", () => {

    it("should create a new wiki and redirect", (done) => {
      const options = {
        url: `${base}create`,
        form: {
          title: "Game of Thrones PoV Characters",
          body: "Sansa Stark, Tyrion Lannister, Aegon Targaryen",
          userId: this.user.id
        }
      };
      request.post(options,
        (err, res, body) => {
          Wiki.findOne({ where: { title: "Game of Thrones PoV Characters" } })
            .then((wiki) => {
              expect(wiki.title).toBe("Game of Thrones PoV Characters");
              expect(wiki.body).toBe("Sansa Stark, Tyrion Lannister, Aegon Targaryen");
              done();
            })
            .catch((err) => {
              console.log(err);
              done();
            });
        }
      );
    });

    it("should not create a new wiki that fails validation", (done) => {
      const options = {
        url: `${base}create`,
        form: {
          title: "four",
          body: "Less than twenty."
        }
      };

      request.post(options,
        (err, res, body) => {

          Wiki.findOne({ where: { title: "four" } })
            .then((wiki) => {
              expect(wiki).toBeNull();
              done();
            })
            .catch((err) => {
              console.log(err);
              done();
            })
        })
    })
  });

  describe("GET /wiki/:id", () => {

    it("should render a view with the selected wiki", (done) => {
      request.get(`${base}${this.wiki.id}`, (err, res, body) => {
        expect(err).toBeNull();
        expect(this.wiki.title).toContain("Testing Wiki Title");
        expect(this.wiki.body).toContain("This is a regularly scheduled emergency broadcast system");
        done();
      });
    });
  });

  describe("POST /wikis/:id/destroy", () => {

    it("should delete the wiki with the associated ID", (done) => {
      Wiki.findAll()
        .then((wikis) => {
          const wikiCountBeforeDelete = wikis.length;
          expect(wikiCountBeforeDelete).toBe(1);
          request.post(`${base}${this.wiki.id}/destroy`, (err, res, body) => {
            Wiki.findAll()
              .then((wikis) => {
                expect(err).toBeNull();
                expect(wikis.length).toBe(wikiCountBeforeDelete - 1);
                done();
              });
          });
        });
    });
  });

  describe("GET /wikis/:id/edit", () => {

    it("should render a view to 'edit' a wiki", (done) => {
      request.get(`${base}${this.wiki.id}/edit`, (err, res, body) => {
        expect(err).toBeNull();
        expect(body).toContain("Edit Wiki");
        expect(body).toContain("Testing Wiki Title");
        done();
      });
    });
  });

  describe("POST /wikis/:id/update", () => {

    it("should update the wiki with the given values", (done) => {
      const options = {
        url: `${base}${this.wiki.id}/update`,
        form: {
          title: "Edited Wiki Title",
          body: "This wiki has been edited by the user."
        }
      };
      request.post(options,
        (err, res, body) => {
          expect(err).toBeNull();
          Wiki.findOne({
            where: { id: this.wiki.id }
          })
            .then((wiki) => {
              expect(wiki.title).toBe("Edited Wiki Title");
              done();
            });
        });
    });
  });
});