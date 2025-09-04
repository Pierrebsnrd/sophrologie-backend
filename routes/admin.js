// routes/admin.js - Version complète avec gestion des versions
var express = require('express');
var router = express.Router();
const jwt = require('jsonwebtoken');
const Admin = require('../models/admin');
const Temoignage = require('../models/temoignage');
const ContactMessage = require('../models/contactMessage');
const PageContent = require('../models/pageContent');
const authMiddleware = require('../middleware/auth');
const defaultContents = require('../data/completeDefaultContents');

// ====================================
// AUTHENTIFICATION (inchangé)
// ====================================

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email et mot de passe requis' });
    }

    console.log('🔍 Tentative de connexion pour:', email);

    const admin = await Admin.findOne({ email: email.toLowerCase() });
    if (!admin) {
      console.log('❌ Admin non trouvé pour:', email);
      return res.status(401).json({ error: 'Identifiants incorrects' });
    }

    const isValidPassword = await admin.comparePassword(password);
    if (!isValidPassword) {
      console.log('❌ Mot de passe incorrect pour:', email);
      return res.status(401).json({ error: 'Identifiants incorrects' });
    }

    console.log('✅ Connexion réussie pour:', email);

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

// ====================================
// GESTION DES TÉMOIGNAGES (inchangé)
// ====================================

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

// ====================================
// GESTION DES MESSAGES DE CONTACT (inchangé)
// ====================================

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

// ====================================
// GESTION PROFIL ADMIN (inchangé)
// ====================================

