const express = require('express');
const app = express();
const mongoose = require('mongoose');
const userRoutes = require('./routes/user');
const booksRoutes = require('./routes/books');
const path = require('path');
const cors = require('cors');
require('dotenv').config();

// Connexion à la base de données MongoDB
mongoose.connect(process.env.MONGODB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connexion à MongoDB réussie !'))
.catch(() => console.log('Connexion à MongoDB échouée !'));

// Middleware pour parser le corps des requêtes en JSON
app.use(express.json());

// Configuration CORS pour autoriser les requêtes du frontend
app.use(cors({
  origin: 'http://localhost:3000' // Permettre les requêtes depuis le frontend sur le port 3000
}));

// Middleware pour servir les fichiers statiques (images) avec les en-têtes CORS appropriés
app.use('/images', (req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*'); // Autoriser les requêtes depuis n'importe quelle origine
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS'); // Méthodes HTTP autorisées
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization'); // En-têtes autorisés
  next();
}, express.static(path.join(__dirname, 'images')));

// Middleware pour servir les fichiers avec les types MIME corrects
app.use('/images', express.static(path.join(__dirname, 'images'), {
  setHeaders: (res, path, stat) => {
    if (path.endsWith('.webp')) {
      res.setHeader('Content-Type', 'image/webp');
    }
  }
}));

// Routage
app.use('/api/books', booksRoutes);
app.use('/api/auth', userRoutes);

module.exports = app;
