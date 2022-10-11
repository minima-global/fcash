import { createSlice } from '@reduxjs/toolkit';
import { AppThunk, RootState } from '../../store';
import { AlertColor } from '@mui/material';

export interface ToastProps {
  message?: string;
  severity?: AlertColor;
  type?: string; // for className for cssmodule
}
export interface ToastState {
    display?: boolean;
    props: ToastProps;
}
const initialState: ToastState = {
    display: false,
    props: {},
};

export const showToast =
    (message: string, severity: string, type: string): AppThunk =>
    async (dispatch) => {
      const props = {message, severity, type};
      
      dispatch(updateState({display: true, ...props}));

    //   setTimeout(() => dispatch(updateState({display: false, props:{...props}})), 2000)
};

export const hideToast =
    (): AppThunk =>
    async (dispatch) => {
    const props = {message: "", severity: "", type: ""};
    
    dispatch(updateState({display: false, ...props}));
};

export const toastSlice = createSlice({
    name: "toast",
    initialState,
    reducers: {
        updateState: (state, action) => {
            // console.log(`setting toast state`, action.payload)
            const status = action.payload;
            state.display = status.display;
            state.props.message = status.message;
            state.props.type = status.type;
            state.props.severity = status.severity;
        },
    },
});

export const { updateState } = toastSlice.actions;
export default toastSlice.reducer;

// Return toast state
export const selectToastState = (state: RootState): ToastState => {
  return state.toast
};
