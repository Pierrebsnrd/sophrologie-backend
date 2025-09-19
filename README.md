# Sophrologie Backend API

API REST pour l'application de sophrologie de Stéphanie Habert.

## 📋 Table des matières

- [🚀 Installation et démarrage](#-installation-et-démarrage)
  - [Prérequis](#prérequis)
  - [Installation](#installation)
  - [Configuration](#configuration)
  - [Démarrage](#démarrage)
- [🛠 Stack technique](#-stack-technique)
- [📁 Structure du projet](#-structure-du-projet)
- [🌐 API Routes](#-api-routes)
  - [📖 Routes publiques](#-routes-publiques)
  - [🔒 Routes admin (JWT requis)](#-routes-admin-jwt-requis)
- [📋 Formats de données](#-formats-de-données)
  - [Témoignage](#témoignage)
  - [Message de contact](#message-de-contact)
  - [Réponse API standard](#réponse-api-standard)
- [🔒 Sécurité](#-sécurité)
  - [Mesures implémentées](#mesures-implémentées)
  - [Authentification](#authentification)
- [🗄️ Base de données](#️-base-de-données)
  - [Collections MongoDB](#collections-mongodb)
  - [Connexion](#connexion)
- [⚡ Fonctionnalités](#-fonctionnalités)
  - [Gestion des témoignages](#gestion-des-témoignages)
  - [Messages de contact](#messages-de-contact)
  - [Administration](#administration)
- [🌐 Hébergement](#-hébergement)
  - [Vercel (Recommandé)](#vercel-recommandé)
  - [Configuration MongoDB](#configuration-mongodb)

## 🚀 Installation et démarrage

### Prérequis
- Node.js (version 16+)
- MongoDB (local ou cloud)
- Yarn

### Installation
```bash
yarn install
```

### Configuration
Créer un fichier `.env` :
```env
# Base de données
CONNECTION_STRING=mongodb://localhost:27017/sophrologie

# Authentification
JWT_SECRET=votre_secret_jwt_securise

# Admin par défaut
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=votre_mot_de_passe

# Environnement
NODE_ENV=development
PORT=3000
```

### Démarrage
```bash
# Démarrer le serveur
yarn start

# Créer un utilisateur admin
yarn create-admin

# Tests
yarn test              # Run Jest tests
yarn test:watch        # Run tests in watch mode
yarn test:coverage     # Run tests with coverage report
```

## 🛠 Stack technique

- **Runtime** : Node.js
- **Framework** : Express.js
- **Base de données** : MongoDB + Mongoose
- **Authentification** : JWT (jsonwebtoken)
- **Hachage** : Bcrypt
- **Sécurité** : Helmet, CORS, Rate limiting
- **Email** : Nodemailer

## 📁 Structure du projet

```
backend/
├── bin/                # Scripts de démarrage
│   └── www            # Point d'entrée serveur
├── controllers/        # Logique métier des routes
│   ├── adminController.js    # Gestion des admins
│   ├── contactController.js  # Traitement des contacts
│   └── temoignageController.js # Gestion des témoignages
├── middleware/         # Middlewares personnalisés
│   ├── auth.js        # Authentification JWT
│   └── connectDB.js   # Connexion base de données
├── models/            # Modèles MongoDB (Mongoose)
│   ├── admin.js       # Schéma admin avec auth
│   ├── contactMessage.js # Messages de contact
│   └── temoignage.js  # Témoignages avec statut
├── routes/            # Définition des routes API
│   ├── admin.js       # Routes d'administration
│   ├── contact.js     # Routes de contact
│   └── temoignage.js  # Routes témoignages
├── services/          # Logique métier réutilisable
│   ├── adminService.js    # Services admin
│   ├── contactService.js  # Services contact
│   └── temoignageService.js # Services témoignages
├── scripts/           # Scripts utilitaires
│   └── createAdmin.js # Création d'admins
├── tests/             # Tests unitaires (Jest)
│   ├── setup.js       # Configuration tests
│   ├── services/      # Tests des services
│   └── middleware/    # Tests des middlewares
├── config/
│   └── db.js          # Configuration MongoDB
├── app.js             # Configuration Express
└── vercel.json        # Configuration déploiement Vercel
```

## 🌐 API Routes

### 📖 Routes publiques

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/temoignage` | Récupère les témoignages validés |
| `POST` | `/temoignage` | Créer un nouveau témoignage |
| `POST` | `/contact` | Envoyer un message de contact |

### 🔒 Routes admin (JWT requis)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/admin/login` | Connexion administrateur |
| `GET` | `/admin/profile` | Profil admin connecté |
| `GET` | `/admin/temoignages` | Tous les témoignages |
| `PATCH` | `/admin/temoignages/:id/status` | Changer statut témoignage |
| `DELETE` | `/admin/temoignages/:id` | Supprimer témoignage |
| `GET` | `/admin/contact-messages` | Messages de contact |
| `PATCH` | `/admin/contact-messages/:id/answered` | Marquer comme lu |
| `DELETE` | `/admin/contact-messages/:id` | Supprimer message |

## 📋 Formats de données

### Témoignage
```json
{
  "name": "Jean Dupont",
  "message": "Excellente expérience...",
  "status": "pending|approved|rejected",
  "createdAt": "2024-01-15T10:30:00Z"
}
```

### Message de contact
```json
{
  "name": "Marie Martin",
  "email": "marie@example.com", 
  "phone": "06.12.34.56.78",
  "message": "Je souhaiterais...",
  "answered": false,
  "createdAt": "2024-01-15T10:30:00Z"
}
```

### Réponse API standard
```json
{
  "success": true,
  "data": { ... },
  "message": "Operation réussie"
}
```

## 🔒 Sécurité

### Mesures implémentées
- **Rate Limiting** : 100 requêtes/15min par IP
- **Helmet** : Headers HTTP sécurisés
- **CORS** : Origines autorisées uniquement
- **JWT** : Tokens sécurisés pour l'admin
- **Bcrypt** : Hachage des mots de passe
- **Validation** : Sanitization des données d'entrée

### Authentification
```javascript
// Header requis pour les routes admin
Authorization: Bearer <jwt_token>
```

## 🗄️ Base de données

### Collections MongoDB
- **admins** : Comptes administrateurs
- **temoignages** : Témoignages clients
- **contacts** : Messages de contact

### Connexion
- Connexion automatique au démarrage
- Gestion des erreurs de connexion
- Pool de connexions pour les performances

## ⚡ Fonctionnalités

### Gestion des témoignages
- ✅ Soumission publique
- ✅ Modération admin (pending/approved/rejected)
- ✅ Affichage filtré (validés seulement)

### Messages de contact
- ✅ Réception via formulaire
- ✅ Validation des données
- ✅ Marquage comme traité

### Administration
- ✅ Authentification sécurisée
- ✅ Session avec JWT
- ✅ Interface de gestion complète

## 👤 Gestion des Admins

### Création d'un compte administrateur

Pour créer ou réinitialiser un compte admin :

```bash
yarn create-admin
```

Le script interactif vous permet de :
- Créer un nouveau compte administrateur
- Réinitialiser le mot de passe d'un admin existant
- Valider la création avec un test de connexion

**Prérequis** : La base de données MongoDB doit être accessible avec la `CONNECTION_STRING` configurée.

## 🌐 Hébergement

### Vercel (Recommandé)

Le backend peut être déployé sur Vercel en tant que fonctions serverless :

1. **Connecter le repository** à votre compte Vercel
2. **Configurer les variables d'environnement** :
   ```env
   CONNECTION_STRING=mongodb+srv://...
   JWT_SECRET=votre_secret_jwt_securise
   ADMIN_EMAIL=admin@example.com
   ADMIN_PASSWORD=votre_mot_de_passe
   NODE_ENV=production
   ```
3. **Créer vercel.json** à la racine :
   ```json
   {
     "version": 2,
     "builds": [
       {
         "src": "app.js",
         "use": "@vercel/node"
       }
     ],
     "routes": [
       {
         "src": "/(.*)",
         "dest": "/app.js"
       }
     ]
   }
   ```
4. **Déploiement automatique** sur chaque push

### Configuration MongoDB
Pour la production, utilisez **MongoDB Atlas** (cloud) :
- Connexion sécurisée via `mongodb+srv://`
- Whitelist des IPs Vercel
- Variables d'environnement sécurisées
