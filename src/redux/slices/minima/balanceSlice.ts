import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { AppThunk, RootState } from '../../store';

import { getWalletBalance } from '../../../minima/rpc-commands';
import { MinimaToken } from '../../../minima/types/minima';

export interface BalanceState {
    funds: MinimaToken[];
}
const initialState: BalanceState = {
    funds: []
};

export const callAndStoreWalletBalance =
    (): AppThunk =>
    async (dispatch) => {
      getWalletBalance()
          .then((wallet) => {
              
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

        }
    },
});

export const { updateBalance } = balanceSlice.actions;
export default balanceSlice.reducer;


export const selectBalance = (state: RootState): MinimaToken[] => {
  return state.wallet.funds
};
