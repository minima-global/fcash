import { Decimal } from 'decimal.js';
import { showToast } from './../app/toastSlice';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { AppThunk, RootState } from '../../store';
import { Coin } from '../../../minima/types/minima';
import { getFutureCashScriptAddress, getFutureCoins  } from '../../../minima/rpc-commands';

const NEWBLOCK = "NEWBLOCK";

type CoinStatus = "PENDING" | "NOTCOLLECTED";
export interface FlaggedCoin {
    coinid: string;
    collectOnBlock: string;
}
export interface ICoinStatus extends Coin {
    status: CoinStatus;
    collectedOnBlock: number | undefined;
}

export interface CoinState {
    coins: ICoinStatus[];
    pendingCoins: boolean; // flag to confirm there are coins on pending in our list
    flaggedCoins: FlaggedCoin[] 
}
const initialState: CoinState = {
    coins: [],
    pendingCoins: false,
    flaggedCoins: []
};

export const callAndStoreCoins = 
    (): AppThunk => async (dispatch, getState) => {

        getFutureCashScriptAddress().then((s) => {
            getFutureCoins(s, getState().coins.flaggedCoins).then((coins) => {
    
                dispatch(updateFutureBalance(coins))
    
            }).catch((err) => {
    
                console.error(err);
    
            })
        }).catch((err) => {
            console.error(err);
            dispatch(showToast(`${err}`, "warning", ""))
        })
};



export const getFlaggedCoins = 
    (): AppThunk => async (dispatch, getState) => {
        

        
};
export const flagCoinCollection = 
    (collectedCoinid: string): AppThunk => async (dispatch, getState) => {
        const chainHeight = getState().status.chainHeight;
        const flaggedCoins = getState().coins.flaggedCoins;
        getFutureCashScriptAddress().then((s) => {
            getFutureCoins(s, getState().coins.flaggedCoins).then((coins) => {

                const collectedCoin = coins.find(c => c.coinid === collectedCoinid);
                if (collectedCoin) {
                    // console.log(`Flagging coin:${collectedCoin.coinid} as pending collection on block:${chainHeight}`);
                    dispatch(updateFlaggedCoins([...flaggedCoins, {coinid: collectedCoin.coinid, collectOnBlock: chainHeight}]));
                    dispatch(callAndStoreCoins())
                }
                    
            }).catch((err) => {
    
                console.error(err);
    
            })
        }).catch((err) => {
            console.error(err);
            dispatch(showToast(`${err}`, "warning", ""))
        })
};

export const unflagCoinCollection = 
    (): AppThunk => async (dispatch, getState) => {
        const chainHeight = getState().status.chainHeight;
        getFutureCashScriptAddress().then((s) => {
            getFutureCoins(s, getState().coins.flaggedCoins).then((coins) => {
                const flaggedCoins = getState().coins.flaggedCoins;


                coins.forEach((c) => {
                    // console.log("Flagged coin", c)
                    // if this coin has pending status and collectedOnBlock is defined and the difference is a block then unflag it as collected
                    // because it must have failed and can try to be collected again
                    // the coin should leave within a couple of seconds if the checks are alright and txn is mined
                    if (c.status === 'PENDING' && c.collectedOnBlock && new Decimal(chainHeight).minus(new Decimal(c.collectedOnBlock)).greaterThan(1)) {
                        // console.log(`Unflagged coin as collected coin:${c.coinid} script must have failed`);
                        // console.log("flaggedCoins ->", flaggedCoins.filter((coin) => coin.coinid === c.coinid));
                        // filter through the coins and don't keep the coin which should be unflagged for our Map
                        dispatch(updateFlaggedCoins(flaggedCoins.filter((coin) => coin.coinid !== c.coinid)))
                        dispatch(callAndStoreCoins())
                    }
                    // if the coin is not found then we should remove it from the flaggedCoins Map
                    // because it was successfully collected
                    
                    const exists = flaggedCoins.filter((coin) => coin.coinid === c.coinid);
                    // console.log("Does this coin still exist? Should be 0 if not, 1 if it still is there", exists.length);
                    // it is has been successfully collected so remove it
                    if (exists.length === 0) {
                        // console.log("Should update flaggedCoins with this []", flaggedCoins.filter((coin) => coin.coinid === c.coinid))
                        dispatch(updateFlaggedCoins(flaggedCoins.filter((coin) => coin.coinid === c.coinid)))
                        dispatch(callAndStoreCoins())

                    }
                });

                // switch off pendingCheck if none left
                const anyPendingLeft = coins.find(c => c.status === "PENDING");
                if (!anyPendingLeft) {
                    dispatch(updatePendingStatus(false))
                }
                
    
            }).catch((err) => {
    
                console.error(err);
    
            })
        }).catch((err) => {
            console.error(err);
            dispatch(showToast(`${err}`, "warning", ""))
        })
};

export const coinSlice = createSlice({
    name: "futureCoins",
    initialState,
    reducers: {
        updateFutureBalance: (state, action: PayloadAction<any>) => {
            // console.log(action.payload)
            state.coins = action.payload;
            
        },
        updatePendingStatus: (state, action: PayloadAction<any>) => {
            // console.log(action.payload)
            state.pendingCoins = action.payload;
        },
        updateFlaggedCoins: (state, action: PayloadAction<any>) => {
            // console.log(action.payload)
            const flaggedcoins = action.payload;
            state.flaggedCoins = flaggedcoins;
        }
    },
});

export const { updateFutureBalance, updatePendingStatus, updateFlaggedCoins } = coinSlice.actions;
export default coinSlice.reducer;

// Return futurecash coins
export const selectFutureCash = (state: RootState): ICoinStatus[] => {
  return state.coins.coins
};

const selectPendingCoinCollection = (state: RootState): boolean => {
    return state.coins.pendingCoins;
}



export const coinMiddleware = (store: any) => (next: any) => (action: any) => {

    
    if (action.type === NEWBLOCK && selectPendingCoinCollection(store.getState())) {
        // if there's a pending coin and collectedOnblock is older than 3 then remove as PENDING back to NOTCOLLECTED
        console.log("pending coin collection check up")
        store.dispatch(unflagCoinCollection())
    }

    console.log(action)


    return next(action)
}

export function onNewBlock() {
    return {
        type: NEWBLOCK,
    }
}



