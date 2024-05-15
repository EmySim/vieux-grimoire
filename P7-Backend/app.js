const express = require('express');
const mongoose = require('mongoose');
const app = express();
const booksRoutes = require ('./routes/books.js')
const Book = require('./models/book.js')
const userRoutes = require('./routes/user');

// BDD
mongoose.connect('mongodb+srv://bookworm:A1dDBpGmgzQvKW6J@cluster1.socejwe.mongodb.net/?retryWrites=true&w=majority&appName=Cluster1',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

// Middleware pour parser le corps des requêtes en JSON
app.use(express.json());

// Middleware pour gérer les CORS
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

app.use('/api/auth', userRoutes);

module.exports = app;