const userQueries = require("../db/queries.users.js");
const passport = require("passport");
const sgMail = require('@sendgrid/mail');

module.exports = {

  signUp(req, res, next) {
    res.render("users/signup");
  },

  create(req, res, next) {

    let newUser = {
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
      passwordConfirmation: req.body.passwordConfirmation
    };

    userQueries.createUser(newUser, (err, user) => {
      if (err) {
        req.flash("error", err);
        res.redirect("/users/signup");
      } else {
        //send email
        sgMail.setApiKey('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');
        const msg = {
          to: req.body.email,
          from: 'gray2884@gmail.com',
          subject: "You've created an account on Blocipiedia",
          text: 'Thanks for joining!',
          html: '<strong>Hope to see you around!</strong>',
        };

        sgMail.send(msg);
        
        //sign in
        passport.authenticate("local")(req, res, () => {
          req.flash("notice", "You've successfully signed in!");
          res.redirect("/");
        });
      }
    });
  }
}