const pause = require('./pause');
const getValue = require('./getValue');
const createToken = require('./createToken');
const createNft = require('./createNFT');
const getByTestId = require('./getByTestId');
const getTextContent = require('./getTextContent');
const getWalletAddress = require('./getWalletAddress');
const setAppPermission = require('./setAppPermission');
const acceptPermissionRequest = require('./acceptPermissionRequest');
const setTimeLock = require('./setTimeLock');

const helpers = {
  pause,
  getValue,
  getByTestId,
  getTextContent,
  createToken,
  createNft,
  getWalletAddress,
  setAppPermission,
  acceptPermissionRequest,
  setTimeLock,
};

module.exports = helpers;
