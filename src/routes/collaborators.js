const express = require('express');
const router = express.Router();
const validation = require('./validation');
const collaboratorController = require('../controllers/collaboratorController');

router.get('/wikis/:wikiId/collaborators', collaboratorController.show);
router.post('/wikis/:wikiId/collaborators/add', collaboratorController.add);
router.post('/wikis/:wikiId/collaborators/:id/destroy', collaboratorController.destroy);

module.exports = router; 