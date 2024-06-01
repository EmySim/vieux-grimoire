const Book = require("../models/book");
const fs = require("fs");

//get - renvoie à la bibliothèque (plusieurs livres)
exports.library = (req, res, next) => {
  Book.find()
    .then((books) => res.status(200).json(books))
    .catch((error) => res.status(400).json({ error }));
};

//get - renvoie un livre (id)
exports.oneBook = (req, res, next) => {
  Book.findOne({ _id: req.params.id })
    .then((books) => res.status(200).json(books))
    .catch((error) => res.status(400).json({ error }));
};

//post - ajoute un livre (id)
exports.addBook = (req, res, next) => {
  console.log("Request body.book:", req.body.book);
  //parse formdata => json
  const bookObject = JSON.parse(req.body.book);
  delete bookObject._id;
  delete bookObject._userId;
  const book = new Book({
    ...bookObject,
    userId: req.auth.userId,
    imageUrl: `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`,
  });

  book
    .save()
    .then(() => {
      res.status(201).json({ message: "Livre ajouté !" });
    })
    .catch((error) => {
      res.status(400).json({ error });
    });
};

//put - MAJ un livre (id)
exports.updateBook = (req, res, next) => {
  const bookObject = req.file
    ? {
        ...JSON.parse(req.body.book),
        imageUrl: `${req.protocol}://${req.get("host")}/images/${
          req.file.filename
        }`,
      }
    : { ...req.body };

  delete bookObject._userId;
  Book.findOne({ _id: req.params.id })
    .then((book) => {
      if (book.userId != req.auth.userId) {
        res.status(401).json({ message: "Pas autorisé (MAJ)" });
      }

      //effacer l'ancienne image
      const filename = book.imageUrl.split("/images/")[1];
      console.log(filename);
      if (fs.existsSync(`images/${filename}`)) {
        fs.unlink(`images/${filename}`, (error) => {
          if (error) {
            throw new Error(error);
          }
        });

        Book.updateOne(
          { _id: req.params.id },
          { ...bookObject, _id: req.params.id }
        )
          .then(() => res.status(200).json({ message: "Livre modifié!" }))
          .catch((error) => res.status(401).json({ error }));
      } else {
        res.status(400).json({ message: "La photo n'existe pas!" });
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

//RATINGS

//get - renvoie aux 3 livres les mieux notés
exports.bestRating = (req, res, next) => {
  //requete MongoDB utilisant Mongoose pour récupérer les meilleurs books selon leur moyenne
  Book.find()
    .sort({ averageRating: -1 })
    .limit(3)
    .then((books) => {
      console.log("Best books:", books);
      res.status(200).json(books);
    })
    .catch((error) => res.status(400).json({ error }));
};

// post - affecte une note (id)
exports.rateBook = (req, res, next) => {
  const userId = req.auth.userId;
  const { rating } = req.body;

  if (rating < 0 || rating > 5) {
    return res
      .status(400)
      .json({ message: "La note doit être comprise entre 0 et 5." });
  }

  Book.findOne({ _id: req.params.id })
    .then((book) => {
      if (!book) {
        return res.status(404).json({ message: "Livre non trouvé." });
      }

      const userRating = book.ratings.find(
        (r) => r.userId.toString() === userId
      );
      if (userRating) {
        return res
          .status(400)
          .json({ message: "Vous avez déjà noté ce livre." });
      }

      // Ajouter la nouvelle note
      book.ratings.push({ userId, grade: rating });

      // Mettre à jour la moyenne des notes
      const totalRatings = book.ratings.length;
      const averageRating =
        book.ratings.reduce((sum, r) => sum + r.grade, 0) / totalRatings;
      book.averageRating = averageRating;

      // Sauvegarder les modifications
      book
        .save()
        .then((updatedBook) => {
          const updatedBookObject = updatedBook.toObject();
          delete updatedBookObject.userId; // Supprimer le userId pour la réponse
          res.status(200).json(updatedBookObject);
        })
        .catch((error) => res.status(400).json({ error }));
    })
    .catch((error) => res.status(400).json({ error }));
};
