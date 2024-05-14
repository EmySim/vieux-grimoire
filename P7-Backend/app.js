const express = require('express');
const app = express();
const booksRoutes = require ('../P7-Backend/routes/books.js')
const Book = require('./models/book.js')

// Middleware pour parser le corps des requêtes en JSON
app.use(express.json());

// Middleware pour gérer les CORS
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

module.exports = app;