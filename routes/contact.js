const express = require('express');
const router = express.Router();
const { sendContactMessage } = require('../utils/emailService');

router.post('/', async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Tous les champs sont requis.' });
    }

    await sendContactMessage({ name, email, message });
    res.status(200).json({ success: true });
  } catch (err) {
    console.error('Erreur envoi message contact:', err);
    res.status(500).json({ error: 'Erreur lors de l\'envoi du message.' });
  }
});

module.exports = router;
