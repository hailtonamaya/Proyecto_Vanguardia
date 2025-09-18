const pinataService = require('../services/pinataService');
const contractService = require('../services/contractService');
const fs = require('fs');
const path = require('path');

exports.getBlockchainHistorial = async (req, res) => {
  try {
    const cid = await contractService.getCID();
    if (!cid) return res.status(404).json({ error: 'No CID found in blockchain' });
    const json = await pinataService.getJSONFromIPFS(cid);
    res.json(json);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

exports.getLocalHistorial = (req, res) => {
  try {
    const filePath = path.join(__dirname, '../uploads/historial.json');
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'No local historial file found' });
    }
    const data = fs.readFileSync(filePath);
    res.json(JSON.parse(data));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};
