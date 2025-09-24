const jwt = require('jsonwebtoken');
const Admin = require('../models/admin');

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      console.log('❌ Token manquant dans la requête');
      return res.status(401).json({ error: 'Token manquant' });
    }

    console.log('🔍 Vérification du token...');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('🔓 Token décodé:', { adminId: decoded.adminId, email: decoded.email });
    
    const admin = await Admin.findById(decoded.adminId);
    
    if (!admin) {
      console.log('❌ Admin introuvable avec ID:', decoded.adminId);
      return res.status(401).json({ error: 'Admin introuvable' });
    }

    console.log('✅ Admin authentifié:', { id: admin._id, email: admin.email });
    
    req.admin = admin;
    next();
  } catch (error) {
    console.error('❌ Erreur d\'authentification:', error.message);
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Token invalide' });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expiré' });
    }
    res.status(401).json({ error: 'Token invalide' });
  }
};

module.exports = authMiddleware;