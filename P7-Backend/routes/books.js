const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { upload, resizeImage } = require('../middleware/upload');
const booksCtrl = require('../controllers/books');

router.get('/bestrating', booksCtrl.bestRating);
router.get('/', booksCtrl.library);
router.get('/:id', booksCtrl.oneBook);
router.post('/', auth, upload, resizeImage, booksCtrl.addBook);
router.post('/:id', auth, booksCtrl.rateBook);
router.put('/:id', auth, upload, resizeImage, booksCtrl.updateBook );
router.delete('/:id', auth, booksCtrl.deleteBook);

module.exports = router;
