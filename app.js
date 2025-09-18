require('dotenv').config();

const express = require('express');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');

// Middleware pour assurer la connexion DB
const ensureDB = require('./middleware/connectDB');

// Routes
const adminRoutes = require('./routes/admin');
const temoignageRoutes = require('./routes/temoignage');
const contactRoutes = require('./routes/contact');

const app = express();

// Sécurité
app.use(helmet());
app.use(cors());
app.set('trust proxy', 1);

// Limitation des requêtes
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});
app.use(limiter);

// Middleware de base
app.use(logger('dev'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Routes protégées par la connexion DB
app.use('/admin', ensureDB, adminRoutes);
app.use('/temoignage', ensureDB, temoignageRoutes);
app.use('/contact', ensureDB, contactRoutes);

// Gestion d'erreurs centralisée
const { errorHandler, notFound } = require('./middleware/errorHandler');

// Middleware pour routes non trouvées (doit être après toutes les routes)
app.use(notFound);

// Middleware de gestion d'erreurs (doit être en dernier)
app.use(errorHandler);

module.exports = app;
