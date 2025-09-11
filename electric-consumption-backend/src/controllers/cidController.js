const pinataService = require('../services/pinataService');
const contractService = require('../services/contractService');
const fs = require('fs');
const path = require('path');

exports.uploadAndSave = async (req, res) => {
  try {
    // Aceptar archivo subido por Multer o archivo existente
    const file = req.file || req.body.filePath; 
    let filePath, originalname;

    console.log('Inicio de uploadAndSave');
    console.log('Archivo recibido (file):', file); // log del objeto completo

    if (file?.path && file?.originalname) {
      // Caso Multer (archivo subido desde frontend)
      filePath = file.path;
      originalname = file.originalname;
    } else if (typeof file === 'string') {
      // Caso archivo existente en el servidor
      filePath = file;
      originalname = require('path').basename(file);
    } else {
      return res.status(400).json({ error: 'No file provided' });
    }

    console.log('Archivo final a subir:', filePath);

    // Subir a Pinata
    let result;
    try {
      result = await pinataService.pinFileToIPFS(filePath, originalname);
      console.log('Archivo subido a Pinata, hash:', result.IpfsHash);
    } catch (err) {
      console.error('Error subiendo a Pinata:', err);
      return res.status(500).json({ error: 'Error subiendo a Pinata', details: err.message });
    }


    // Solo eliminar si fue un archivo subido temporalmente por Multer
    //if (req.file) require('fs').unlinkSync(filePath);

    // Guardar el CID en blockchain
    let tx;
    try {
      tx = await contractService.setCID(result.IpfsHash);
      console.log('Tx enviada, hash:', tx.hash);
    } catch (err) {
      console.error('Error enviando tx a blockchain:', err);
      return res.status(500).json({ error: 'Error en blockchain', details: err.message });
    }

    res.json({
      cid: result.IpfsHash,
      txHash: tx.hash,
      notice: 'Tx enviada, puede tardar en confirmarse'
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};


exports.setCID = async (req, res) => {
  try {
    const { cid } = req.body;
    if (!cid) return res.status(400).json({ error: 'cid required' });

    const tx = await contractService.setCID(cid);
    await tx.wait();

    res.json({ cid, txHash: tx.hash });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

exports.getCID = async (req, res) => {
  try {
    const cid = await contractService.getCID();
    res.json({ cid });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};
