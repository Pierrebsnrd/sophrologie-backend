// services/adminService.js
const jwt = require('jsonwebtoken');
const Admin = require('../models/admin');

class AdminService {
  static async authenticate(email, password) {
    try {
      console.log('🔍 Tentative de connexion pour:', email);

      const admin = await Admin.findOne({ email: email.toLowerCase() });
      if (!admin) {
        console.log('❌ Admin non trouvé pour:', email);
        return { success: false, error: 'Identifiants incorrects' };
      }

      const isValidPassword = await admin.comparePassword(password);
      if (!isValidPassword) {
        console.log('❌ Mot de passe incorrect pour:', email);
        return { success: false, error: 'Identifiants incorrects' };
      }

      console.log('✅ Connexion réussie pour:', email);

      // Mettre à jour les statistiques de connexion
      await Admin.findByIdAndUpdate(admin._id, {
        lastLogin: new Date(),
        $inc: { loginCount: 1 }
      });

      const token = jwt.sign(
        { adminId: admin._id, email: admin.email },
        process.env.JWT_SECRET,
        { expiresIn: '8h' }
      );

      return {
        success: true,
        data: {
          token,
          admin: { id: admin._id, email: admin.email }
        }
      };
    } catch (error) {
      console.error('❌ Erreur login admin:', error);
      return { success: false, error: 'Erreur serveur' };
    }
  }

  static async getProfile(adminId) {
    try {
      console.log('🔍 Récupération profil pour admin ID:', adminId);

      const admin = await Admin.findById(adminId).select('-passwordHash');

      if (!admin) {
        console.log('❌ Admin non trouvé avec ID:', adminId);
        return { success: false, error: 'Admin non trouvé' };
      }

      console.log('✅ Profil récupéré:', {
        id: admin._id,
        email: admin.email,
        createdAt: admin.createdAt,
        lastLogin: admin.lastLogin,
        loginCount: admin.loginCount
      });

      const profileData = {
        id: admin._id,
        email: admin.email,
        createdAt: admin.createdAt || new Date(),
        lastLogin: admin.lastLogin || null,
        loginCount: admin.loginCount || 0
      };

      return { success: true, data: profileData };
    } catch (error) {
      console.error('❌ Erreur récupération profil:', error);
      return { success: false, error: 'Erreur serveur' };
    }
  }
  // services/adminService.js
  static async updatePassword(adminId, currentPassword, newPassword) {
    try {
      // Validation
      if (newPassword.length < 8) {
        return {
          success: false,
          error: 'Le nouveau mot de passe doit contenir au moins 8 caractères'
        };
      }

      // Récupérer l'admin
      const admin = await Admin.findById(adminId);
      if (!admin) {
        return { success: false, error: 'Administrateur non trouvé' };
      }

      // Vérifier le mot de passe actuel
      const isCurrentPasswordValid = await admin.comparePassword(currentPassword);
      if (!isCurrentPasswordValid) {
        return { success: false, error: 'Mot de passe actuel incorrect' };
      }

      // Assigner le nouveau mot de passe (sera hashé automatiquement)
      admin.passwordHash = newPassword;
      await admin.save();

      return { success: true, message: 'Mot de passe changé avec succès' };
    } catch (error) {
      console.error('Erreur changement mot de passe:', error);
      return { success: false, error: 'Erreur serveur' };
    }
  }
}

module.exports = AdminService;