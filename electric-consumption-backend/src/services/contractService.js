const { ethers } = require('ethers');
const abi = require('../abis/StorageCID.json');

const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
const writeContract = new ethers.Contract(process.env.CONTRACT_ADDRESS, abi, wallet);
const readContract = new ethers.Contract(process.env.CONTRACT_ADDRESS, abi, provider);

module.exports = {
  setCID: async (cid) => {
    return await writeContract.setCID(cid, { gasLimit: 300_000 });
  },
  getCID: async () => {
    console.log('Fetching CID from contract...');
    return await readContract.getCID();
  }
};
