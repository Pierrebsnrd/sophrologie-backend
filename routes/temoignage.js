// routes/temoignage.js - Version refactorisée
const express = require('express');
const router = express.Router();
const TemoignageController = require('../controllers/temoignageController');

// Route publique - récupérer les témoignages validés
router.get('/', TemoignageController.getValidated);

// Route publique - créer un témoignage
router.post('/', TemoignageController.create);

module.exports = router;