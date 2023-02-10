import { showToast } from './../app/toastSlice';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { AppThunk, RootState } from '../../store';
import { getBlockTime } from '../../../minima/rpc-commands';

export interface StatusState {
    chainHeight: number;
    displayChainHeight: boolean;
}
const initialState: StatusState = {
    chainHeight: 0,
    displayChainHeight: false
};

export const callAndStoreChainHeight = 
    (): AppThunk => async (dispatch) => {

        getBlockTime().then((cH) => {
            
            dispatch(updateChainHeight(cH))
            
        }).catch((err) => {
            console.error(err);
            //dispatch(showToast(`${err}`, "warning", ""))
        })
};
export const displayChainHeight = 
    (s: boolean): AppThunk => async (dispatch) => {

        dispatch(updateDisplayChainHeight(s));
        
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
        updateDisplayChainHeight: (state, action: PayloadAction<any>) => {
            // console.log(action);
            const status = action.payload;
            state.displayChainHeight = status; 
        }, 
    },
});

export const { updateChainHeight, updateDisplayChainHeight } = statusSlice.actions;
export default statusSlice.reducer;

// Return balance
export const selectChainHeight = (state: RootState): number => {
  return state.status.chainHeight
};
export const selectDisplayChainHeight = (state: RootState): boolean => {
  return state.status.displayChainHeight
};
