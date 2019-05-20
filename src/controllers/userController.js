const userQueries = require("../db/queries.users.js");
const wikiQueries = require("../db/queries.wikis.js");
const passport = require("passport");
const sgMail = require('@sendgrid/mail');
const stripe = require("stripe")(process.env.STRIPE_API_KEY);

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
        sgMail.setApiKey(process.env.SENDGRID_API_KEY);
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
  },

  signInForm(req, res, next) {
    res.render("users/signin");
  },

  signIn(req, res, next) {
    passport.authenticate("local")(req, res, function () {
      if (!req.user) {
        req.flash("notice", "Sign in failed. Please try again.");
        res.redirect("/users/signin");
      } else {
        req.flash("notice", "You've successfully signed in!");
        res.redirect("/");
      }
    })
  },

  signOut(req, res, next) {
    req.logout();
    req.flash("notice", "You've successfully signed out!");
    res.redirect("/");
  },
  show(req, res, next) {
    userQueries.getUser(req.params.id, (err, user) => {
      if (err || user === undefined) {
        req.flash("notice", "No user found with that ID.");
        res.redirect("/");
      } else {
        res.render("users/show", {user});
      }
    });
  },
  upgradeForm(req, res, next) {
    res.render("users/upgradeForm");
  },
  downgradeForm(req, res, next) {
    res.render("users/downgradeForm");
  },
  upgrade(req, res, next) {
    userQueries.getUser(req.params.id, (err, user) => {
      stripe.customers.create({
        email: req.body.stripeEmail,
      }).then((customer) => {
        console.log(req.body.stripeToken)
        return stripe.customers.createSource(customer.id, { source: req.body.stripeToken })
      }).then((source) => {
        console.log(source.customer)
        return stripe.charges.create({
          amount: 1500,
          currency: "USD",
          description: "Upgrade to Premium Membership",
          customer: source.customer
        });
      }).then((charge) => {
        if (charge) {
          let action = "upgrade";
          userQueries.toggleRole(user, action);
          req.flash("notice", "Your account has been upgraded to Premium!");
          res.redirect("/");
        } else {
          req.flash("notice", "The upgrade was unsuccessful");
          res.redirect("/users/show", { user })
        }
      })
        .catch(err => {
          console.log(err);
        })
    })

  },
  downgrade(req, res, next) {
    userQueries.getUser(req.params.id, (err, user) => {
      if (user) {
        let action = "downgrade"
        userQueries.toggleRole(user, action);
        wikiQueries.downgrade(req.params.id);
        req.flash("notice", "Your account has been downgraded to Standard.");
        res.redirect("/");
      } else {
        req.flash("notice", "Downgrade was unsuccessful");
        res.redirect("/users/show", { user })
      }
    })
      .catch(err => {
        console.log(err);
      })
  }

};