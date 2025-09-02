// ====================================
// 1. MODÈLE PAGE CONTENT AMÉLIORÉ
// ====================================

// models/pageContent.js - Version améliorée avec historique
const mongoose = require('mongoose');

// Schéma pour l'historique des versions
const versionSchema = new mongoose.Schema({
  versionNumber: { type: Number, required: true },
  title: String,
  metaDescription: String,
  sections: [{
    id: { type: String, required: true },
    type: { 
      type: String, 
      required: true,
      enum: ['hero', 'text', 'image', 'card-grid', 'cta', 'list', 'contact-info', 'testimonial-form', 'pricing-table', 'image-text', 'testimonial-list', 'appointment-widget', 'contact-form-map', 'list-sections']
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
  }],
  createdAt: { type: Date, default: Date.now },
  createdBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Admin' 
  },
  comment: String // Commentaire optionnel pour cette version
}, { _id: true });

// Schéma principal amélioré
const pageContentSchema = new mongoose.Schema({
  pageId: { 
    type: String, 
    required: true, 
    unique: true,
    enum: ['home', 'about', 'pricing', 'appointment', 'testimonials', 'contact', 'ethics']
  },
  title: { type: String, required: true },
  metaDescription: String,
  sections: [{
    id: { type: String, required: true },
    type: { 
      type: String, 
      required: true,
      enum: ['hero', 'text', 'image', 'card-grid', 'cta', 'list', 'contact-info', 'testimonial-form', 'pricing-table', 'image-text', 'testimonial-list', 'appointment-widget', 'contact-form-map', 'list-sections']
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
  }],
  
  // Gestion des versions
  currentVersion: { type: Number, default: 1 },
  versions: [versionSchema],
  
  // Métadonnées
  lastModified: { type: Date, default: Date.now },
  modifiedBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Admin' 
  },
  
  // Statut de publication
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'published'
  },
  
  // Sauvegarde automatique
  autoSave: {
    enabled: { type: Boolean, default: true },
    lastAutoSave: Date,
    autoSaveData: Object
  }
});

// ====================================
// 2. MÉTHODES POUR LA GESTION DES VERSIONS
// ====================================

// Créer une nouvelle version
pageContentSchema.methods.createVersion = function(comment = '') {
  const newVersion = {
    versionNumber: this.currentVersion,
    title: this.title,
    metaDescription: this.metaDescription,
    sections: JSON.parse(JSON.stringify(this.sections)),
    createdBy: this.modifiedBy,
    comment: comment,
    createdAt: new Date()
  };
  
  this.versions.push(newVersion);
  this.currentVersion += 1;
  
  // Garder seulement les 20 dernières versions
  if (this.versions.length > 20) {
    this.versions = this.versions.slice(-20);
  }
  
  return newVersion;
};

// Restaurer une version spécifique
pageContentSchema.methods.restoreVersion = function(versionNumber, adminId) {
  const version = this.versions.find(v => v.versionNumber === versionNumber);
  if (!version) {
    throw new Error('Version non trouvée');
  }
  
  // Sauvegarder la version actuelle avant restauration
  this.createVersion('Sauvegarde automatique avant restauration');
  
  // Restaurer les données
  this.title = version.title;
  this.metaDescription = version.metaDescription;
  this.sections = JSON.parse(JSON.stringify(version.sections));
  this.modifiedBy = adminId;
  this.lastModified = new Date();
  
  return this;
};

// Méthode de sauvegarde automatique
pageContentSchema.methods.autoSaveData = function(data, adminId) {
  this.autoSave.lastAutoSave = new Date();
  this.autoSave.autoSaveData = data;
  this.modifiedBy = adminId;
  return this.save();
};

// Récupérer l'historique formaté
pageContentSchema.methods.getVersionHistory = function() {
  return this.versions
    .sort((a, b) => b.versionNumber - a.versionNumber)
    .map(version => ({
      versionNumber: version.versionNumber,
      createdAt: version.createdAt,
      createdBy: version.createdBy,
      comment: version.comment || 'Version automatique',
      sectionsCount: version.sections?.length || 0
    }));
};

// Middleware pour mettre à jour lastModified
pageContentSchema.pre('save', function(next) {
  this.lastModified = new Date();
  next();
});

module.exports = mongoose.model('PageContent', pageContentSchema);