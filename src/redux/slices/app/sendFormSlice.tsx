import { createSlice } from "@reduxjs/toolkit";
import { AppThunk, RootState } from "../../store";
import { AlertColor } from "@mui/material";

export interface SendFormState {
  page: number;
}
const initialState: SendFormState = {
  page: 0,
};

export const setPage =
  (page: number): AppThunk =>
  async (dispatch) => {
    // change page
    dispatch(updatePage(page));
  };

export const sendFormSlice = createSlice({
  name: "toast",
  initialState,
  reducers: {
    updatePage: (state, action) => {
      // console.log(`setting toast state`, action.payload)
      const pageNumber = action.payload;
      state.page = pageNumber;
    },
  },
});

export const { updatePage } = sendFormSlice.actions;
export default sendFormSlice.reducer;

// Return toast state
export const selectPageSelector = (state: RootState): SendFormState => {
  return state.page;
};
