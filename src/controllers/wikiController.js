const wikiQueries = require("../db/queries.wikis.js");
const markdown = require("markdown").markdown;

module.exports = {

  index(req, res, next) {
    wikiQueries.getAllWikis((err, wikis) => {
      if (err) {
        console.log(err);
        res.redirect(500, "static/index");
      } else {
        res.render("wikis/index", { wikis });
      }
    })
  },

  new(req, res, next) {
    res.render("wikis/new");
  },

  newPrivate(req, res, next) {
    res.render("wikis/newPrivate");
  },

  create(req, res, next) {
    let newWiki = {
      title: req.body.title,
      body: req.body.body,
      userId: req.user.id
    };
    wikiQueries.addWiki(newWiki, (err, wiki) => {
      if (err) {
        res.redirect(500, "/wikis/new");
      } else {
        res.redirect(303, `/wikis/${wiki.id}`);
      }
    });
  },

  createPrivate(req, res, next) {

    const newWiki = {
      title: req.body.title,
      body: req.body.body,
      private: true,
      userId: req.user.id
    };
    wikiQueries.addWiki(newWiki, (err, wiki) => {
      if (err) {
        res.redirect(500, "wikis/newPrivate");
      } else {
        res.redirect(303, `/wikis/${wiki.id}`);
      }
    });
  },

  show(req, res, next) {
    wikiQueries.getWiki(req.params.id, (err, wiki) => {
      if (err || wiki == null) {
        res.redirect(404, "/");
      } else {
        wiki.body = markdown.toHTML(wiki.body);
        res.render("wikis/show", { wiki });
      }
    });
  },

  destroy(req, res, next) {
    wikiQueries.deleteWiki(req, (err, topic) => {
      if (err) {
        res.redirect(err, `/wikis/${req.params.id}`);
      } else {
        res.redirect(303, "/wikis");
      }
    });
  },

  edit(req, res, next) {
    wikiQueries.getWiki(req.params.id, (err, wiki) => {
      if (err || wiki == null) {
        res.redirect(404, "/");
      } else {
        res.render("wikis/edit", { wiki });
      }
    });
  },

  update(req, res, next) {
    wikiQueries.updateWiki(req, req.body, (err, wiki) => {
      if (err || wiki == null) {
        res.redirect(401, `/wikis/${req.params.id}/edit`);
      } else {
        res.redirect(`/wikis/${req.params.id}`);
      }
    });
  },

  makePublic(req, res, next) {
    wikiQueries.toPublic(req.params.id, (err, wiki) => {
      if (err || !wiki) {
        res.redirect(404, `/wikis/${req.params.id}`)
      } else {
        res.redirect(`/wikis/${req.params.id}`)
      }
    });
  },

  makePrivate(req, res, next) {
    wikiQueries.toPrivate(req.params.id, (err, wiki) => {
      if (err || !wiki) {
        res.redirect(404, `/wikis/${req.params.id}`)
      } else {
        res.redirect(`/wikis/${req.params.id}`)
      }
    });
  }
}