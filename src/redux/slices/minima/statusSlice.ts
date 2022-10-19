import { showToast } from './../app/toastSlice';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { AppThunk, RootState } from '../../store';
import { getBlockTime } from '../../../minima/rpc-commands';

export interface StatusState {
    chainHeight: number;
}
const initialState: StatusState = {
    chainHeight: 0
};

export const callAndStoreChainHeight = 
    (): AppThunk => async (dispatch) => {

        getBlockTime().then((cH) => {
            
            dispatch(updateChainHeight(cH))
            
        }).catch((err) => {
            console.error(err);
            dispatch(showToast(`${err}`, "warning", ""))
        })
};


export const statusSlice = createSlice({
    name: "mining",
    initialState,
    reducers: {
        updateChainHeight: (state, action: PayloadAction<any>) => {
            // console.log(action);
            const height = action.payload;
            state.chainHeight = height;
        },
    },
});

export const { updateChainHeight } = statusSlice.actions;
export default statusSlice.reducer;

// Return balance
export const selectChainHeight = (state: RootState): number => {
  return state.status.chainHeight
};
