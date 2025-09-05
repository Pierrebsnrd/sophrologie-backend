// controllers/adminController.js
const AdminService = require('../services/adminService');

class AdminController {
  static async login(req, res) {
    try {
      const { email, password } = req.body;

      // Validation des champs requis
      if (!email || !password) {
        return res.status(400).json({ error: 'Email et mot de passe requis' });
      }

      const result = await AdminService.authenticate(email, password);
      
      if (!result.success) {
        return res.status(401).json({ error: result.error });
      }

      res.json({ success: true, ...result.data });
    } catch (error) {
      console.error('❌ Erreur dans adminController.login:', error);
      res.status(500).json({ error: 'Erreur serveur' });
    }
  }

  static async getProfile(req, res) {
    try {
      const result = await AdminService.getProfile(req.admin._id);
      
      if (!result.success) {
        return res.status(404).json({ error: result.error });
      }

      res.json({ success: true, data: result.data });
    } catch (error) {
      console.error('❌ Erreur dans adminController.getProfile:', error);
      res.status(500).json({ error: 'Erreur serveur' });
    }
  }
}

module.exports = AdminController;