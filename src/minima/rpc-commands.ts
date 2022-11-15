import { FlaggedCoin } from './../redux/slices/minima/coinSlice';
import { IFutureCashCollection, IFutureCashPost } from "./types/app";
import { Coin, IScript, MinimaToken,  Status } from "./types/minima";
import { IGetAddress } from "./types/rpc";
import moment, { Moment } from "moment";
import Decimal from "decimal.js";
import { futureCashScript } from "./scripts";
import { ICoinStatus } from "../redux/slices/minima/coinSlice";


import { FIRSTTIMETXT, FLAGGEDCOINSTXT } from "./constants"

/** MDS file storage */

interface SaveSuccessPayload {
    name: string;
    size: number;
}
/**
 * 
 * @param _json a json object you want to store
 * @param _fname name of file you want to save as
 * @returns true or false if succeeded or error string
 */
const saveFile = (_fname: string = FLAGGEDCOINSTXT, _json: Object): Promise<SaveSuccessPayload> => {
    
    return new Promise((resolve, reject) => {

        MDS.file.save(_fname, JSON.stringify(_json), (result: any) => {
            // console.log(result);

            if(!result.status) {

                reject(result.error);

            }

            if (result.status) {

                if (result.exists && result.save) {

                    resolve(result.save);

                }

                
            }
        });
    })

}

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
const loadFile = (_fname: string = FLAGGEDCOINSTXT): Promise<MDSFile> => {

    return new Promise((resolve, reject) => {

        MDS.file.load(_fname, (result: any) => {
            // console.log(result);

            if (!result.status) {

                reject(result.error);

            }

            if (result.status && result.response.exists) {

                resolve(result.response.load);


            }

            
            reject()


        })


    })

}

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
        })


    })

}

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
                })

                if (success) {
                    resolve(resp[resp.length-1].response)
                } else {
                    reject(error)
                }
            }

            if (resp.status && !resp.pending) {

                resolve(resp.response);
            
            }
    
            if (!resp.status && resp.pending) {
    
                reject("pending"); 
    
            }
    
            if (!resp.status && !resp.pending) {
    
                reject(resp.message ? resp.message : resp.error ? resp.error : `RPC ${command} has failed to fire off, please open this as an issue on Minima's official repo!`);
    
            }
            
        });
    });
}

/** Setup block time */

const createBlockTime = async (dateTimeChosenByUser: Moment): Promise<number> => {

    return new Promise(async (resolve, reject) => {
        try {
            // get current time
            const now = new Date().getTime();
            const mNow = moment(now);
            const currentBlockHeight = await getBlockTime();
            const duration = dateTimeChosenByUser.toDate().getTime() - moment(mNow).toDate().getTime();
            
            if (duration <= 0) {
    
                throw new Error("You have to send cash to the future, not the present or the past ser.");
    
            }
    
            const calculatedBlocktime = blockTimeCalculator(duration);
            
            resolve(calculatedBlocktime.add(currentBlockHeight).round().toNumber());

        } catch (err) {
            reject(err)
        }

    });

}

/** Block Time Calculator */
const timePerBlock = 50;
const msTimePerBlock = timePerBlock*1000;

const blockTimeCalculator = (ms: number): Decimal => {

    return new Decimal(ms).dividedBy(msTimePerBlock);


}

/** Get block time */

const getBlockTime = (): Promise<number> => {

    return new Promise((resolve, reject) => {
        rpc(`status`).then((r: Status) => {
            
            resolve(r.chain.block);
    
        }).catch((err) => {
    
            reject(err);
    
        })
    });

}

/** Get coins */

const getFutureCoins = (_addr: string, _flaggedCoins: FlaggedCoin[]): Promise<ICoinStatus[]> => {
    return new Promise((resolve, reject) => {
        // console.log("FLAGGEDCOINS", _flaggedCoins);
        rpc(`coins relevant:true address:${_addr}`).then(async (coins) => {
            
            
            if (_flaggedCoins.length > 0) {

                resolve(coins.map((c: Coin) => {
                    const getFlaggedCoin = _flaggedCoins.find((f) => f.coinid == c.coinid);

                    if (getFlaggedCoin) {
                        // console.log("Setting interface to flagged coin")
                        return Object.assign(c, {status: "PENDING", collectedOnBlock: getFlaggedCoin.collectOnBlock})

                    }

                    return Object.assign(c, {status: "NOTCOLLECTED", collectedOnBlock: undefined})
                }))
            } else {

                resolve(coins.map((c: Coin) => Object.assign(c, { collectedOnBlock: undefined, status: "NOTCOLLECTED"})));
            
            }
            

            resolve([]);
    
        }).catch((err) => {

           reject(err);
    
    
        });
    });
}

/** Get Balance */

const getWalletBalance = (): Promise<MinimaToken[]> => {

    return new Promise((resolve, reject) => {
        rpc(`balance`).then((wallet) => {
    
            resolve(wallet);
    
        }).catch((err) => {
    
            reject(err);
    
        })
    });

}

/** Add Script */

const addFutureCashScript = (scr: string, trackall: boolean) => {

    return new Promise((resolve, reject) => {
        rpc(`newscript trackall:${trackall} script:"${scr}"`).then((script) => {
    
            resolve(script);
    
        }).catch((err) => {
    
            reject(err);
    
        })
    });


}

/** Get Script Address */

