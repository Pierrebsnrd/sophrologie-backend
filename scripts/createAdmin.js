require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const AdminSchema = new mongoose.Schema({
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

AdminSchema.methods.comparePassword = async function(password) {
  if (!password) {
    console.error('❌ Mot de passe manquant pour la comparaison');
    return false;
  }
  
  if (!this.passwordHash) {
    console.error('❌ Hash du mot de passe manquant pour l\'admin:', this.email);
    return false;
  }
  
  try {
    return await bcrypt.compare(password, this.passwordHash);
  } catch (error) {
    console.error('❌ Erreur lors de la comparaison bcrypt:', error);
    return false;
  }
};

const Admin = mongoose.model('Admin', AdminSchema);

async function ask(question) {
  return new Promise(resolve => rl.question(question, resolve));
}

async function main() {
  try {
    await mongoose.connect(process.env.CONNECTION_STRING);
    console.log('🟢 Connecté à MongoDB');

    const emailInput = await ask('Email admin: ');
    const email = emailInput.trim().toLowerCase();

    const passwordInput = await ask('Mot de passe (min 8 caractères): ');
    const password = passwordInput.trim();

    if (password.length < 8) {
      console.error('❌ Le mot de passe doit contenir au moins 8 caractères');
      process.exit(1);
    }

    // Chercher admin existant
    let admin = await Admin.findOne({ email });

    // Hasher le mot de passe avec le même nombre de rounds que votre modèle
    const hashedPassword = await bcrypt.hash(password, 12);

    if (admin) {
      // Admin existant -> reset password
      admin.passwordHash = hashedPassword;
      // S'assurer que createdAt existe
      if (!admin.createdAt) {
        admin.createdAt = new Date();
      }
      await admin.save();
      console.log(`✅ Mot de passe mis à jour pour l'admin ${email}`);
      console.log(`📅 Compte créé le: ${admin.createdAt}`);
    } else {
      // Création nouvel admin avec TOUS les champs requis
      admin = new Admin({
        email,
        passwordHash: hashedPassword,
        loginCount: 0,
        lastLogin: null,
        createdAt: new Date()
      });
      await admin.save();
      console.log(`✅ Compte admin créé avec succès pour: ${email}`);
      console.log(`📅 Date de création: ${admin.createdAt}`);
    }

    // Vérification rapide du mot de passe
    const testPassword = await admin.comparePassword(password);
    console.log(`🔐 Test de connexion : ${testPassword ? '✔️ OK' : '❌ Échec'}`);

    // Vérification de tous les champs
    console.log('\n📋 Informations du compte:');
    console.log(`- Email: ${admin.email}`);
    console.log(`- Créé le: ${admin.createdAt}`);
    console.log(`- Dernière connexion: ${admin.lastLogin || 'Jamais'}`);
    console.log(`- Nombre de connexions: ${admin.loginCount}`);

  } catch (err) {
    console.error('💥 Erreur:', err.message);
    if (err.code === 11000) {
      console.error('⚠️  Un admin avec cet email existe déjà');
    }
  } finally {
    rl.close();
    await mongoose.disconnect();
    process.exit(0);
  }
}

main();