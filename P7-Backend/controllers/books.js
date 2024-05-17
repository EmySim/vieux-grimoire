const Books = require("../models/book");
const fs = require("fs");

//get - renvoie à la bibliothèque (plusieurs livres)
exports.library = (req, res, next) => {
  Books.find()
    .then((books) => res.status(200).json(books))
    .catch((error) => res.status(400).json({ error }));
};

//get - renvoie un livre (id)
exports.oneBook = (req, res, next) => {
  Book.findOne({ _id: req.params.id })
    .then((books) => res.status(200).json(books))
    .catch((error) => res.status(400).json({ error }));
};

//get - renvoie aux livres les mieux notés
//exports.bestBooks = (req, res, next) => {

//};

//post - ajoute un livre (id)
exports.addBook = (req, res, next) => {
  const bookObject = JSON.parse(req.body.thing);
  delete bookObject._id;
  delete bookObject._userId;
  const book = new Book({
    ...bookObject,
    userId: req.auth.userId,
    imageUrl: `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`,
  });

  book.save()
    .then(() => {
      res.status(201).json({ message: "Livre ajouté !" });
    })
    .catch((error) => {
      res.status(400).json({ error });
    });
};

//put - MAJ un livre (id)
exports.updateBook = (req, res, next) => {
    const bookObject = req.file ? {
        ...JSON.parse(req.body.thing),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };
  
    delete bookObject._userId;
    Book.findOne({_id: req.params.id})
        .then((book) => {
            if (book.userId != req.auth.userId) {
                res.status(401).json({ message : 'Pas autorisé (MAJ)'});
            } else {
                Book.updateOne({ _id: req.params.id}, { ...thingObject, _id: req.params.id})
                .then(() => res.status(200).json({message : 'Livre modifié!'}))
                .catch(error => res.status(401).json({ error }));
            }
        })
        .catch((error) => {
            res.status(400).json({ error });
        });
};

//delete
exports.deleteBook = (req, res, next) => {
  Book.findOne({ _id: req.params.id })
    .then((book) => {
      if (book.userId != req.auth.userId) {
        res.status(401).json({ message: "Pas autorisé (delete)" });
      } else {
        const filename = book.imageUrl.split("/images/")[1];
        fs.unlink(`images/${filename}`, () => {
          Book.deleteOne({ _id: req.params.id })
            .then(() => {
              res.status(200).json({ message: "Livre supprimé !" });
            })
            .catch((error) => res.status(401).json({ error }));
        });
      }
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
};

//post - affecte une note (id)
//exports.rateBook = (req, res, next) => {
  //Book.findOne({ _id: req.params.id });
//};
