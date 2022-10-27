import { IFutureCashCollection, IFutureCashPost } from "./types/app";
import { Coin, IScript, MinimaToken,  Status } from "./types/minima";
import { IGetAddress } from "./types/rpc";
import moment, { Moment } from "moment";
import Decimal from "decimal.js";
import { futureCashScript } from "./scripts";



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
    
                reject(resp.error);
    
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

const getBlockTime = (): Promise<number | string> => {

    return new Promise((resolve, reject) => {
        rpc(`status`).then((r: Status) => {
            
            resolve(r.chain.block);
    
        }).catch((err) => {
    
            reject(err);
    
        })
    });

}

/** Get coins */

const getFutureCoins = (addr: string): Promise<Coin[] | string> => {
    return new Promise((resolve, reject) => {

        rpc(`coins relevant:true address:${addr}`).then((coins) => {
            
            resolve(coins);
    
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
    
            console.log(res)
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
    console.log('fCash', fCash);
    const command = `send amount:${fCash.amount} address:${fCash.scriptAddress} tokenid:${fCash.tokenid} state:{"1": "${fCash.state1}", "2":"${fCash.state2}", "3":"${fCash.state3}"}`;

    return new Promise((resolve, reject) => {
        rpc(command).then((r) => {
            console.log(r)
            resolve(r);
            
        }).catch((err) => {
    
            reject(err);
    
        });
    });

}

/** Transaction constructor */

const constructTransaction = (fCash: IFutureCashCollection): Promise<string | boolean> => {

    const id = Math.floor(Math.random() * 1000000000);

    return new Promise((resolve, reject) => {

        console.log(`Token Amount`, fCash.amount)
        console.log(`Token tokenid`, fCash.tokenid)
        const command = `
            txncreate id:${id};
            txninput id:${id} coinid:${fCash.coinid};
            txnoutput id:${id} address:${fCash.address} amount:${fCash.amount} tokenid:${fCash.tokenid} storestate:false;
            txnbasics id:${id};
            txnpost id:${id};
            txndelete id:${id}
        `

        rpc(command).then((r) => {
            
            resolve(r);

        }).catch((err) => {

            reject(err);

        })

        // txn(rpc, {command: 'Create', id: id}).then(() => {
        //     console.log(`Transaction:${id} created. :)`)
        //     txn(rpc, {id: id, command: 'Input', input: {coinid: fCash.coinid}}).then(() => {
        //         console.log(`Transaction:${id} input(s) added. :)`);
    
        //         txn(rpc, {id: id, command: 'Output', output: {address: fCash.address, amount: fCash.amount, tokenid: fCash.tokenid, storestate: true}}).then(() => {
        //             console.log(`Transaction:${id} output(s) added. :)`);
    
        //             txn(rpc, {id: id, command: 'Basics'}).then(() => {
        //                 console.log(`Transaction:${id} mmr proofs added. :)`);
                        
        //                 txn(rpc, {id: id, command: 'Delete'}).then(() => {
    
        //                     console.log(`Transaction:${id} completed & deleted. :)`);
        //                     resolve(true);
    
        //                 }).catch((err) => {
    
        //                     throw new Error(err);
    
        //                 })
        //                 // txn(rpc, {id: id, command: 'Sign', sign: {publickey: fCash.publickey}}).then(() => {
        //                 //     console.log(`Transaction:${id} signed. :)`);
    
    
        //                 // }).catch((err) => {
    
        //                 //     throw new Error(err);
    
        //                 // })
    
    
        //             }).catch((err) => {
    
        //                 throw new Error(err);
    
        //             })
    
        //         }).catch((err) => {
    
        //             throw new Error(err);
    
        //         })
    
        //     }).catch((err) => {
    
        //         throw new Error(err);
    
        //     })
    
    
        // }).catch((err) => {
    
        //     reject(err);
            
        // });


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



export {
    rpc,
    getFutureCoins, 
    getWalletBalance, 
    addFutureCashScript, 
    sendFutureCash, 
    getFutureCashScriptAddress, 
    createBlockTime,
    collectFutureCash,
    getBlockTime,
    isAddressMine
};