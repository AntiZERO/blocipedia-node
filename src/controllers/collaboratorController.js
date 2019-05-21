const collaboratorQueries = require("../db/queries.collaborators");
const User = require("../db/models").User;
const Wiki = require("../db/models").Wiki;
//const Authorizer = require("../policies/application");
const wikiQueries = require("../db/queries.wikis");

module.exports = {
  show(req, res, next) {
    console.log('id: ', req.params.wikiId);
    collaboratorQueries.getCollaborators(req.params.wikiId, (err, wiki, collaborators) => {
      console.log('collaborators: ', collaborators);
      if (err || !req.params.wikiId) {
        console.log('ERROR', err);
        res.redirect(404, '/');
      } else {
        console.log('rendering...');
        res.render("collaborators/show", { wiki, collaborators });
      }
    });
  },
  add(req, res, next) {
    collaboratorQueries.createCollaborator(req, (err, collaborator) => {
      if (err) {
        req.flash("error", err);
        req.flash("notice", "User already exists")
      }
      res.redirect(`/wikis/${req.params.wikiId}/collaborators`);
    });
  },

  destroy(req, res, next) {

    collaboratorQueries.deleteCollaborator(req, (err, collaborator) => {
      if (err) {
        req.flash("error", err)
      }
      res.redirect(req.headers.referer);
    });

    collaboratorQueries.deleteCollaborator(req.params.id, (err, deletedRecordsCount) => {
      if (err) {
        res.redirect(
          500, `/wikis/${req.params.wikiId}/collaborators`
        );
      } else {
        res.redirect(303, `/wikis/${req.params.wikiId}/collaborators`)
      }
    });
  }

}; 