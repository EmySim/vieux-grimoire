const multer = require("multer");
const sharp = require("sharp");
const path = require("path");
const fs = require("fs");

/*// Définir les types la nature et le format 
const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png'
};



  //nom de fichier
  filename: (req, file, callback) => {
    const name = file.originalname.split(' ').join('_').split('.')[0];
    const extension = MIME_TYPES[file.mimetype];
    callback(null, name + Date.now() + '.' + extension);
  }
});

// Middleware de téléchargement avec Multer
const upload = multer({ storage: storage }).single('image');*/

//configuration du stockage Multer dans la mémoire virtuelle
const storage = multer.memoryStorage();
const upload = multer({ storage: storage }).single("image");

// Redimensionnement de l'image et conversion en WebP
const resizeImage = (req, res, next) => {
  if (!req.file) {
    return next();
  }

  const filePath = req.file.buffer;
  const fileName = req.file.originalname.split(".")[0];
  const outputFilePath = path.join("images", `${fileName}.webp`);
  console.log(outputFilePath);

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
