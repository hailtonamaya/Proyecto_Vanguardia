const pinataSDK = require('@pinata/sdk');
const fs = require('fs');

const pinata = new pinataSDK(process.env.PINATA_API_KEY, process.env.PINATA_API_SECRET);

async function pinFileToIPFS(filePath, fileName) {
  const readableStream = fs.createReadStream(filePath);
  const options = {
    pinataMetadata: { name: fileName }
  };
  return await pinata.pinFileToIPFS(readableStream, options);
}

async function pinJSONToIPFS(json) {
  return await pinata.pinJSONToIPFS(json);
}

module.exports = { pinFileToIPFS, pinJSONToIPFS };
