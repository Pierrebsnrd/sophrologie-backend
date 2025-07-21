const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: 'Token manquant' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const admin = await Admin.findById(decoded.adminId);
    
    if (!admin) {
      return res.status(401).json({ error: 'Admin introuvable' });
    }

    req.admin = admin;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Token invalide' });
  }
};

module.exports = authMiddleware;