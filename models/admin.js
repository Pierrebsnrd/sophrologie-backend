const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const adminSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  passwordHash: {
    type: String,
    required: true
  },
  lastLogin: {
    type: Date,
    default: null
  },
  loginCount: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Méthode pour vérifier le mot de passe avec validation
adminSchema.methods.comparePassword = async function(password) {
  // Validation des paramètres
  if (!password) {
    console.error('❌ Mot de passe manquant pour la comparaison');
    return false;
  }
  
  // Vérifier si passwordHash existe
  if (!this.passwordHash) {
    console.error('❌ Hash du mot de passe manquant pour l\'admin:', this.email);
    console.error('📋 Champs disponibles:', Object.keys(this.toObject()));
    return false;
  }
  
  try {
    return await bcrypt.compare(password, this.passwordHash);
  } catch (error) {
    console.error('❌ Erreur lors de la comparaison bcrypt:', error);
    return false;
  }
};

const Admin = mongoose.model('Admin', adminSchema);

module.exports = Admin