const getFutureCashScriptAddress = (): Promise<string> => {

    return new Promise((resolve, reject) => {
        rpc(`scripts`).then((scripts) => {
            let scriptAddress = undefined;
            scripts.forEach((s: IScript) => {
                if (s.script === futureCashScript) {
                    scriptAddress = s.address;
                }
            })

            if (scriptAddress) {
                resolve(scriptAddress);
            }
            
            throw new Error("Script address not found, make sure you register the futurecash script first.");
    
        }).catch((err) => {
            
            reject(err);
    
        })
    });


}

/** Collect Cash */

const collectFutureCash = (futureCash: IFutureCashCollection) => {

    return new Promise((resolve, reject) => {
        constructTransaction(futureCash).then((res) => {
    
            // console.log(res)
            resolve(res);
    
        }).catch((err) => {
    
            console.error(err);
            reject(err);
    
        })
    });
}

/** Get Address */

const getAddress = (): Promise<IGetAddress | string> => {

    return new Promise((resolve, reject) => {
        rpc(`getaddress`).then((dt) => {
    
            resolve(dt);
    
        }).catch((err) => {
    
    
            reject(err);
    
        })
    });


}

/** Send To Future */

const sendFutureCash = (fCash: IFutureCashPost): Promise<object> => {
    // console.log('fCash', fCash);
    const command = `send amount:${fCash.amount} address:${fCash.scriptAddress} tokenid:${fCash.tokenid} state:{"1": "${fCash.state1}", "2":"${fCash.state2}", "3":"${fCash.state3}", "4": "${fCash.state4}"}`;

    return new Promise((resolve, reject) => {
        rpc(command).then((r) => {
            // console.log(r)
            resolve(r);
            
        }).catch((err) => {
    
            reject(err);
    
        });
    });

}

/** Transaction constructor */

const constructTransaction = (fCash: IFutureCashCollection): Promise<boolean> => {

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
        `

        // console.log(command)

        rpc(command).then((r) => {
            // console.log(r)
            resolve(r);

        }).catch((err) => {

            reject(err);

        });
    });
}

/** is Address mine check */

const isAddressMine = (addr: string) => {

    return new Promise((resolve, reject) => {

        rpc(`scripts`).then((scripts) => {
            let scriptAddress = undefined;
            scripts.forEach((s: IScript) => {
                if (s.address === addr || s.miniaddress === addr) {
                    scriptAddress = s.address;
                }
            })

            if (scriptAddress) {
                resolve(scriptAddress);
            }
            
            throw new Error("Address not found, this address doesn't belong to you.");
    
        }).catch((err) => {
            
            reject(err);
    
        })


    })

}

/** Calculate difference between future block time and current block time */

const getBlockDifference = async (_futureBlockTime: number) => {
    const chainHeight = await getBlockTime();

    return new Decimal(_futureBlockTime).minus(chainHeight).toNumber();
}

/** Store Flagged Coins, load file add to json and override */
/**
 * 
 * @param coin FlaggedCoin to add
 * @returns SaveSuccessPayload on success
 */
const storeFlaggedCoinInMemory = (coin: FlaggedCoin): Promise<SaveSuccessPayload> => {
    return new Promise((resolve, reject) => {
        loadFile(FLAGGEDCOINSTXT).then((r) => {
            let flaggedCoins = JSON.parse(r.data);
            const override = [...flaggedCoins, coin];
            saveFile(FLAGGEDCOINSTXT, override).then((r) => resolve(r)).catch((err) => reject(err))
        }).catch((err) => {

            reject(err);

        });
    });
}
/** Check if it is users first time running app */
const getFirstTime = (): Promise<boolean> => {
    return new Promise((resolve, reject) => {
        // if (currentRound > 0) console.log(`getFirstTime retrying.. ${currentRound}`);
        loadFile(FIRSTTIMETXT).then((r: MDSFile) => {
            // console.log(r)
            // not their first time
            resolve(false);               
            
        }).catch((err) => {
            if (err.length) console.error(err); 
            saveFile(FIRSTTIMETXT, []).then((r) => console.log(r)).catch((err) => console.error(err));
            resolve(true);

        });

    })

}
/** Get Flagged Coins */
// const retry = 10;
// let currentRound = 0;
// const getFlaggedCoinsInMemory = (): Promise<FlaggedCoin[]> => {
//     return new Promise((resolve, reject) => {
//         if (currentRound > 0) console.log(`getFlaggedCoins retrying.. ${currentRound}`);
//         if (currentRound < retry) {
//             loadFileMetaData(FLAGGEDCOINSTXT).then((r) => {
//                 console.log(`Found ${FLAGGEDCOINSTXT}`, r);
//                 loadFile(FLAGGEDCOINSTXT).then((r: MDSFile) => {
                    
//                     resolve(JSON.parse(r.data));               
        
//                 }).catch((err) => {   
                    
//                    reject(err);
    
//                 });
//             }).catch((err) => {
            
//                 if (typeof err == "string" && err == "File not found") {
//                     console.log("CURRENTROUND", currentRound)
//                     saveFile(FLAGGEDCOINSTXT, []).then((r) => console.log(r)).catch((err) => console.error(err));
                    
//                     currentRound++;
//                     getFlaggedCoinsInMemory();
                
//                 } else {
    
//                     reject(err);
    
//                 }
//             });
            
//         } else {

//             reject(`Tried to find the ${FLAGGEDCOINSTXT} ${retry} times but failed to load it...`);
//         }
//     })

// }



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
    getFirstTime
};