const express = require("express");
const router = express.Router();
const { sendContactMessage } = require("../utils/emailService");
const ContactMessage = require("../models/contactMessage");

router.post("/", async (req, res) => {
  try {
    const { name, email, message } = req.body;
    const errors = {};

    // Validation nom
    if (!name || !name.trim()) {
      errors.name = "Le prénom est requis.";
    } else if (name.trim().length < 2) {
      errors.name = "Le prénom doit contenir au moins 2 caractères.";
    }

    // Validation email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !email.trim()) {
      errors.email = "L'email est requis.";
    } else if (!emailRegex.test(email)) {
      errors.email = "Veuillez entrer un email valide.";
    }

    // Validation message
    if (!message || !message.trim()) {
      errors.message = "Le message est requis.";
    } else if (message.trim().length < 10) {
      errors.message = "Le message doit contenir au moins 10 caractères.";
    }

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ success: false, errors });
    }

    // Préparer les données pour l'email
    const contactData = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      message: message.trim()
    };

    try {
      await sendContactMessage(contactData);
      console.log("✅ Emails envoyés avec succès");
    } catch (emailError) {
      console.error("⚠️ Erreur envoi emails (message sauvé quand même):", emailError);
    }

    await ContactMessage.create(contactData);
    console.log("✅ Message de contact sauvé en base");

    res.status(200).json({
      success: true,
      message: "Votre message a été envoyé avec succès ! Vous recevrez une réponse sous 24 - 48 heures."
    });

  } catch (error) {
    console.error("❌ Erreur envoi message contact:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de l'envoi du message. Veuillez réessayer."
    });
  }
});

module.exports = router;