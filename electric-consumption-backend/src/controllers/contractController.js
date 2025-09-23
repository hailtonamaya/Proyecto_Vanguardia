const axios = require("axios");

exports.getBlockchainTransactions = async (req, res) => {
  try {
    const contractAddress = process.env.CONTRACT_ADDRESS;
    const apiKey = process.env.POLYGONSCAN_API_KEY;

    const url = `https://api.etherscan.io/v2/api?chainid=80002&module=account&action=txlist&address=${contractAddress}&startblock=0&endblock=99999999&sort=desc&apikey=${apiKey}`;

    const { data } = await axios.get(url);

    if (data.status === "1") {
      res.json(data.result); // lista de transacciones
    } else {
      res.status(400).json({ error: data.message });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al obtener transacciones" });
  }
};
