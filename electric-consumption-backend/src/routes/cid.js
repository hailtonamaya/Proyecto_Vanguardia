const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

const controller = require('../controllers/cidController');

// subir archivo a Pinata y guardar CID en contrato
router.post('/upload', upload.single('file'), controller.uploadAndSave);

// guardar CID directamente (sin archivo)
router.post('/', controller.setCID);

// leer CID guardado en blockchain
router.get('/', controller.getCID);

module.exports = router;
