const express = require('express');
const router = express.Router();
const Temoignage = require('../models/temoignage');
const { sendNewTestimonialNotification } = require('../utils/emailService');


// Poster un témoignage
router.post('/', async (req, res) => {
  try {
    console.log("Corps reçu :", req.body); // ← ajoute ceci
    const { name, message } = req.body;

    if (!name || !message) {
      return res.status(400).json({ error: 'Nom et message requis' });
    }

    const temoignage = await Temoignage.create({ name, message });
    await sendNewTestimonialNotification(temoignage);
    res.status(201).json(temoignage);
  } catch (error) {
    console.error('Erreur ajout témoignage:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Récupérer uniquement les témoignages validés
router.get('/', async (req, res) => {
  try {
    const temoignage = await Temoignage.find({ status: 'validated' }).sort({ createdAt: -1 });
    res.json(temoignage);
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

module.exports = router;
