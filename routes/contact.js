const express = require('express');
const router = express.Router();
const { sendContactMessage } = require('../utils/emailService');
const ContactMessage = require('../models/contactMessage');

router.post('/', async (req, res) => {
  try {
    const { name, email, message } = req.body;

    // Validation des champs requis
    if (!name || !email || !message) {
      return res.status(400).json({ 
        success: false,
        error: 'Nom, email et message sont requis.' 
      });
    }

    // Validation email basique
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        success: false,
        error: 'Format d\'email invalide.' 
      });
    }

    // Validation longueurs
    if (name.trim().length < 2) {
      return res.status(400).json({ 
        success: false,
        error: 'Le nom doit contenir au moins 2 caractères.' 
      });
    }

    if (message.trim().length < 10) {
      return res.status(400).json({ 
        success: false,
        error: 'Le message doit contenir au moins 10 caractères.' 
      });
    }

    console.log('📬 Nouveau message de contact reçu de:', name, '(', email, ')');

    // Préparer les données pour l'email
    const contactData = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      message: message.trim()
    };

    // Envoyer les emails (admin + auto-réponse)
    try {
      await sendContactMessage(contactData);
      console.log('✅ Emails envoyés avec succès');
    } catch (emailError) {
      console.error('⚠️ Erreur envoi emails (message sauvé quand même):', emailError);
      // On continue même si l'email échoue
    }

    // Sauvegarder en base (modèle d'origine conservé)
    await ContactMessage.create({
      name: contactData.name,
      email: contactData.email,
      message: contactData.message
    });

    console.log('✅ Message de contact sauvé en base');

    res.status(200).json({ 
      success: true,
      message: "Votre message a été envoyé avec succès ! Vous recevrez une réponse sous 24 - 48 heures."
    });

  } catch (error) {
    console.error('❌ Erreur envoi message contact:', error);
    res.status(500).json({ 
      success: false,
      error: "Erreur lors de l'envoi du message. Veuillez réessayer."
    });
  }
});

module.exports = router;