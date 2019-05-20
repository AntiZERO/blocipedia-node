const express = require("express");
const router = express.Router();
const helper = require("../auth/helpers");
const validation = require("./validation");

const wikiController = require("../controllers/wikiController");

router.get("/wikis", wikiController.index);
router.get("/wikis/new", wikiController.new);
router.get('/wikis/newPrivate', helper.ensureAuthenticated, wikiController.newPrivate);
router.get("/wikis/:id", wikiController.show);
router.get("/wikis/:id/edit", wikiController.edit);

router.post("/wikis/create", helper.ensureAuthenticated, validation.validateWikis, wikiController.create);
router.post('/wikis/createPrivate', helper.ensureAuthenticated, validation.validateWikis, wikiController.createPrivate);
router.post("/wikis/:id/destroy", wikiController.destroy);
router.post("/wikis/:id/update", validation.validateWikis, wikiController.update);
router.post('/wikis/:id/makePublic', wikiController.makePublic);
router.post('/wikis/:id/makePrivate', wikiController.makePrivate);

module.exports = router;

// reminder for policies: public wikis editable by all, private editable by owner/collaborators