const pinataSDK = require('@pinata/sdk');
const axios = require('axios');
const fs = require('fs');
const fetch = require('node-fetch');

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

async function getJSONFromIPFS(cid) {
  const url = `https://gateway.pinata.cloud/ipfs/${cid}`;
  
  try {
    const response = await fetch(url);
    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Failed to fetch from IPFS. Status ${response.status}: ${text}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching JSON from IPFS:", error.message);
    throw new Error(`Failed to fetch from IPFS: ${error.message}`);
  }
}


// async function getJSONFromIPFS(CID) {
//   try {
//     const url = `https://api.pinata.cloud/data/pinList?hashContains=${CID}`;
//     const response = await axios.get(url, {
//       headers: {
//         pinata_api_key: process.env.PINATA_API_KEY,
//         pinata_secret_api_key: process.env.PINATA_API_SECRET,
//       },
//     });

//     console.log(response.data);
//   } catch (error) {
//     console.error("Error fetching from Pinata API:", error.response?.data || error.message);
//   }
// }

module.exports = { pinFileToIPFS, pinJSONToIPFS, getJSONFromIPFS };
