import { createSlice } from "@reduxjs/toolkit";
import { AppThunk, RootState } from "../../store";

export interface SendFormState {
  page: number;
}
const initialState: SendFormState = {
  page: 0,
};

export const setPage =
  (page: number): AppThunk =>
  async (dispatch) => {
    console.log("page", page);
    // change page
    dispatch(updatePage(page));
  };

export const sendFormSlice = createSlice({
  name: "sendform",
  initialState,
  reducers: {
    updatePage: (state, action) => {
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
