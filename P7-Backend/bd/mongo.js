const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://bookworm:A1dDBpGmgzQvKW6J@cluster1.socejwe.mongodb.net/?retryWrites=true&w=majority&appName=Cluster1',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));