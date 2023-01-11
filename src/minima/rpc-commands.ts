import { FlaggedCoin } from "./../redux/slices/minima/coinSlice";
import { IFutureCashCollection, IFutureCashPost } from "./types/app";
import { Coin, IScript, MinimaToken, Status } from "./types/minima";
import { IGetAddress } from "./types/rpc";
import moment, { Moment } from "moment";
import Decimal from "decimal.js";
import { futureCashScript } from "./scripts";
import { ICoinStatus } from "../redux/slices/minima/coinSlice";

import { FIRSTTIMETXT, FLAGGEDCOINSTXT } from "./constants";

/** MDS file storage */

/**
 *
 * @param _json a json object you want to store
 * @param _fname name of file you want to save as
 * @returns true or false if succeeded or error string
 */
const saveFile = async (_fname: string = FLAGGEDCOINSTXT, _json: Object) => {
  return new Promise((resolve, reject) => {
    MDS.file.save(_fname, JSON.stringify(_json), (res: any) => {
      if (!res.status && !res.pending) {
        reject(res.error);
      }

      if (!res.status && res.pending) {
        reject("This action is pending...");
      }

      if (res.status && !res.pending) {
        const fileSaved = res.response.save;
        if (fileSaved) {
          resolve(fileSaved);
        }
      }
    });
  });
};

export interface MDSFile {
  data: string;
  name: string;
  size: number;
}
/**
 *
 * @param _fname name of file
 * @returns file contents
 */
/** */
const loadFile = async (_fname: string = FLAGGEDCOINSTXT) => {
  return new Promise((resolve, reject) => {
    MDS.file.load(_fname, (res: any) => {
      console.log(res);
      if (!res.status && !res.pending) {
        reject(res.error);
      }

      if (!res.status && res.pending) {
        reject("This action is pending...");
      }

      if (res.status && !res.pending) {
        // const fileSaved = res.response.save;
        resolve("File found");
      }
    });
  });
  try {
    const res = await MDS.file.load(_fname);
    console.log(res);
    const foundFile = res.status;

    if (!foundFile) {
      throw new Error(res.error);
    }

    if (foundFile) {
      const file = res.response.load;
      return file;
    }
  } catch (error: any) {
    throw new Error(error);
  }
};

interface MDSFileMetaData {
  isdir: boolean;
  isfile: boolean;
  name: string;
  size: number;
}
/**
 *
 * @param _f the name of the file you want to search for
 * @returns MDSFile object
 */
const loadFileMetaData = (_f: string): Promise<MDSFileMetaData> => {
  return new Promise((resolve, reject) => {
    MDS.file.list("/", (result: any) => {
      if (!result.status) {
        reject(result.error);
      }

      if (result.status && result.response.exists) {
        // folder '/' exists..
        const listOfFiles: MDSFileMetaData[] = result.response.list;
        const flaggedCoinsFile = listOfFiles.find((f) => f.name == _f);

        if (!flaggedCoinsFile) reject("File not found");

        if (flaggedCoinsFile) resolve(flaggedCoinsFile);
      } else {
        reject("Folder '/' not found!");
      }
    });
  });
};

/** Rpc cmd */

const rpc = (command: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    MDS.cmd(command, (resp: any) => {
      //console.log(resp)

      if (resp.length > 0) {
        //console.log(`multi command activity.`);
        let success = true;
        let error = "";
        resp.forEach((r: any) => {
          if (!r.status) {
            success = false;
            error = r.error;
            return;
          }
        });

        if (success) {
          resolve(resp[resp.length - 1].response);
        } else {
          reject(error);
        }
      }

      if (resp.status && !resp.pending) {
        resolve(resp.response);
      }

      if (!resp.status && resp.pending) {
        reject("pending");
      }

      if (!resp.status && !resp.pending) {
        reject(
          resp.message
            ? resp.message
            : resp.error
            ? resp.error
            : `RPC ${command} has failed to fire off, please open this as an issue on Minima's official repo!`
        );
      }
    });
  });
};

/** Setup block time */

const createBlockTime = async (
  dateTimeChosenByUser: Moment
): Promise<number> => {
  return new Promise(async (resolve, reject) => {
    try {
      // get current time
      const now = new Date().getTime();
      const mNow = moment(now);
      const currentBlockHeight = await getBlockTime();
      const duration =
        dateTimeChosenByUser.toDate().getTime() -
        moment(mNow).toDate().getTime();

      if (duration <= 0) {
        throw new Error(
          "You have to send cash to the future, not the present or the past."
        );
      }

      const calculatedBlocktime = blockTimeCalculator(duration);

      resolve(calculatedBlocktime.add(currentBlockHeight).round().toNumber());
    } catch (err) {
      reject(err);
    }
  });
};

/** Block Time Calculator */
const timePerBlock = 50;
const msTimePerBlock = timePerBlock * 1000;

const blockTimeCalculator = (ms: number): Decimal => {
  return new Decimal(ms).dividedBy(msTimePerBlock);
};

/** Get block time */

