// models/pageContent.js - Version corrigée avec schéma unifié
const mongoose = require('mongoose');

// Schéma unifié pour les sections (utilisé partout)
const sectionSchema = new mongoose.Schema({
  id: { type: String, required: true },
  type: { 
    type: String, 
    required: true,
    enum: [
      'hero', 'text', 'image', 'card-grid', 'cta', 'list',
      'contact-info', 'testimonial-form', 'pricing-table',
      'image-text', 'testimonial-list', 'appointment-widget',
      'contact-form-map', 'list-sections'
    ]
  },
  title: String,
  subtitle: String,
  content: String,
  image: {
    url: String,
    alt: String
  },
  buttons: [{
    text: String,
    url: String,
    style: String
  }],
  items: [{
    title: String,
    content: String,
    image: {
      url: String,
      alt: String
    },
    price: String,
    duration: String,
    highlighted: Boolean
  }],
  // Pour les sections de liste (charte éthique)
  sections: [{
    title: String,
    items: [String]
  }],
  // Pour les témoignages statiques
  staticTestimonials: [{
    author: String,
    message: String,
    date: String
  }],
  fetchFromApi: Boolean,
  settings: {
    backgroundColor: String,
    textColor: String,
    backgroundImage: String,
    alignment: String,
    padding: String,
    margin: String,
    fullWidth: Boolean,
    visible: { type: Boolean, default: true },
    imagePosition: String
  },
  order: { type: Number, default: 0 }
}, { _id: false }); // Pas d'_id automatique pour les sous-documents

// Schéma pour une version de page
const versionSchema = new mongoose.Schema({
  versionNumber: { type: Number, required: true },
  title: String,
  metaDescription: String,
  sections: [sectionSchema], // Utiliser le même schéma
  createdAt: { type: Date, default: Date.now },
  createdBy: String,
  comment: String
}, { _id: false }); // Pas d'_id automatique

// Schéma principal PageContent
const pageContentSchema = new mongoose.Schema({
  pageId: { 
    type: String, 
    required: true, 
    unique: true,
    enum: ['home', 'about', 'pricing', 'appointment', 'testimonials', 'contact', 'ethics']
  },
  title: { type: String, required: true },
  metaDescription: String,
  
  // Contenu actuel (version publiée)
  sections: [sectionSchema], // Utiliser le même schéma
  
  // Système de versions
  currentVersion: { type: Number, default: 1 },
  versions: [versionSchema],
  
  // Statut et métadonnées
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'published'
  },
  
  // Sauvegarde automatique
  autoSave: {
    enabled: { type: Boolean, default: true },
    lastSave: Date,
    interval: { type: Number, default: 30000 }, // 30 secondes
    draft: {
      title: String,
      metaDescription: String,
      sections: [sectionSchema], // Même schéma ici aussi
      savedAt: Date
    }
  },
  
  // Métadonnées
  createdAt: { type: Date, default: Date.now },
  lastModified: { type: Date, default: Date.now },
  createdBy: String,
  lastModifiedBy: String
});

// Index pour améliorer les performances
pageContentSchema.index({ pageId: 1, status: 1 });
pageContentSchema.index({ lastModified: -1 });

// Middleware pour mettre à jour lastModified
pageContentSchema.pre('save', function(next) {
  this.lastModified = new Date();
  next();
});

// Méthode pour créer une nouvelle version
pageContentSchema.methods.createVersion = function(comment = '', userId = null) {
  const newVersionNumber = this.currentVersion + 1;
  
  // Cloner proprement les sections pour éviter les références
  const clonedSections = this.sections.map(section => {
    const cloned = section.toObject ? section.toObject() : { ...section };
    delete cloned._id; // Supprimer l'_id si présent
    return cloned;
  });
  
  const newVersion = {
    versionNumber: newVersionNumber,
    title: this.title,
    metaDescription: this.metaDescription,
    sections: clonedSections,
    createdAt: new Date(),
    createdBy: userId,
    comment: comment || `Version ${newVersionNumber}`
  };
  
  this.versions.push(newVersion);
  this.currentVersion = newVersionNumber;
  
  // Limiter à 50 versions maximum pour éviter la surcharge
  if (this.versions.length > 50) {
    this.versions = this.versions.slice(-50);
  }
  
  return newVersion;
};

// Méthode pour restaurer une version
pageContentSchema.methods.restoreVersion = function(versionNumber, userId = null) {
  const version = this.versions.find(v => v.versionNumber === versionNumber);
  if (!version) {
    throw new Error(`Version ${versionNumber} non trouvée`);
  }
  
  // Sauvegarder la version actuelle avant restauration
  this.createVersion(`Sauvegarde avant restauration vers v${versionNumber}`, userId);
  
  // Restaurer le contenu en clonant proprement
  this.title = version.title;
  this.metaDescription = version.metaDescription;
  
  // Cloner les sections de la version
  this.sections = version.sections.map(section => {
    const cloned = { ...section };
    delete cloned._id; // Supprimer l'_id si présent
    return cloned;
  });
  
  this.lastModifiedBy = userId;
  
  return version;
};

