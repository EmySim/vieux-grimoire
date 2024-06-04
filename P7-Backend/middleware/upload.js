const multer = require("multer");
const sharp = require("sharp");
const path = require("path");
const fs = require("fs");

//configuration du stockage Multer dans la mémoire virtuelle
const storage = multer.memoryStorage();
const upload = multer({ storage: storage }).single("image");

// Redimensionnement de l'image et conversion en WebP
const resizeImage = (req, res, next) => {
  if (!req.file) {
    return next();
  }

  // Le fichier image est contenu dans req.file.buffer
  const filePath = req.file.buffer;
  const fileName = req.file.originalname.split(".")[0];
  const outputFilePath = path.join("images", `${fileName}.webp`);
  console.log(outputFilePath);

  // Utilisation de sharp pour redimensionner et convertir l'image en format WebP
  sharp(filePath)
    .resize({ width: 206, height: 260 })
    .toFormat("webp")
    .toFile(outputFilePath)
    .then(() => {
      //remplace par le fichier redimensionné
      req.file.path = outputFilePath;
      req.file.filename = `${fileName}.webp`;
      next();
    })
    .catch((err) => {
      console.log(err);
      return next(err);
    });
};

module.exports = { upload, resizeImage };
