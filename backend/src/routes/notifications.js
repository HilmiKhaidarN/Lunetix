const express = require('express');
const router  = express.Router();
const notificationsController = require('../controllers/notificationsController');
const { requireAuth } = require('../middleware/auth');

router.get('/',              requireAuth, notificationsController.getNotifications);
router.put('/read-all',      requireAuth, notificationsController.markAllRead);
router.put('/:id/read',      requireAuth, notificationsController.markOneRead);

module.exports = router;
