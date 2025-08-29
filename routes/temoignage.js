const express = require('express');
const router = express.Router();
const Temoignage = require('../models/temoignage');
const { sendNewTestimonialNotification } = require('../utils/emailService');

// Poster un témoignage
router.post('/', async (req, res) => {
  try {
    console.log("Corps reçu :", req.body);
    const { name, message } = req.body;
    const errors = {};

    // Validation nom
    if (!name || !name.trim()) {
      errors.name = "Veuillez saisir votre nom.";
    } else if (name.trim().length < 2) {
      errors.name = "Le nom doit contenir au moins 2 caractères.";
    }

    // Validation message
    if (!message || !message.trim()) {
      errors.message = "Veuillez saisir votre message.";
    } else if (message.trim().length < 10) {
      errors.message = "Le message doit contenir au moins 10 caractères.";
    }

    // Si erreurs, renvoyer toutes en une seule fois
    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ success: false, errors });
    }

    // Créer le témoignage
    const temoignage = await Temoignage.create({ 
      name: name.trim(), 
      message: message.trim() 
    });

    console.log('✅ Témoignage créé:', temoignage);

    // Envoyer notification email (avec gestion d'erreur)
    try {
      await sendNewTestimonialNotification(temoignage);
      console.log('✅ Notification email envoyée');
    } catch (emailError) {
      console.error('⚠️ Erreur envoi email (témoignage sauvé):', emailError);
    }

    res.status(201).json({
      success: true,
      message: 'Merci pour votre témoignage ! Il sera publié après validation.',
      data: temoignage
    });

  } catch (error) {
    console.error('❌ Erreur ajout témoignage:', error);
    res.status(500).json({ 
      success: false,
      message: 'Erreur serveur lors de l\'ajout du témoignage' 
    });
  }
});

// Récupérer uniquement les témoignages validés
router.get('/', async (req, res) => {
  try {
    console.log('🔍 Récupération des témoignages validés...');
    
    const temoignages = await Temoignage.find({ status: 'validated' })
      .sort({ createdAt: -1 })
      .lean(); // Optimisation

    console.log(`✅ ${temoignages.length} témoignages récupérés`);

    // Structure de réponse cohérente avec le frontend
    res.json({
      success: true,
      data: {
        temoignages: temoignages
      }
    });

  } catch (error) {
    console.error('❌ Erreur récupération témoignages:', error);
    res.status(500).json({ 
      success: false,
      error: 'Erreur serveur lors de la récupération des témoignages' 
    });
  }
});

module.exports = router;