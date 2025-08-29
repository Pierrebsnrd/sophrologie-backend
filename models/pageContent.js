const mongoose = require('mongoose');

// Schéma pour les sections réutilisables
const sectionSchema = new mongoose.Schema({
  id: { type: String, required: true },
  type: { 
    type: String, 
    required: true,
    enum: ['hero', 'text', 'image', 'card-grid', 'cta', 'list', 'contact-info', 'testimonial-form', 'pricing-table', 'image-text', 'testimonial-list', 'appointment-widget', 'contact-form-map', 'list-sections']
  },
  title: String,
  subtitle: String,
  content: String, // HTML ou texte
  image: {
    url: String,
    alt: String
  },
  buttons: [{
    text: String,
    url: String,
    style: String // 'primary', 'secondary'
  }],
  items: [{ // Pour les listes ou cartes
    title: String,
    content: String,
    image: {
      url: String,
      alt: String
    },
    price: String, // Pour les tarifs
    highlighted: Boolean
  }],
  settings: {
    backgroundColor: String,
    textColor: String,
    backgroundImage: String,
    alignment: String, // 'left', 'center', 'right'
    padding: String,
    margin: String,
    fullWidth: Boolean,
    visible: { type: Boolean, default: true }
  },
  order: { type: Number, default: 0 }
}, { _id: false });

// Schéma principal pour le contenu des pages
const pageContentSchema = new mongoose.Schema({
  pageId: { 
    type: String, 
    required: true, 
    unique: true,
    enum: ['home', 'about', 'pricing', 'appointment', 'testimonials', 'contact', 'ethics']
  },
  title: { type: String, required: true },
  metaDescription: String,
  sections: [sectionSchema],
  lastModified: { type: Date, default: Date.now },
  modifiedBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Admin' 
  }
});

// Middleware pour mettre à jour lastModified
pageContentSchema.pre('save', function(next) {
  this.lastModified = new Date();
  next();
});

// Méthode pour réorganiser les sections
pageContentSchema.methods.reorderSections = function(sectionOrders) {
  sectionOrders.forEach(({ id, order }) => {
    const section = this.sections.find(s => s.id === id);
    if (section) {
      section.order = order;
    }
  });
  this.sections.sort((a, b) => a.order - b.order);
  return this;
};

// Méthode pour ajouter une section
pageContentSchema.methods.addSection = function(sectionData, position = null) {
  const newSection = {
    id: new mongoose.Types.ObjectId().toString(),
    order: position !== null ? position : this.sections.length,
    ...sectionData
  };
  
  if (position !== null) {
    // Décaler les sections existantes
    this.sections.forEach(section => {
      if (section.order >= position) {
        section.order += 1;
      }
    });
  }
  
  this.sections.push(newSection);
  this.sections.sort((a, b) => a.order - b.order);
  return newSection;
};

// Méthode pour supprimer une section
pageContentSchema.methods.removeSection = function(sectionId) {
  const sectionIndex = this.sections.findIndex(s => s.id === sectionId);
  if (sectionIndex === -1) return false;
  
  const removedOrder = this.sections[sectionIndex].order;
  this.sections.splice(sectionIndex, 1);
  
  // Réorganiser les sections restantes
  this.sections.forEach(section => {
    if (section.order > removedOrder) {
      section.order -= 1;
    }
  });
  
  return true;
};

// Méthode pour dupliquer une section
pageContentSchema.methods.duplicateSection = function(sectionId) {
  const section = this.sections.find(s => s.id === sectionId);
  if (!section) return null;
  
  const duplicatedSection = {
    ...section.toObject(),
    id: new mongoose.Types.ObjectId().toString(),
    order: section.order + 1
  };
  
  // Décaler les sections suivantes
  this.sections.forEach(s => {
    if (s.order > section.order) {
      s.order += 1;
    }
  });
  
  this.sections.push(duplicatedSection);
  this.sections.sort((a, b) => a.order - b.order);
  return duplicatedSection;
};

module.exports = mongoose.model('PageContent', pageContentSchema);