import { createSlice } from "@reduxjs/toolkit";
import { AppThunk, RootState } from "../../store";

export interface MenuState {
  status: boolean;
}
const initialState: MenuState = {
  status: false,
};

export const toggleState =
  (s: boolean): AppThunk =>
  async (dispatch) => {
    dispatch(updateState(s));
  };

export const hideToast = (): AppThunk => async (dispatch) => {
  const props = { message: "", severity: "", type: "" };

  dispatch(updateState({ display: false, ...props }));
};

export const toastSlice = createSlice({
  name: "toast",
  initialState,
  reducers: {
    updateState: (state, action) => {
      // console.log(`setting toast state`, action.payload)
      const status = action.payload;
      state.status = status;
    },
  },
});

export const { updateState } = toastSlice.actions;
export default toastSlice.reducer;

// Return toast state
export const selectMenuStateStatus = (state: RootState): boolean => {
  return state.menu.status;
};
