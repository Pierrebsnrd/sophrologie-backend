const express = require('express');
const router = express.Router();
const AdminController = require('../controllers/adminController');
const TemoignageController = require('../controllers/temoignageController');
const ContactController = require('../controllers/contactController');
const authMiddleware = require('../middleware/auth');

// Routes d'authentification
router.post('/login', AdminController.login);
router.get('/profile', authMiddleware, AdminController.getProfile);
router.patch('/profile/password', authMiddleware, AdminController.updatePassword);

// Routes de gestion des témoignages (admin)
router.get('/temoignages', authMiddleware, TemoignageController.getAll);
router.patch('/temoignages/:id/status', authMiddleware, TemoignageController.updateStatus);
router.delete('/temoignages/:id', authMiddleware, TemoignageController.delete);

// Routes de gestion des messages de contact (admin)
router.get('/contact-messages', authMiddleware, ContactController.getAll);
router.patch('/contact-messages/:id/answered', authMiddleware, ContactController.markAsAnswered);
router.delete('/contact-messages/:id', authMiddleware, ContactController.delete);

module.exports = router;