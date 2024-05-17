const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const imgConfig = require('../middleware/img-config');
const booksCtrl = require('../controllers/books');


router.get('/', booksCtrl.library);
router.get('/:id', bookCtrl.oneBook);
router.get('/', bookCtrl.bestBooks);
router.post('/', auth, imgConfig, bookCtrl.addBook);
router.put('/:id', auth, imgConfig, booksCtrl.updateBook );
router.delete('/:id', auth, booksCtrl.deleteBook);
router.post('/:id', auth, booksCtrl.rateBook);

module.exports = router;
