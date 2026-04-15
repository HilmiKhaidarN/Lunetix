const express = require('express');
const router = express.Router();
const certificatesController = require('../controllers/certificatesController');
const { requireAuth } = require('../middleware/auth');

router.get('/',           requireAuth, certificatesController.getMyCertificates);
router.post('/:courseId', requireAuth, certificatesController.issueCertificate);

module.exports = router;
