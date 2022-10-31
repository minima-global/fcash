import { createSlice } from "@reduxjs/toolkit";
import { AppThunk, RootState } from "../../store";

export interface ICoinDetails {
  name: string;
  amount: string;
  unlockdatetime: string;
  unlockblock: string;
  address: string;
  coinid: string;
}
export interface FutureCoinState {
  page: number;
}
const initialState: FutureCoinState = {
  page: 0,
};

export const setPage =
  (page: number): AppThunk =>
  async (dispatch) => {
    // change page
    console.log("updating page");
    dispatch(updatePage(page));
  };

export const futureCoinSlice = createSlice({
  name: "futurecoin",
  initialState,
  reducers: {
    updatePage: (state, action) => {
      const pageNumber = action.payload;
      // console.log("updating page number to..", pageNumber);
      state.page = pageNumber;
    },
  },
});

export const { updatePage } = futureCoinSlice.actions;
export default futureCoinSlice.reducer;

// Return toast state
export const selectPageSelector = (state: RootState): FutureCoinState => {
  return state.futurepage;
};
