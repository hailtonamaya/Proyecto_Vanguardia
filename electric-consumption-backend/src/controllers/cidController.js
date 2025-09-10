const pinataService = require('../services/pinataService');
const contractService = require('../services/contractService');
const fs = require('fs');

exports.uploadAndSave = async (req, res) => {
  try {
    const file = req.file;
    console.log("BODY:", req.body);
    console.log("FILE:", req.file);
    if (!file) return res.status(400).json({ error: 'No file uploaded' });

    const result = await pinataService.pinFileToIPFS(file.path, file.originalname);
    fs.unlinkSync(file.path);

    // guardar el CID en blockchain
    const tx = await contractService.setCID(result.IpfsHash);
    await tx.wait();

    res.json({ cid: result.IpfsHash, txHash: tx.hash });
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
