const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const controller = require('../controllers/cidController');

// asegurar que la carpeta uploads existe
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// subir archivo a Pinata y guardar CID en contrato
router.post('/upload-historial', (req, res) => {
  try {
    const filePath = path.join(__dirname, '../uploads/historial.json');

    // Simular req.file como si Multer lo hubiera recibido
    const simulatedReq = {
      file: {
        path: filePath,
        originalname: 'historial.json'
      }
    };

    controller.uploadAndSave(simulatedReq, res);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// guardar CID directamente (sin archivo)
router.post('/', controller.setCID);

// leer CID guardado en blockchain
router.get('/', controller.getCID);

module.exports = router;
