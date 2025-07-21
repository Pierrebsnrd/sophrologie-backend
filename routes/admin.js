var express = require('express');
var router = express.Router();
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const Rdv = require('../models/rdv');
const authMiddleware = require('../middleware/auth');
const { sendStatusUpdate } = require('../utils/emailService');

// Connexion admin
router.post('/login', async (req, res) => {

  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email et mot de passe requis' });
    }

    const admin = await Admin.findOne({ email: email.toLowerCase() });
    if (!admin) {
      return res.status(401).json({ error: 'Identifiants incorrects' });
    }

    const isValidPassword = await admin.comparePassword(password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Identifiants incorrects' });
    }

    const token = jwt.sign(
      { adminId: admin._id, email: admin.email },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );

    res.json({ 
      success: true,
      token,
      admin: { id: admin._id, email: admin.email }
    });
  } catch (error) {
    console.error('Erreur login admin:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Récupérer tous les RDV (protégé)
router.get('/rdv', authMiddleware, async (req, res) => {
  try {
    const rdvs = await Rdv.find().sort({ createdAt: -1 });
    res.json(rdvs);
  } catch (error) {
    console.error('Erreur récupération RDV:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Mettre à jour le statut d'un RDV (protégé)
router.patch('/rdv/:id/status', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['pending', 'confirmed', 'cancelled'].includes(status)) {
      return res.status(400).json({ error: 'Statut invalide' });
    }

    const rdv = await Rdv.findByIdAndUpdate(
      id, 
      { status }, 
      { new: true }
    );

    if (!rdv) {
      return res.status(404).json({ error: 'Rendez-vous introuvable' });
    }

    // Envoyer email si confirmé ou annulé
    if (status === 'confirmed' || status === 'cancelled') {
      await sendStatusUpdate(rdv, status);
    }

    res.json({ success: true, rdv });
  } catch (error) {
    console.error('Erreur mise à jour statut:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

module.exports = router;