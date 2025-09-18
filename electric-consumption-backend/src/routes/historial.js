const express = require('express');
const router = express.Router();
const controller = require('../controllers/historialController');

router.get('/obtener-historial-blockchain', controller.getBlockchainHistorial);

router.get('/obtener-historial-local', controller.getLocalHistorial);

module.exports = router;
