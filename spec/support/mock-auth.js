module.exports = {

  fakeIt(app) {

    let role, id, email;

    function middleware(req, res, next) {

      role = req.body.role || role;
      id = req.body.userId || id;
      email = req.body.email || email;

      if (id && id != 0) {
        req.user = {
          "id": id,
          "email": email,
          "role": role
        };
      } else if (id == 0) {
        delete req.user;
      }

      if (next) { next() }
    }

    // we define the route.
    function route(req, res) {
      res.redirect("/")
    }

    // we mount the middleware route.
    app.use(middleware)
    app.get("/auth/fake", route)
  }

}