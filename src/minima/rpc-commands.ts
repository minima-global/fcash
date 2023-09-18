import { FlaggedCoin } from "./../redux/slices/minima/coinSlice";
import { IFutureCashCollection, IFutureCashPost } from "./@types/app";
import { Coin, IScript, MinimaToken, Status } from "./@types/minima";
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
      //console.log(res);
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

const rpc = (command: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    MDS.cmd(command, (res) => {
      const multiResponse = res.length > 1;
      if (!multiResponse && !res.status) {
        reject(res.error ? res.error : "RPC Failed");
      }

      if (multiResponse) {
        res.map((r: any) => {
          if (!r.status && r.pending) {
            reject("pending");
          }
          if (!r.status) {
            const error = r.error
              ? r.error
              : r.message
              ? r.message
              : `${r.command} failed`;
            reject(error);
          }
        });
      }

      resolve(true);
    });
  });
};

/** Setup block time */

const createBlockTime = async (dateTimeChosenByUser: Date) => {
  try {
    // get current time
    const now = new Date().getTime();
    const duration = new Decimal(dateTimeChosenByUser.getTime()).minus(now);
    const currentBlockHeight = await getBlockHeight();

    if (duration.lessThanOrEqualTo(0)) {
      throw new Error(
        "You have to send cash to the future, not the present or the past."
      );
    }

    const calculatedBlocktime = blockTimeCalculator(duration.toNumber());

    return calculatedBlocktime.add(currentBlockHeight).round().toNumber();
  } catch (err) {
    throw err;
  }
};

/** Block Time Calculator */
const timePerBlock = 50;
const msTimePerBlock = timePerBlock * 1000;

const blockTimeCalculator = (ms: number): Decimal => {
  return new Decimal(ms).dividedBy(msTimePerBlock);
};

const getBlockHeight = (): Promise<number> => {
  return new Promise((resolve, reject) => {
    MDS.cmd("block", (resp: any) => {
      if (resp.status) {
        resolve(resp.response.block);
      }
    });
  });
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
        console.error(err);
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
    if (script && script.address) {
      return script.address;
    }

    throw new Error("not found");
  } catch (error: any) {
    throw new Error(error);
  }
};

/** Collect Cash */

const collectFutureCash = (futureCash: IFutureCashCollection) => {
  return new Promise((resolve, reject) => {
    constructTransaction(futureCash)
      .then(() => {
        resolve(true);
      })
      .catch((err) => {
        console.error(err);
        reject(err);
      });
  });
};

/** Send To Future */

const sendFutureCash = async (fCash: IFutureCashPost): Promise<object> => {
  try {
    const hasPassword =
      fCash.password && fCash.password.length ? fCash.password : false;
    const hasBurn = fCash.burn && fCash.burn.length ? fCash.burn : false;

    return await rpc(
      `send amount:${fCash.amount} address:${fCash.scriptAddress} tokenid:${
        fCash.tokenid
      } ${hasBurn ? "burn:" + hasBurn : ""} ${
        hasPassword ? "password:" + hasPassword : ""
      } state:{"0": "0xFF","1": "${fCash.state1}", "2":"${
        fCash.state2
      }", "3":"${fCash.state3}", "4": "${fCash.state4}"}`
    );
  } catch (err: any) {
    throw new Error(err);
  }
};

/** Transaction constructor */

const constructTransaction = (
  fCash: IFutureCashCollection
): Promise<boolean> => {
  const id = Math.floor(Math.random() * 1000000000);
  return new Promise((resolve, reject) => {
    const command = `
            txncreate id:${id};
            txninput id:${id} coinid:${fCash.coinid};
            txnoutput id:${id} address:${fCash.address} amount:${fCash.amount} tokenid:${fCash.tokenid} storestate:false;
            txnbasics id:${id};
            txnpost id:${id};
            txndelete id:${id}
        `;
    rpc(command)
      .then((r) => {
        // console.log(r);
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

        // throw new Error(
        //   "Address not found, this address doesn't belong to you."
        // );
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
    // console.error(error);
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
