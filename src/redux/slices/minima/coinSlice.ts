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
        getFutureCashScriptAddress().then((s) => {
            getFutureCoins(s, getState().coins.flaggedCoins).then((coins) => {
                const collectedCoin = coins.find(c => c.coinid == collectedCoinid);
                if (collectedCoin) {
                    console.log(`Flagging coin:${collectedCoin.coinid} as pending collection on block:${chainHeight}`);
                    dispatch(updateFlaggedCoins({coinid: collectedCoin.coinid, collectOnBlock: chainHeight}));
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
                
                coins.forEach((c) => {
                    if (c.status === 'PENDING' && c.collectedOnBlock && new Decimal(chainHeight).minus(new Decimal(c.collectedOnBlock)).greaterThan(1)) {
                        console.log(`Block difference since collection: ${new Decimal(chainHeight).minus(new Decimal(c.collectedOnBlock)).greaterThan(1)}`)
                        console.log(`Unflagged coin as collected coin:${c.coinid} script must have failed`);
                        
                        const flaggedCoins = getState().coins.flaggedCoins;
                        console.log("flaggedCoins ->", flaggedCoins.filter((coin) => coin.coinid == c.coinid));
                        dispatch(updateFlaggedCoins(flaggedCoins.filter((coin) => coin.coinid == c.coinid)))
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
            const _fCoins = state.flaggedCoins;
            _fCoins.push(action.payload);
            state.flaggedCoins = _fCoins;
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


    return next(action)
}

export function onNewBlock() {
    return {
        type: NEWBLOCK,
    }
}



