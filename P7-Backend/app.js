const express = require('express');
const app = express();
const mongoose = require('mongoose');
const userRoutes = require('./routes/user');
const booksRoutes = require('./routes/books');
const path = require('path');
const cors = require('cors');
require('dotenv').config();


// BDD
mongoose.connect(process.env.MONGODB_URL,
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));


// Middleware pour parser le corps des requêtes en JSON
app.use(express.json());

// CORS middleware
app.use(cors({
  origin: 'http://localhost:3000' // frontend port
}));

/*// Middleware pour gérer les CORS 
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});*/

// Middleware to serve static files (images) with appropriate CORS headers
app.use('/images', (req, res, next) => {
  // Set appropriate CORS headers for image files
  res.setHeader('Access-Control-Allow-Origin', '*'); // Allow requests from any origin
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS'); 
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');// Allow common headers
  next();
}, express.static(path.join(__dirname, 'images')));


//routeurs
app.use('/api/books', booksRoutes);
app.use('/api/auth', userRoutes);

module.exports = app;