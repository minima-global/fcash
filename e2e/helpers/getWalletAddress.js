const axios = require("axios");

async function getWalletAddress(rpcUrl) {
  const response = await axios.get(
    `${rpcUrl}/getaddress`
  );
  return response.data.response.miniaddress;
}

module.exports = getWalletAddress;
