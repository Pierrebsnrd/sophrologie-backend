var express = require('express');
var router = express.Router();
const jwt = require('jsonwebtoken');
const Admin = require('../models/admin');
const Temoignage = require('../models/temoignage');
const ContactMessage = require('../models/contactMessage');
const PageContent = require('../models/pageContent');
const authMiddleware = require('../middleware/auth');
const defaultContents = require('../data/completeDefaultContents'); // Import du contenu complet

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

// Route pour récupérer le profil admin
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

    const profileData = {
      id: admin._id,
      email: admin.email,
      createdAt: admin.createdAt || new Date(),
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

// Route pour changer le mot de passe admin
router.patch('/profile/password', authMiddleware, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Mot de passe actuel et nouveau requis' });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({ error: 'Le nouveau mot de passe doit contenir au moins 8 caractères' });
    }

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

// Récupérer le contenu d'une page
router.get('/pages/:pageId', authMiddleware, async (req, res) => {
  try {
    const { pageId } = req.params;

    let pageContent = await PageContent.findOne({ pageId });

    // Si la page n'existe pas, créer un contenu par défaut
    if (!pageContent) {
      console.log(`📄 Création du contenu par défaut pour la page: ${pageId}`);
      pageContent = await createDefaultPageContent(pageId);
    }

    res.json({
      success: true,
      data: pageContent
    });
  } catch (error) {
    console.error('Erreur récupération contenu page:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Mettre à jour le contenu avec création automatique de version
router.put('/pages/:pageId', authMiddleware, async (req, res) => {
  try {
    const { pageId } = req.params;
    const { createVersion, versionComment, ...updateData } = req.body;

    let pageContent = await PageContent.findOne({ pageId });

    if (!pageContent) {
      // Créer la page avec le contenu par défaut
      pageContent = await createDefaultPageContent(pageId, completeDefaultContents);
    }

    // Créer une version si demandée
    if (createVersion) {
      pageContent.createVersion(versionComment || 'Sauvegarde automatique');
    }

    // Mettre à jour les données
    Object.assign(pageContent, {
      ...updateData,
      modifiedBy: req.admin._id
    });

    await pageContent.save();

    console.log(`✅ Page ${pageId} mise à jour avec succès`);

    res.json({
      success: true,
      data: pageContent
    });
  } catch (error) {
    console.error('Erreur mise à jour contenu page:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Récupérer toutes les pages pour la liste
router.get('/pages', authMiddleware, async (req, res) => {
  try {
    const pages = await PageContent.find()
      .select('pageId title lastModified')
      .sort({ pageId: 1 });

    // Ajouter les pages manquantes avec contenu par défaut
    const existingPageIds = pages.map(p => p.pageId);
    const allPageIds = ['home', 'about', 'pricing', 'appointment', 'testimonials', 'contact', 'ethics'];

    for (const pageId of allPageIds) {
      if (!existingPageIds.includes(pageId)) {
        console.log(`📄 Création automatique de la page manquante: ${pageId}`);
        await createDefaultPageContent(pageId);
      }
    }

    // Récupérer à nouveau avec les pages créées
    const allPages = await PageContent.find()
      .select('pageId title lastModified')
      .sort({ pageId: 1 });

    res.json({
      success: true,
      data: allPages
    });
  } catch (error) {
    console.error('Erreur récupération pages:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Dupliquer une page
router.post('/pages/:pageId/duplicate', authMiddleware, async (req, res) => {
  try {
    const { pageId } = req.params;
    const { newPageId, newTitle } = req.body;

    const originalPage = await PageContent.findOne({ pageId });
    if (!originalPage) {
      return res.status(404).json({ error: 'Page source non trouvée' });
    }

    // Vérifier que la nouvelle page n'existe pas
    const existingPage = await PageContent.findOne({ pageId: newPageId });
    if (existingPage) {
      return res.status(400).json({ error: 'Une page avec cet ID existe déjà' });
    }

    const mongoose = require('mongoose');
    const duplicatedPage = new PageContent({
      pageId: newPageId,
      title: newTitle,
      metaDescription: originalPage.metaDescription,
      sections: originalPage.sections.map(section => ({
        ...section.toObject(),
        id: new mongoose.Types.ObjectId().toString()
      })),
      modifiedBy: req.admin._id
    });

    await duplicatedPage.save();

    res.json({
      success: true,
      data: duplicatedPage
    });
  } catch (error) {
    console.error('Erreur duplication page:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Réorganiser les sections d'une page
router.post('/pages/:pageId/reorder', authMiddleware, async (req, res) => {
  try {
    const { pageId } = req.params;
    const { sectionOrders } = req.body; // [{ id, order }, ...]

    const pageContent = await PageContent.findOne({ pageId });
    if (!pageContent) {
      return res.status(404).json({ error: 'Page non trouvée' });
    }

    pageContent.reorderSections(sectionOrders);
    pageContent.modifiedBy = req.admin._id;
    await pageContent.save();

    res.json({
      success: true,
      data: pageContent
    });
  } catch (error) {
    console.error('Erreur réorganisation sections:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Upload d'image pour les sections
router.post('/pages/upload-image', authMiddleware, async (req, res) => {
  try {
    // Ici vous devez implémenter l'upload d'images
    // Exemple avec multer et Cloudinary

    if (!req.file) {
      return res.status(400).json({ error: 'Aucun fichier fourni' });
    }

    // Upload vers votre service (Cloudinary, S3, etc.)
    // const imageUrl = await uploadToCloudinary(req.file);

    // Pour l'instant, on simule
    const imageUrl = `/uploads/${req.file.filename}`;

    res.json({
      success: true,
      data: {
        url: imageUrl,
        alt: req.body.alt || ''
      }
    });
  } catch (error) {
    console.error('Erreur upload image:', error);
    res.status(500).json({ error: 'Erreur upload' });
  }
});

// Fonction utilitaire pour créer le contenu par défaut d'une page
async function createDefaultPageContent(pageId) {
  console.log(`🔧 Création du contenu par défaut pour: ${pageId}`);

  const pageData = defaultContents[pageId];
  if (!pageData) {
    console.error(`❌ Contenu par défaut non trouvé pour la page: ${pageId}`);
    throw new Error(`Contenu par défaut non trouvé pour la page: ${pageId}`);
  }

  console.log(`📝 Données à créer:`, {
    pageId,
    title: pageData.title,
    sectionsCount: pageData.sections?.length || 0,
    firstSectionType: pageData.sections?.[0]?.type || 'none'
  });

  try {
    const pageContent = new PageContent({
      pageId,
      title: pageData.title,
      metaDescription: pageData.metaDescription,
      sections: pageData.sections || []
    });

    await pageContent.save();
    console.log(`✅ Page ${pageId} créée avec ${pageData.sections?.length || 0} sections`);

    return pageContent;
  } catch (error) {
    console.error(`❌ Erreur lors de la création de la page ${pageId}:`, error);
    throw error;
  }
}

// routes/admin.js - Ajouts pour la gestion des versions

// Récupérer l'historique d'une page
router.get('/pages/:pageId/history', authMiddleware, async (req, res) => {
  try {
    const { pageId } = req.params;

    const pageContent = await PageContent.findOne({ pageId })
      .populate('versions.createdBy', 'email')
      .populate('modifiedBy', 'email');

    if (!pageContent) {
      return res.status(404).json({ error: 'Page non trouvée' });
    }

    const history = pageContent.getVersionHistory();

    res.json({
      success: true,
      data: {
        currentVersion: pageContent.currentVersion,
        history: history
      }
    });
  } catch (error) {
    console.error('Erreur récupération historique:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Restaurer une version spécifique
router.post('/pages/:pageId/restore/:versionNumber', authMiddleware, async (req, res) => {
  try {
    const { pageId, versionNumber } = req.params;
    const { comment } = req.body;

    const pageContent = await PageContent.findOne({ pageId });
    if (!pageContent) {
      return res.status(404).json({ error: 'Page non trouvée' });
    }

    pageContent.restoreVersion(parseInt(versionNumber), req.admin._id);

    // Ajouter un commentaire pour la restauration
    if (comment) {
      const currentVersion = pageContent.versions[pageContent.versions.length - 1];
      if (currentVersion) {
        currentVersion.comment = `Restauration v${versionNumber}: ${comment}`;
      }
    }

    await pageContent.save();

    console.log(`✅ Version ${versionNumber} restaurée pour la page ${pageId}`);

    res.json({
      success: true,
      data: pageContent,
      message: `Version ${versionNumber} restaurée avec succès`
    });
  } catch (error) {
    console.error('Erreur restauration version:', error);
    res.status(500).json({ error: error.message || 'Erreur serveur' });
  }
});

// Sauvegarde automatique
router.post('/pages/:pageId/autosave', authMiddleware, async (req, res) => {
  try {
    const { pageId } = req.params;
    const data = req.body;

    const pageContent = await PageContent.findOne({ pageId });
    if (!pageContent) {
      return res.status(404).json({ error: 'Page non trouvée' });
    }

    await pageContent.autoSaveData(data, req.admin._id);

    res.json({
      success: true,
      message: 'Sauvegarde automatique effectuée',
      timestamp: new Date()
    });
  } catch (error) {
    console.error('Erreur sauvegarde automatique:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Créer une version avec commentaire
router.post('/pages/:pageId/create-version', authMiddleware, async (req, res) => {
  try {
    const { pageId } = req.params;
    const { comment } = req.body;

    const pageContent = await PageContent.findOne({ pageId });
    if (!pageContent) {
      return res.status(404).json({ error: 'Page non trouvée' });
    }

    const newVersion = pageContent.createVersion(comment || 'Version manuelle');
    pageContent.modifiedBy = req.admin._id;
    await pageContent.save();

    res.json({
      success: true,
      data: newVersion,
      message: 'Version créée avec succès'
    });
  } catch (error) {
    console.error('Erreur création version:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

module.exports = router;