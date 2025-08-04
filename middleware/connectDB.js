// ./middleware/connectDB.js
const connectDB = require('../config/db');

module.exports = async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    console.error('Erreur DB middleware:', err);
    res.status(500).json({ error: 'Erreur connexion base de données' });
  }
};
