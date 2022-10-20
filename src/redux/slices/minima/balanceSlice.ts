import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { AppThunk, RootState } from '../../store';

import { getWalletBalance } from '../../../minima/rpc-commands';
import { MinimaToken } from '../../../minima/types/minima';

const NEWBLOCK = "NEWBLOCK";

export interface BalanceState {
    funds: MinimaToken[];
    updateRequired: boolean;
}
const initialState: BalanceState = {
    funds: [],
    updateRequired: false
};

export const callAndStoreWalletBalance =
    (): AppThunk =>
    async (dispatch) => {
      getWalletBalance()
          .then((wallet: MinimaToken[]) => {
            
            
            const hasUnconfirmedBalance = !!wallet.find((i) => i.unconfirmed !== "0");
            if (hasUnconfirmedBalance) {

                dispatch(needsUpdating(true))

            }
            
            if (!hasUnconfirmedBalance) {

                dispatch(needsUpdating(false))
            
            }

            dispatch(updateBalance(wallet));
          })
          .catch((err) => {
              console.error(err);
          });
};


export const balanceSlice = createSlice({
    name: "balance",
    initialState,
    reducers: {
        updateBalance: (state, action: PayloadAction<any>) => {

            state.funds = action.payload;


        },
        needsUpdating: (state, action: PayloadAction<any>) => {

            state.updateRequired = action.payload;


        }
    },
});

export const { updateBalance, needsUpdating } = balanceSlice.actions;
export default balanceSlice.reducer;


export const selectBalance = (state: RootState): MinimaToken[] => {
  return state.wallet.funds
};

export const selectBalanceNeedsUpdating = (state: RootState): boolean => {
    return state.wallet.updateRequired;
}



export const balanceMiddleware = (store: any) => (next: any) => (action: any) => {

    
    if (action.type === NEWBLOCK && selectBalanceNeedsUpdating(store.getState())) {
    
        store.dispatch(callAndStoreWalletBalance())
    }


    return next(action)
}

export function onNewBlock() {
    return {
        type: NEWBLOCK,
    }
}