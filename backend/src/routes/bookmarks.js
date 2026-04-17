const express = require('express');
const router  = express.Router();
const ctrl    = require('../controllers/bookmarksController');
const { requireAuth } = require('../middleware/auth');

router.get('/',    requireAuth, ctrl.getBookmarks);
router.post('/',   requireAuth, ctrl.addBookmark);
router.delete('/:id', requireAuth, ctrl.removeBookmark);

module.exports = router;
