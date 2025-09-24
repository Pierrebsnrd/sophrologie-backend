const AdminService = require('../services/adminService');
const { asyncHandler } = require('../middleware/errorHandler');

class AdminController {
  static login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email et mot de passe requis' });
    }

    const result = await AdminService.authenticate(email, password);

    if (!result.success) {
      return res.status(401).json({ error: result.error });
    }

    res.json({ success: true, ...result.data });
  })

  static getProfile = asyncHandler(async (req, res) => {
    const result = await AdminService.getProfile(req.admin._id);

    if (!result.success) {
      return res.status(404).json({ error: result.error });
    }

    res.json({ success: true, data: result.data });
  })

  static updatePassword = asyncHandler(async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    const adminId = req.admin._id;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        error: 'Mot de passe actuel et nouveau mot de passe requis'
      });
    }

    const result = await AdminService.updatePassword(adminId, currentPassword, newPassword);

    if (!result.success) {
      return res.status(400).json({
        success: false,
        error: result.error
      });
    }

    res.json({
      success: true,
      message: 'Mot de passe changé avec succès'
    });
  })
}

module.exports = AdminController;