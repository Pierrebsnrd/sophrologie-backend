// routes/pages.js - Version corrigée
const express = require('express');
const router = express.Router();
const PageContent = require('../models/pageContent');
const defaultContents = require('../data/completeDefaultContents');

// Route publique pour récupérer le contenu d'une page
router.get('/:pageId', async (req, res) => {
  try {
    const { pageId } = req.params;
    
    // Vérifier que le pageId est valide
    const validPageIds = ['home', 'about', 'pricing', 'appointment', 'testimonials', 'contact', 'ethics'];
    if (!validPageIds.includes(pageId)) {
      return res.status(404).json({ error: 'Page non trouvée' });
    }

    let pageContent = await PageContent.findOne({ pageId, status: 'published' });

    // Si la page n'existe pas en base, créer le contenu par défaut
    if (!pageContent) {
      console.log(`📄 Création automatique du contenu pour la page publique: ${pageId}`);
      pageContent = await createDefaultPageContent(pageId);
    }

    // Filtrer uniquement les sections visibles pour le public
    const visibleSections = (pageContent.sections || [])
      .filter(section => section.settings?.visible !== false)
      .sort((a, b) => (a.order || 0) - (b.order || 0))
      .map(section => {
        // Nettoyer les sections pour l'affichage public
        const cleanSection = { ...section };
        
        // Supprimer les champs internes si nécessaire
        delete cleanSection.__v;
        delete cleanSection._id;
        
        return cleanSection;
      });

    // Réponse optimisée pour le frontend
    const responseData = {
      pageId: pageContent.pageId,
      title: pageContent.title,
      metaDescription: pageContent.metaDescription,
      sections: visibleSections,
      lastModified: pageContent.lastModified
    };

    // Headers de cache pour améliorer les performances
    res.set({
      'Cache-Control': 'public, max-age=300', // 5 minutes de cache
      'Last-Modified': pageContent.lastModified?.toUTCString() || new Date().toUTCString()
    });

    res.json({
      success: true,
      data: responseData
    });
    
  } catch (error) {
    console.error('Erreur récupération contenu page publique:', error);
    res.status(500).json({ 
      error: 'Erreur serveur',
      message: process.env.NODE_ENV === 'development' ? error.message : 'Une erreur est survenue'
    });
  }
});

// Fonction utilitaire pour créer le contenu par défaut d'une page
async function createDefaultPageContent(pageId) {
  console.log(`🔧 Création du contenu par défaut (public) pour: ${pageId}`);
  
  const pageData = defaultContents[pageId];
  if (!pageData) {
    throw new Error(`Contenu par défaut non trouvé pour la page: ${pageId}`);
  }

  console.log(`📝 Données publiques à créer:`, {
    pageId,
    title: pageData.title,
    sectionsCount: pageData.sections?.length || 0
  });

  try {
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
        comment: 'Version initiale créée automatiquement'
      }],
      autoSave: {
        enabled: true
      }
    });
    
    await pageContent.save();
    console.log(`✅ Page publique ${pageId} créée avec ${pageData.sections?.length || 0} sections`);
    
    return pageContent;
  } catch (error) {
    console.error(`❌ Erreur lors de la création de la page publique ${pageId}:`, error);
    throw error;
  }
}

module.exports = router;