// middleware/errorHandler.js
const mongoose = require('mongoose');

// Middleware de gestion d'erreurs centralisé
const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log de l'erreur pour debugging
  console.error('❌ Erreur capturée:', {
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    url: req.originalUrl,
    method: req.method,
    ip: req.ip
  });

  // Erreur de validation MongoDB
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message).join(', ');
    return res.status(400).json({
      success: false,
      error: 'Données invalides',
      details: message
    });
  }

  // Erreur de duplication MongoDB (clé unique)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(400).json({
      success: false,
      error: `${field} déjà existant`
    });
  }

  // Erreur MongoDB CastError (ID invalide)
  if (err.name === 'CastError') {
    return res.status(400).json({
      success: false,
      error: 'ID invalide'
    });
  }

  // Erreur JWT
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      error: 'Token invalide'
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      error: 'Token expiré'
    });
  }

  // Erreur de connexion MongoDB
  if (err.name === 'MongoNetworkError' || err.name === 'MongooseServerSelectionError') {
    return res.status(503).json({
      success: false,
      error: 'Service temporairement indisponible'
    });
  }

  // Erreur par défaut
  const statusCode = error.statusCode || 500;
  const message = process.env.NODE_ENV === 'production'
    ? 'Erreur serveur interne'
    : error.message || 'Erreur serveur interne';

  res.status(statusCode).json({
    success: false,
    error: message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

// Middleware pour les routes non trouvées
const notFound = (req, res, next) => {
  const error = new Error(`Route ${req.originalUrl} non trouvée`);
  error.statusCode = 404;
  next(error);
};

// Wrapper pour les fonctions async (évite les try/catch répétitifs)
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = {
  errorHandler,
  notFound,
  asyncHandler
};