import { showToast } from './../app/toastSlice';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { AppThunk, RootState } from '../../store';
import { Coin } from '../../../minima/types/minima';
import { getFutureCashScriptAddress, getFutureCoins } from '../../../minima/rpc-commands';



export interface CoinState {
    coins: Coin[];
}
const initialState: CoinState = {
    coins: [],
};

export const callAndStoreCoins = 
    (): AppThunk => async (dispatch, getState) => {

        getFutureCashScriptAddress().then((s) => {
            getFutureCoins(s).then((coins) => {
    
                dispatch(updateFutureBalance(coins))
    
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
            
        }
    },
});

export const { updateFutureBalance } = coinSlice.actions;
export default coinSlice.reducer;

// Return balance
export const selectFutureCash = (state: RootState): Coin[] => {
  return state.coins.coins
};



