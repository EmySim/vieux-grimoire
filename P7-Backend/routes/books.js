const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { upload, resizeImage } = require('../middleware/upload');
const booksCtrl = require('../controllers/books');


router.get('/', booksCtrl.library);
router.get('/:id', booksCtrl.oneBook);
//router.get('/', booksCtrl.bestBooks);
router.post('/', auth, upload, resizeImage, booksCtrl.addBook);
router.put('/:id', auth, upload, resizeImage, booksCtrl.updateBook );
router.delete('/:id', auth, booksCtrl.deleteBook);
//router.post('/:id', auth, booksCtrl.rateBook);

module.exports = router;
