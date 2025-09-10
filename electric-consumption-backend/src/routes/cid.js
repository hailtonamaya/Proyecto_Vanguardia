const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const controller = require('../controllers/cidController');

// asegurar que la carpeta uploads existe
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// configurar multer
const upload = multer({ dest: uploadDir });

// subir archivo a Pinata y guardar CID en contrato
router.post('/upload', upload.single('file'), controller.uploadAndSave);

// guardar CID directamente (sin archivo)
router.post('/', controller.setCID);

// leer CID guardado en blockchain
router.get('/', controller.getCID);

module.exports = router;