// Méthode pour sauvegarder un brouillon
pageContentSchema.methods.saveDraft = function(draftData) {
  // Cloner les sections si présentes
  let draftSections = undefined;
  if (draftData.sections) {
    draftSections = draftData.sections.map(section => {
      const cloned = { ...section };
      delete cloned._id;
      return cloned;
    });
  }
  
  this.autoSave.draft = {
    title: draftData.title,
    metaDescription: draftData.metaDescription,
    sections: draftSections,
    savedAt: new Date()
  };
  this.autoSave.lastSave = new Date();
};

// Méthode pour publier un brouillon
pageContentSchema.methods.publishDraft = function(comment = '', userId = null) {
  if (!this.autoSave.draft) {
    throw new Error('Aucun brouillon à publier');
  }
  
  // Créer une version avec le contenu actuel
  this.createVersion(comment || 'Publication du brouillon', userId);
  
  // Appliquer le brouillon
  if (this.autoSave.draft.title) this.title = this.autoSave.draft.title;
  if (this.autoSave.draft.metaDescription !== undefined) this.metaDescription = this.autoSave.draft.metaDescription;
  if (this.autoSave.draft.sections) {
    this.sections = this.autoSave.draft.sections.map(section => {
      const cloned = { ...section };
      delete cloned._id;
      return cloned;
    });
  }
  
  // Nettoyer le brouillon
  this.autoSave.draft = undefined;
  this.lastModifiedBy = userId;
};

// Méthode statique pour valider un type de section
pageContentSchema.statics.isValidSectionType = function(type) {
  const validTypes = [
    'hero', 'text', 'image', 'card-grid', 'cta', 'list',
    'contact-info', 'testimonial-form', 'pricing-table',
    'image-text', 'testimonial-list', 'appointment-widget',
    'contact-form-map', 'list-sections'
  ];
  return validTypes.includes(type);
};

// Méthode pour obtenir les statistiques de versions
pageContentSchema.methods.getVersionStats = function() {
  // Vérification de sécurité pour éviter l'erreur "Cannot read properties of undefined"
  const versions = this.versions || [];
  
  return {
    totalVersions: versions.length,
    currentVersion: this.currentVersion || 1,
    lastVersionDate: versions.length > 0 ? 
      versions[versions.length - 1].createdAt : this.createdAt,
    hasDraft: !!(this.autoSave?.draft),
    draftSavedAt: this.autoSave?.draft?.savedAt || null
  };
};

// Méthode pour nettoyer les sections avant sauvegarde
pageContentSchema.methods.cleanSections = function() {
  if (this.sections && Array.isArray(this.sections)) {
    this.sections = this.sections.map((section, index) => {
      // Assurer les champs requis
      if (!section.id) {
        section.id = `section_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      }
      
      if (section.order === undefined) {
        section.order = index;
      }
      
      if (!section.type || !this.constructor.isValidSectionType(section.type)) {
        console.warn(`Section ${section.id}: type "${section.type}" invalide, utilisation de 'text'`);
        section.type = 'text';
      }
      
      if (!section.settings) {
        section.settings = { visible: true };
      }
      
      // Supprimer les _id parasites
      const cleanSection = { ...section };
      delete cleanSection._id;
      
      return cleanSection;
    });
  }
};

// Middleware pour nettoyer les sections avant sauvegarde
pageContentSchema.pre('save', function(next) {
  this.cleanSections();
  next();
});

// Middleware pour valider les données avant sauvegarde
pageContentSchema.pre('validate', function(next) {
  try {
    // Valider les sections actuelles
    if (this.sections) {
      this.sections.forEach((section, index) => {
        if (!section.id) {
          throw new Error(`Section ${index}: id manquant`);
        }
        if (!section.type) {
          throw new Error(`Section ${index}: type manquant`);
        }
        if (!this.constructor.isValidSectionType(section.type)) {
          throw new Error(`Section ${index}: type "${section.type}" non supporté`);
        }
      });
    }
    
    // Valider les versions
    if (this.versions && this.versions.length > 0) {
      this.versions.forEach((version, versionIndex) => {
        if (version.sections) {
          version.sections.forEach((section, sectionIndex) => {
            if (!section.type) {
              throw new Error(`Version ${version.versionNumber}, Section ${sectionIndex}: type manquant`);
            }
            if (!this.constructor.isValidSectionType(section.type)) {
              throw new Error(`Version ${version.versionNumber}, Section ${sectionIndex}: type "${section.type}" non supporté`);
            }
          });
        }
      });
    }
    
    next();
  } catch (error) {
    next(error);
  }
});

module.exports = mongoose.model('PageContent', pageContentSchema);