router.get('/profile', authMiddleware, async (req, res) => {
  try {
    console.log('🔍 Récupération profil pour admin ID:', req.admin._id);

    const admin = await Admin.findById(req.admin._id).select('-passwordHash');

    if (!admin) {
      console.log('❌ Admin non trouvé avec ID:', req.admin._id);
      return res.status(404).json({ error: 'Admin non trouvé' });
    }

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

    const isValid = await admin.comparePassword(currentPassword);
    if (!isValid) {
      return res.status(401).json({ error: 'Mot de passe actuel incorrect' });
    }

    const bcrypt = require('bcrypt');
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(newPassword, saltRounds);

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

// ====================================
// GESTION COMPLÈTE DES PAGES AVEC VERSIONS
// ====================================

// Liste de toutes les pages avec métadonnées enrichies
router.get('/pages', authMiddleware, async (req, res) => {
  try {
    const pages = await PageContent.find()
      .select('pageId title lastModified status currentVersion')
      .sort({ pageId: 1 });

    // Vérifier que toutes les pages requises existent
    const existingPageIds = pages.map(p => p.pageId);
    const allPageIds = Object.keys(defaultContents);
    const missingPages = allPageIds.filter(id => !existingPageIds.includes(id));

    // Créer les pages manquantes
    for (const pageId of missingPages) {
      console.log(`📄 Création automatique de la page manquante: ${pageId}`);
      try {
        await createPageWithDefaultContent(pageId, req.admin.email);
      } catch (createError) {
        console.error(`❌ Erreur création page ${pageId}:`, createError);
      }
    }

    // Récupérer à nouveau avec les pages créées
    const allPages = await PageContent.find()
      .select('pageId title lastModified status currentVersion autoSave')
      .sort({ pageId: 1 });

    // Enrichir avec des métadonnées et statistiques
    const enrichedPages = await Promise.all(allPages.map(async page => {
      const stats = page.getVersionStats();
      return {
        ...page.toObject(),
        displayName: getPageDisplayName(page.pageId),
        url: getPageUrl(page.pageId),
        description: getPageDescription(page.pageId),
        stats: stats,
        sectionsCount: page.sections?.length || 0
      };
    }));

    res.json({
      success: true,
      data: enrichedPages,
      totalPages: enrichedPages.length,
      missingPagesCreated: missingPages.length
    });
  } catch (error) {
    console.error('Erreur récupération pages:', error);
    res.status(500).json({ 
      error: 'Erreur lors du chargement des pages',
      message: process.env.NODE_ENV === 'development' ? error.message : 'Erreur interne'
    });
  }
});

// Récupérer une page avec toutes ses informations et versions
router.get('/pages/:pageId', authMiddleware, async (req, res) => {
  try {
    const { pageId } = req.params;
    const includeVersions = req.query.includeVersions === 'true';

    if (!isValidPageId(pageId)) {
      return res.status(400).json({ 
        error: 'ID de page invalide', 
        validIds: Object.keys(defaultContents)
      });
    }

    let pageContent = await PageContent.findOne({ pageId });

    // Si la page n'existe pas, créer un contenu par défaut
    if (!pageContent) {
      console.log(`📄 Création automatique du contenu pour: ${pageId}`);
      pageContent = await createPageWithDefaultContent(pageId, req.admin.email);
    }

    // Préparer la réponse
    const responseData = {
      pageId: pageContent.pageId,
      title: pageContent.title,
      metaDescription: pageContent.metaDescription,
      sections: pageContent.sections.sort((a, b) => (a.order || 0) - (b.order || 0)),
      status: pageContent.status,
      currentVersion: pageContent.currentVersion,
      lastModified: pageContent.lastModified,
      autoSave: pageContent.autoSave,
      stats: pageContent.getVersionStats()
    };

    // Inclure les versions si demandé
    if (includeVersions) {
      responseData.versions = pageContent.versions
        .sort((a, b) => b.versionNumber - a.versionNumber) // Plus récentes d'abord
        .slice(0, 20); // Limiter à 20 versions max
    }

    res.json({
      success: true,
      data: responseData
    });
  } catch (error) {
    console.error('Erreur récupération contenu page:', error);
    res.status(500).json({ 
      error: 'Erreur serveur',
      message: process.env.NODE_ENV === 'development' ? error.message : 'Erreur interne'
    });
  }
});

// Mettre à jour une page avec création automatique de version
router.put('/pages/:pageId', authMiddleware, async (req, res) => {
  try {
    const { pageId } = req.params;
    const updateData = req.body;
    const { comment } = req.query; // Commentaire optionnel pour la version

    if (!isValidPageId(pageId)) {
      return res.status(400).json({ 
        error: 'ID de page invalide',
        validIds: Object.keys(defaultContents)
      });
    }

    // Validation des données
    const validationResult = validatePageData(updateData);
    if (!validationResult.isValid) {
      return res.status(400).json({ 
        error: 'Données invalides',
        details: validationResult.errors
      });
    }

    let pageContent = await PageContent.findOne({ pageId });
    if (!pageContent) {
      pageContent = await createPageWithDefaultContent(pageId, req.admin.email);
    }

    // Créer une version avant la modification
    if (hasContentChanged(pageContent, updateData)) {
      const versionComment = comment || `Modification par ${req.admin.email}`;
      pageContent.createVersion(versionComment, req.admin.email);
    }

    // Mettre à jour le contenu
    if (updateData.title) pageContent.title = updateData.title;
    if (updateData.metaDescription !== undefined) pageContent.metaDescription = updateData.metaDescription;
    if (updateData.sections) {
      // Nettoyer et valider les sections
      pageContent.sections = cleanAndValidateSections(updateData.sections);
    }
    if (updateData.status) pageContent.status = updateData.status;

    pageContent.lastModifiedBy = req.admin.email;
    await pageContent.save();

    console.log(`✅ Page ${pageId} mise à jour par ${req.admin.email}`);

    res.json({
      success: true,
      data: {
        pageId: pageContent.pageId,
        title: pageContent.title,
        metaDescription: pageContent.metaDescription,
        sections: pageContent.sections.sort((a, b) => (a.order || 0) - (b.order || 0)),
        currentVersion: pageContent.currentVersion,
        stats: pageContent.getVersionStats()
      },
      message: 'Page mise à jour avec succès'
    });
  } catch (error) {
    console.error('Erreur mise à jour page:', error);
    res.status(500).json({ 
      error: 'Erreur lors de la sauvegarde',
      message: process.env.NODE_ENV === 'development' ? error.message : 'Erreur interne'
    });
  }
});

// Récupérer l'historique des versions d'une page
router.get('/pages/:pageId/versions', authMiddleware, async (req, res) => {
  try {
    const { pageId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    if (!isValidPageId(pageId)) {
      return res.status(400).json({ error: 'ID de page invalide' });
    }

    const pageContent = await PageContent.findOne({ pageId });
    if (!pageContent) {
      return res.status(404).json({ error: 'Page non trouvée' });
    }

    // Pagination des versions
    const versions = pageContent.versions
      .sort((a, b) => b.versionNumber - a.versionNumber) // Plus récentes d'abord
      .slice((page - 1) * limit, page * limit)
      .map(version => ({
        versionNumber: version.versionNumber,
        createdAt: version.createdAt,
        createdBy: version.createdBy,
        comment: version.comment,
        sectionsCount: version.sections?.length || 0
      }));

    const totalVersions = pageContent.versions.length;
    const totalPages = Math.ceil(totalVersions / limit);

    res.json({
      success: true,
      data: {
        versions,
        currentVersion: pageContent.currentVersion,
        pagination: {
          currentPage: page,
          totalPages,
          total: totalVersions,
          limit
        }
      }
    });
  } catch (error) {
    console.error('Erreur récupération versions:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Récupérer une version spécifique
router.get('/pages/:pageId/versions/:versionNumber', authMiddleware, async (req, res) => {
  try {
    const { pageId, versionNumber } = req.params;

    if (!isValidPageId(pageId)) {
      return res.status(400).json({ error: 'ID de page invalide' });
    }

    const pageContent = await PageContent.findOne({ pageId });
    if (!pageContent) {
      return res.status(404).json({ error: 'Page non trouvée' });
    }

    const version = pageContent.versions.find(v => v.versionNumber === parseInt(versionNumber));
    if (!version) {
      return res.status(404).json({ error: 'Version non trouvée' });
    }

    res.json({
      success: true,
      data: {
        versionNumber: version.versionNumber,
        title: version.title,
        metaDescription: version.metaDescription,
        sections: version.sections.sort((a, b) => (a.order || 0) - (b.order || 0)),
        createdAt: version.createdAt,
        createdBy: version.createdBy,
        comment: version.comment
      }
    });
  } catch (error) {
    console.error('Erreur récupération version:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Restaurer une version spécifique
router.post('/pages/:pageId/versions/:versionNumber/restore', authMiddleware, async (req, res) => {
  try {
    const { pageId, versionNumber } = req.params;
    const { comment } = req.body;

    if (!isValidPageId(pageId)) {
      return res.status(400).json({ error: 'ID de page invalide' });
    }

    const pageContent = await PageContent.findOne({ pageId });
    if (!pageContent) {
      return res.status(404).json({ error: 'Page non trouvée' });
    }

    const restoredVersion = pageContent.restoreVersion(
      parseInt(versionNumber), 
      req.admin.email
    );

    // Ajouter un commentaire personnalisé si fourni
    if (comment) {
      const lastVersion = pageContent.versions[pageContent.versions.length - 1];
      lastVersion.comment = comment;
    }

    await pageContent.save();

    console.log(`✅ Version ${versionNumber} restaurée pour ${pageId} par ${req.admin.email}`);

    res.json({
      success: true,
      data: {
        pageId: pageContent.pageId,
        title: pageContent.title,
        currentVersion: pageContent.currentVersion,
        restoredFrom: restoredVersion.versionNumber,
        stats: pageContent.getVersionStats()
      },
      message: `Version ${versionNumber} restaurée avec succès`
    });
  } catch (error) {
    console.error('Erreur restauration version:', error);
    res.status(500).json({ 
      error: 'Erreur lors de la restauration',
      message: error.message
    });
  }
});

// Sauvegarder un brouillon
router.post('/pages/:pageId/draft', authMiddleware, async (req, res) => {
  try {
    const { pageId } = req.params;
    const draftData = req.body;

    if (!isValidPageId(pageId)) {
      return res.status(400).json({ error: 'ID de page invalide' });
    }

    let pageContent = await PageContent.findOne({ pageId });
    if (!pageContent) {
      pageContent = await createPageWithDefaultContent(pageId, req.admin.email);
    }

    // Sauvegarder le brouillon
    pageContent.saveDraft({
      title: draftData.title,
      metaDescription: draftData.metaDescription,
      sections: draftData.sections ? cleanAndValidateSections(draftData.sections) : undefined
    });

    await pageContent.save();

    res.json({
      success: true,
      message: 'Brouillon sauvegardé',
      data: {
        savedAt: pageContent.autoSave.draft.savedAt,
        hasDraft: true
      }
    });
  } catch (error) {
    console.error('Erreur sauvegarde brouillon:', error);
    res.status(500).json({ error: 'Erreur lors de la sauvegarde du brouillon' });
  }
});

// Publier un brouillon
router.post('/pages/:pageId/draft/publish', authMiddleware, async (req, res) => {
  try {
    const { pageId } = req.params;
    const { comment } = req.body;

    if (!isValidPageId(pageId)) {
      return res.status(400).json({ error: 'ID de page invalide' });
    }

    const pageContent = await PageContent.findOne({ pageId });
    if (!pageContent) {
      return res.status(404).json({ error: 'Page non trouvée' });
    }

    if (!pageContent.autoSave.draft) {
      return res.status(400).json({ error: 'Aucun brouillon à publier' });
    }

    pageContent.publishDraft(
      comment || `Publication du brouillon par ${req.admin.email}`,
      req.admin.email
    );

    await pageContent.save();

    console.log(`✅ Brouillon publié pour ${pageId} par ${req.admin.email}`);

    res.json({
      success: true,
      data: {
        pageId: pageContent.pageId,
        title: pageContent.title,
        currentVersion: pageContent.currentVersion,
        stats: pageContent.getVersionStats()
      },
      message: 'Brouillon publié avec succès'
    });
  } catch (error) {
    console.error('Erreur publication brouillon:', error);
    res.status(500).json({ 
      error: 'Erreur lors de la publication',
      message: error.message
    });
  }
});

// ====================================
// FONCTIONS UTILITAIRES
// ====================================

async function createPageWithDefaultContent(pageId, userId = null) {
  const pageData = defaultContents[pageId];
  if (!pageData) {
    throw new Error(`Contenu par défaut non trouvé pour la page: ${pageId}`);
  }

  console.log(`🔧 Création du contenu par défaut pour: ${pageId}`);

  const pageContent = new PageContent({
    pageId,
    title: pageData.title,
    metaDescription: pageData.metaDescription,
    sections: pageData.sections || [],
    currentVersion: 1,
    status: 'published',
    versions: [{
      versionNumber: 1,
      title: pageData.title,
      metaDescription: pageData.metaDescription,
      sections: JSON.parse(JSON.stringify(pageData.sections || [])),
      createdAt: new Date(),
      createdBy: userId,
      comment: 'Version initiale créée automatiquement'
    }],
    autoSave: {
      enabled: true,
      interval: 30000
    },
    createdBy: userId
  });

  await pageContent.save();
  console.log(`✅ Page ${pageId} créée avec ${pageData.sections?.length || 0} sections`);

  return pageContent;
}

function isValidPageId(pageId) {
  return Object.keys(defaultContents).includes(pageId);
}

function validatePageData(data) {
  const errors = [];

  if (data.title && typeof data.title !== 'string') {
    errors.push('Le titre doit être une chaîne de caractères');
  }

  if (data.sections && !Array.isArray(data.sections)) {
    errors.push('Les sections doivent être un tableau');
  }

  if (data.sections) {
    data.sections.forEach((section, index) => {
      if (!section.type) {
        errors.push(`Section ${index}: type manquant`);
      } else if (!PageContent.isValidSectionType(section.type)) {
        errors.push(`Section ${index}: type "${section.type}" non supporté`);
      }
      
      if (!section.id) {
        errors.push(`Section ${index}: id manquant`);
      }
    });
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

function hasContentChanged(existingPage, newData) {
  // Comparaison simple pour détecter les changements
  if (newData.title && newData.title !== existingPage.title) return true;
  if (newData.metaDescription !== undefined && newData.metaDescription !== existingPage.metaDescription) return true;
  if (newData.sections && JSON.stringify(newData.sections) !== JSON.stringify(existingPage.sections)) return true;
  
  return false;
}

function cleanAndValidateSections(sections) {
  return sections.map((section, index) => {
    // Générer un ID si manquant
    if (!section.id) {
      section.id = `section_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
    
    // Assigner un ordre si manquant
    if (section.order === undefined) {
      section.order = index;
    }
    
    // Valider le type
    if (!section.type || !PageContent.isValidSectionType(section.type)) {
      console.warn(`Section ${section.id}: type "${section.type}" invalide, utilisation de 'text' par défaut`);
      section.type = 'text';
    }

    // Assurer les paramètres par défaut
    if (!section.settings) {
      section.settings = { visible: true };
    }
    
    return section;
  });
}

function getPageDisplayName(pageId) {
  const names = {
    home: 'Accueil',
    about: 'Qui suis-je ?',
    pricing: 'Tarifs',
    appointment: 'Prendre rendez-vous',
    testimonials: 'Témoignages',
    contact: 'Contact',
    ethics: 'Charte éthique'
  };
  return names[pageId] || pageId;
}

function getPageUrl(pageId) {
  const urls = {
    home: '/',
    about: '/qui-suis-je',
    pricing: '/tarifs',
    appointment: '/rdv',
    testimonials: '/temoignages',
    contact: '/contact',
    ethics: '/charte'
  };
  return urls[pageId] || `/${pageId}`;
}

function getPageDescription(pageId) {
  const descriptions = {
    home: 'Page principale avec présentation et services',
    about: 'Parcours et présentation personnelle',
    pricing: 'Tarifs des séances et prestations',
    appointment: 'Prise de rendez-vous en ligne',
    testimonials: 'Témoignages clients et formulaire',
    contact: 'Coordonnées et formulaire de contact',
    ethics: 'Charte éthique et déontologique'
  };
  return descriptions[pageId] || 'Page du site web';
}

module.exports = router;