const express = require('express');
const router = express.Router();
const ContactController = require('../controllers/contactController');

// Route publique - créer un message de contact
router.post('/', ContactController.create);

module.exports = router;