const express = require('express');
const router = express.Router();
const controller = require('../controllers/contractController');

router.get('/obtener-transacciones', controller.getBlockchainTransactions);


module.exports = router;