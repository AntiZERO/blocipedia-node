const sequelize = require("../../src/db/models/index").sequelize;
const Wiki = require("../../src/db/models").Wiki;
const User = require("../../src/db/models").User;

describe("Wiki", () => {

  beforeEach((done) => {
    this.user;
    this.wiki;

    sequelize.sync({force: true}).then((res) => {

      User.create({
        username: "testUser",
        email: "user@test.com",
        password: "1234567890"
      })
      .then((user) => {
        this.user = user;

        Wiki.create({
          title: "Testing Wiki Title",
          body: "This is a regularly scheduled test of the emergency broadcast system.",
          userId: this.user.id
        })
        .then((wiki) => {
          this.wiki = wiki;
          done();
        })
        .catch((err) => {
          console.log(err);
          done();
        });
      })
    });
  });

  describe("#create()", () => {
    it("should create a wiki object with a title, body, and associated user", (done) => {

      Wiki.create({
        title: "Creating Test Wiki",
        body: "This is the body of the testing wiki",
        userId: this.user.id
      })
      .then((wiki) => {
        expect(wiki.title).toBe("Creating Test Wiki");
        expect(wiki.body).toBe("This is the body of the testing wiki");
        done();
      })
      .catch((err) => {
        console.log();
        done();
      });
    });

    it("should not create a wiki with missing title, body or assigned user", (done) => {
      Wiki.create({
        title:"This is a wiki title"
      })
      .then((wiki) => {
        //validation error will skip this
        done();
      })
      .catch((err) => {
        expect(err.message).toContain("Wiki.body cannot be null");
        expect(err.message).toContain("Wiki.userId cannot be null");
        done();
      });
    });
  });

  describe("#setUser()", () => {

    it("should associate a wiki and a user together", (done) => {

      User.create({
        username: "Benjamin Sisko",
        email: "emissary@bajor.net",
        password: "bajoranmessiah"
      })
      .then((newUser) => {

        expect(this.wiki.userId).toBe(this.user.id);
        this.wiki.setUser(newUser)
        .then((wiki) => {
          expect(this.wiki.userId).toBe(newUser.id);
          done();

        });
      })
    });
  });

  describe("#getUser()", () => {
    it("should return the associated user", (done) => {

      this.wiki.getUser()
      .then((associatedUser) => {
        expect(associatedUser.email).toBe("user@test.com");
        done();
      });
    });
  });
});