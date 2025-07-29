require("dotenv").config();
require("./config/db");

var express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const adminRoutes = require('./routes/admin');
const temoignageRoutes = require('./routes/temoignage');
const contactRoutes = require('./routes/contact');

var app = express();

// Sécurité
app.use(helmet());
const cors = require('cors');
app.use(cors());

app.set('trust proxy', 1);
// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limite à 100 requêtes par IP
});
app.use(limiter);

app.use(logger('dev'));
app.use(express.json({limit: '10mb'})); // Limite la taille des requêtes JSON
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/admin', adminRoutes);
app.use('/temoignage', temoignageRoutes);
app.use('/contact', contactRoutes);



module.exports = app;
