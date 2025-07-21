const express = require('express');
const router = express.Router();
const Rdv = require('../models/rdv');
const { sendRdvNotification } = require('../utils/emailService');

// Créer un nouveau RDV
router.post('/', async (req, res) => {
  try {
    const { name, email, phone, date, message } = req.body;

    // Validation
    if (!name || !email || !date) {
      return res.status(400).json({ 
        error: 'Les champs nom, email et date sont obligatoires' 
      });
    }

    // Vérifier que la date est dans le futur
    if (new Date(date) < new Date()) {
      return res.status(400).json({ 
        error: 'La date doit être dans le futur' 
      });
    }

    const newRdv = new Rdv({ name, email, phone, date, message });
    await newRdv.save();

    // Envoyer les emails
    await sendRdvNotification(newRdv);

    res.status(201).json({ 
      success: true, 
      message: 'Rendez-vous enregistré avec succès',
      rdv: newRdv 
    });
  } catch (error) {
    console.error('Erreur création RDV:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

module.exports = router;