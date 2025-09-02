// Fonction pour créer le contenu par défaut avec le nouveau système
async function createDefaultPageContent(pageId, defaultContents = completeDefaultContents) {
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
      sections: pageData.sections || [],
      currentVersion: 1,
      versions: [{
        versionNumber: 1,
        title: pageData.title,
        metaDescription: pageData.metaDescription,
        sections: JSON.parse(JSON.stringify(pageData.sections || [])),
        createdAt: new Date(),
        comment: 'Version initiale'
      }]
    });
    
    await pageContent.save();
    console.log(`✅ Page ${pageId} créée avec ${pageData.sections?.length || 0} sections`);
    
    return pageContent;
  } catch (error) {
    console.error(`❌ Erreur lors de la création de la page ${pageId}:`, error);
    throw error;
  }
}