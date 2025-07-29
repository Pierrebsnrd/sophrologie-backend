var express = require('express');
var router = express.Router();
const jwt = require('jsonwebtoken');
const Admin = require('../models/admin');
const Temoignage = require('../models/temoignage'); // ✅ Nom correct
const ContactMessage = require('../models/contactMessage');
const authMiddleware = require('../middleware/auth');

// Connexion admin
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation des champs requis
    if (!email || !password) {
      return res.status(400).json({ error: 'Email et mot de passe requis' });
    }

    const admin = await Admin.findOne({ email: email.toLowerCase() });
    if (!admin) {
      return res.status(401).json({ error: 'Identifiants incorrects' });
    }

    // Vérification avec gestion d'erreur
    try {
      const isValidPassword = await admin.comparePassword(password);
      if (!isValidPassword) {
        return res.status(401).json({ error: 'Identifiants incorrects' });
      }
    } catch (compareError) {
      console.error('Erreur comparePassword:', compareError);
      return res.status(500).json({ error: 'Erreur lors de la vérification du mot de passe' });
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

// Récupérer tous les témoignages (admin uniquement)
router.get('/temoignages', authMiddleware, async (req, res) => {
  try {
    const temoignages = await Temoignage.find().sort({ createdAt: -1 }); // ✅ Temoignage
    res.json(temoignages);
  } catch (error) {
    console.error('Erreur récupération témoignages:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Changer le statut d'un témoignage
router.patch('/temoignages/:id/status', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['validated', 'rejected'].includes(status)) {
      return res.status(400).json({ error: 'Statut invalide' });
    }

    const temoignage = await Temoignage.findByIdAndUpdate(id, { status }, { new: true }); // ✅ Temoignage
    if (!temoignage) {
      return res.status(404).json({ error: 'Témoignage non trouvé' });
    }
    res.json(temoignage);
  } catch (error) {
    console.error('Erreur maj statut témoignage:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Récupérer tous les messages de contact (admin uniquement)
router.get('/contact-messages', authMiddleware, async (req, res) => {
  try {
    const messages = await ContactMessage.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Mettre à jour le statut d'un message de contact (répondu/non répondu)
router.patch('/contact-messages/:id/answered', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const message = await ContactMessage.findByIdAndUpdate(
      id,
      { answered: true },
      { new: true }
    );
    if (!message) {
      return res.status(404).json({ error: 'Message non trouvé' });
    }
    res.json({ success: true, message });
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Supprimer un message de contact
router.delete('/contact-messages/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await ContactMessage.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ error: 'Message non trouvé' });
    }
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Supprimer un témoignage
router.delete('/temoignages/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Temoignage.findByIdAndDelete(id); // ✅ Temoignage
    if (!deleted) {
      return res.status(404).json({ error: 'Témoignage non trouvé' });
    }
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

module.exports = router;