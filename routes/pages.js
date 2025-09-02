// routes/pages.js - Nouvelle route publique
const express = require('express');
const router = express.Router();
const PageContent = require('../models/pageContent');
const defaultContents = require('../data/completeDefaultContents'); // Import du contenu complet

// Route publique pour récupérer le contenu d'une page
router.get('/:pageId', async (req, res) => {
  try {
    const { pageId } = req.params;
    
    // Vérifier que le pageId est valide
    const validPageIds = ['home', 'about', 'pricing', 'appointment', 'testimonials', 'contact', 'ethics'];
    if (!validPageIds.includes(pageId)) {
      return res.status(404).json({ error: 'Page non trouvée' });
    }

    let pageContent = await PageContent.findOne({ pageId });

    // Si la page n'existe pas en base, créer le contenu par défaut
    if (!pageContent) {
      console.log(`📄 Création automatique du contenu pour la page publique: ${pageId}`);
      pageContent = await createDefaultPageContent(pageId);
    }

    // Filtrer uniquement les sections visibles pour le public
    const visibleSections = pageContent.sections.filter(section => 
      section.settings?.visible !== false
    ).sort((a, b) => (a.order || 0) - (b.order || 0));

    res.json({
      success: true,
      data: {
        ...pageContent.toObject(),
        sections: visibleSections
      }
    });
  } catch (error) {
    console.error('Erreur récupération contenu page publique:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Fonction utilitaire pour créer le contenu par défaut d'une page
async function createDefaultPageContent(pageId) {
  console.log(`🔧 Création du contenu par défaut (public) pour: ${pageId}`);
  
  const pageData = defaultContents[pageId];
  if (!pageData) {
    console.error(`❌ Contenu par défaut non trouvé pour la page: ${pageId}`);
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
      sections: pageData.sections || []
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