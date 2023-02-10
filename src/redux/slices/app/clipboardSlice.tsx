import { createSlice } from "@reduxjs/toolkit";
import { AppThunk, RootState } from "../../store";

export interface ClipboardState {
  status: boolean;
}
const initialState: ClipboardState = {
  status: false,
};

export const setClipboardStatus =
  (s: boolean): AppThunk =>
  async (dispatch) => {
    // change page
    dispatch(updateStatus(s));
    console.log(`dispatching.. copy..`);
    setTimeout(() => {
      dispatch(updateStatus(!s));
    }, 1500);
  };

export const clipboardSlice = createSlice({
  name: "clipboard",
  initialState,
  reducers: {
    updateStatus: (state, action) => {
      const s = action.payload;
      state.status = s;
    },
  },
});

export const { updateStatus } = clipboardSlice.actions;
export default clipboardSlice.reducer;

// Return toast state
export const selectClipboardSelector = (state: RootState): ClipboardState => {
  return state.clipboard;
};