const getBlockTime = (): Promise<number> => {
  return new Promise((resolve, reject) => {
    rpc(`status`)
      .then((r: Status) => {
        resolve(r.chain.block);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

/** Get coins */

const getFutureCoins = (
  _addr: string,
  _flaggedCoins: FlaggedCoin[]
): Promise<ICoinStatus[]> => {
  return new Promise((resolve, reject) => {
    // console.log("FLAGGEDCOINS", _flaggedCoins);
    rpc(`coins relevant:true address:${_addr}`)
      .then(async (coins) => {
        if (_flaggedCoins.length > 0) {
          resolve(
            coins.map((c: Coin) => {
              const getFlaggedCoin = _flaggedCoins.find(
                (f) => f.coinid == c.coinid
              );

              if (getFlaggedCoin) {
                // console.log("Setting interface to flagged coin")
                return Object.assign(c, {
                  status: "PENDING",
                  collectedOnBlock: getFlaggedCoin.collectOnBlock,
                });
              }

              return Object.assign(c, {
                status: "NOTCOLLECTED",
                collectedOnBlock: undefined,
              });
            })
          );
        } else {
          resolve(
            coins.map((c: Coin) =>
              Object.assign(c, {
                collectedOnBlock: undefined,
                status: "NOTCOLLECTED",
              })
            )
          );
        }

        resolve([]);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

/** Get Balance */

const getWalletBalance = (): Promise<MinimaToken[]> => {
  return new Promise((resolve, reject) => {
    rpc(`balance`)
      .then((wallet) => {
        resolve(wallet);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

/** Add Script */

const addFutureCashScript = async (scr: string, trackall: boolean) => {
  try {
    const addScript = await rpc(
      `newscript trackall:${trackall} script:"${scr}"`
    );

    if (typeof addScript === "string") {
      throw new Error(addScript);
    }

    return addScript;
  } catch (error: any) {
    throw new Error(error);
  }
};

/** Get Script Address */

const getFutureCashScriptAddress = async () => {
  try {
    const scripts = await rpc(`scripts`);

    const script = scripts.find((s: IScript) => s.script === futureCashScript);
    return script.address;
  } catch (error: any) {
    throw new Error(error);
  }
};

/** Collect Cash */

const collectFutureCash = (futureCash: IFutureCashCollection) => {
  return new Promise((resolve, reject) => {
    constructTransaction(futureCash)
      .then((res) => {
        // console.log(res)
        resolve(res);
      })
      .catch((err) => {
        console.error(err);
        reject(err);
      });
  });
};

/** Send To Future */

const sendFutureCash = (fCash: IFutureCashPost): Promise<object> => {
  // console.log('fCash', fCash);
  const command = `send amount:${fCash.amount} address:${fCash.scriptAddress} tokenid:${fCash.tokenid} state:{"1": "${fCash.state1}", "2":"${fCash.state2}", "3":"${fCash.state3}", "4": "${fCash.state4}"}`;

  return new Promise((resolve, reject) => {
    rpc(command)
      .then((r) => {
        // console.log(r)
        resolve(r);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

/** Transaction constructor */

const constructTransaction = (
  fCash: IFutureCashCollection
): Promise<boolean> => {
  const id = Math.floor(Math.random() * 1000000000);

  return new Promise((resolve, reject) => {
    // console.log(`Token Amount`, fCash.amount)
    // console.log(`Token tokenid`, fCash.tokenid)
    const command = `
            txncreate id:${id};
            txninput id:${id} coinid:${fCash.coinid};
            txnoutput id:${id} address:${fCash.address} amount:${fCash.amount} tokenid:${fCash.tokenid} storestate:false;
            txnbasics id:${id};
            txnpost id:${id};
            txndelete id:${id}
        `;

    // console.log(command)

    rpc(command)
      .then((r) => {
        // console.log(r)
        resolve(r);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

/** is Address mine check */

const isAddressMine = (addr: string) => {
  return new Promise((resolve, reject) => {
    rpc(`scripts`)
      .then((scripts) => {
        let scriptAddress = undefined;
        scripts.forEach((s: IScript) => {
          if (s.address === addr || s.miniaddress === addr) {
            scriptAddress = s.address;
          }
        });

        if (scriptAddress) {
          resolve(scriptAddress);
        }

        throw new Error(
          "Address not found, this address doesn't belong to you."
        );
      })
      .catch((err) => {
        reject(err);
      });
  });
};

/** Calculate difference between future block time and current block time */

const getBlockDifference = async (_futureBlockTime: number) => {
  const chainHeight = await getBlockTime();

  return new Decimal(_futureBlockTime).minus(chainHeight).toNumber();
};

/** Check if it is users first time running app */
const getFirstTime = async () => {
  try {
    await loadFile(FIRSTTIMETXT);

    return false;
  } catch (error) {
    console.error(error);
    try {
      await saveFile(FIRSTTIMETXT, []);

      return true;
    } catch (error: any) {
      console.error(error);
      throw new Error(error);
    }
  }
};

export {
  rpc,
  getFutureCoins,
  getWalletBalance,
  getBlockDifference,
  addFutureCashScript,
  sendFutureCash,
  getFutureCashScriptAddress,
  createBlockTime,
  collectFutureCash,
  getBlockTime,
  isAddressMine,
  saveFile,
  loadFile,
  loadFileMetaData,
  getFirstTime,
};
