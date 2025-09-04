// models/pageContent.js - Version simplifiée sans versions
const mongoose = require('mongoose');

// Schéma principal simplifié
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
  
  // Métadonnées simplifiées
  lastModified: { type: Date, default: Date.now },
  
  // Statut de publication
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'published'
  }
});

// Middleware pour mettre à jour lastModified
pageContentSchema.pre('save', function(next) {
  this.lastModified = new Date();
  next();
});

module.exports = mongoose.model('PageContent', pageContentSchema);