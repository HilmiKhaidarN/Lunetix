const express = require('express');
const router  = express.Router();
const ctrl    = require('../controllers/preferencesController');
const { requireAuth } = require('../middleware/auth');

router.get('/',     requireAuth, ctrl.getAllPreferences);
router.get('/:key', requireAuth, ctrl.getPreference);
router.put('/:key', requireAuth, ctrl.setPreference);

module.exports = router;
