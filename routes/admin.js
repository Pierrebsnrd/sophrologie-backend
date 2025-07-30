var express = require('express');
var router = express.Router();
const jwt = require('jsonwebtoken');
const Admin = require('../models/admin');
const Temoignage = require('../models/temoignage');
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

    console.log('🔍 Tentative de connexion pour:', email);

    const admin = await Admin.findOne({ email: email.toLowerCase() });
    if (!admin) {
      console.log('❌ Admin non trouvé pour:', email);
      return res.status(401).json({ error: 'Identifiants incorrects' });
    }

    // Vérification avec gestion d'erreur
    const isValidPassword = await admin.comparePassword(password);
    if (!isValidPassword) {
      console.log('❌ Mot de passe incorrect pour:', email);
      return res.status(401).json({ error: 'Identifiants incorrects' });
    }

    console.log('✅ Connexion réussie pour:', email);

    // Mettre à jour les statistiques de connexion
    await Admin.findByIdAndUpdate(admin._id, {
      lastLogin: new Date(),
      $inc: { loginCount: 1 }
    });

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
    console.error('❌ Erreur login admin:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Récupérer tous les témoignages (admin uniquement)
router.get('/temoignages', authMiddleware, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const total = await Temoignage.countDocuments();
    const temoignages = await Temoignage.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    const totalPages = Math.ceil(total / limit);
    
    res.json({
      success: true,
      data: {
        temoignages: temoignages,
        pagination: {
          currentPage: page,
          totalPages: totalPages,
          total: total,
          limit: limit
        }
      }
    });
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

    const temoignage = await Temoignage.findByIdAndUpdate(id, { status }, { new: true });
    if (!temoignage) {
      return res.status(404).json({ error: 'Témoignage non trouvé' });
    }
    res.json({ success: true, data: temoignage });
  } catch (error) {
    console.error('Erreur maj statut témoignage:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Récupérer tous les messages de contact (admin uniquement)
router.get('/contact-messages', authMiddleware, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const total = await ContactMessage.countDocuments();
    const messages = await ContactMessage.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    const totalPages = Math.ceil(total / limit);
    
    res.json({
      success: true,
      data: {
        messages: messages,
        pagination: {
          currentPage: page,
          totalPages: totalPages,
          total: total,
          limit: limit
        }
      }
    });
  } catch (error) {
    console.error('Erreur récupération messages:', error);
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
    console.error('Erreur mise à jour message:', error);
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
    console.error('Erreur suppression message:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Supprimer un témoignage
router.delete('/temoignages/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Temoignage.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ error: 'Témoignage non trouvé' });
    }
    res.json({ success: true });
  } catch (error) {
    console.error('Erreur suppression témoignage:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Route pour récupérer le profil admin - CORRECTION ICI
router.get('/profile', authMiddleware, async (req, res) => {
  try {
    console.log('🔍 Récupération profil pour admin ID:', req.admin._id);
    
    const admin = await Admin.findById(req.admin._id).select('-passwordHash');
    
    if (!admin) {
      console.log('❌ Admin non trouvé avec ID:', req.admin._id);
      return res.status(404).json({ error: 'Admin non trouvé' });
    }

    console.log('✅ Profil récupéré:', {
      id: admin._id,
      email: admin.email,
      createdAt: admin.createdAt,
      lastLogin: admin.lastLogin,
      loginCount: admin.loginCount
    });

    // CORRECTION: S'assurer que createdAt existe toujours
    const profileData = {
      id: admin._id,
      email: admin.email,
      createdAt: admin.createdAt || new Date(), // Fallback si manquant
      lastLogin: admin.lastLogin || null,
      loginCount: admin.loginCount || 0
    };

    res.json({
      success: true,
      data: profileData
    });
  } catch (error) {
    console.error('❌ Erreur récupération profil admin:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Route pour changer le mot de passe admin - CORRECTION ICI AUSSI
router.patch('/profile/password', authMiddleware, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Mot de passe actuel et nouveau requis' });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({ error: 'Le nouveau mot de passe doit contenir au moins 8 caractères' });
    }

    // CORRECTION: Utiliser req.admin._id au lieu de req.admin.adminId
    const admin = await Admin.findById(req.admin._id);
    if (!admin) {
      return res.status(404).json({ error: 'Admin non trouvé' });
    }

    console.log('🔍 Changement de mot de passe pour:', admin.email);

    // Vérifier le mot de passe actuel
    const isValid = await admin.comparePassword(currentPassword);
    if (!isValid) {
      console.log('❌ Mot de passe actuel incorrect');
      return res.status(401).json({ error: 'Mot de passe actuel incorrect' });
    }

    // Hasher le nouveau mot de passe
    const bcrypt = require('bcrypt');
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(newPassword, saltRounds);

    // Mettre à jour le mot de passe
    await Admin.findByIdAndUpdate(admin._id, { passwordHash });

    console.log('✅ Mot de passe changé avec succès pour:', admin.email);

    res.json({
      success: true,
      message: 'Mot de passe changé avec succès'
    });
  } catch (error) {
    console.error('❌ Erreur changement mot de passe:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

module.exports = router;