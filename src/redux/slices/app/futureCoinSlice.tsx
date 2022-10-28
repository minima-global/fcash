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
  details: boolean;
  detailsPayload: ICoinDetails | undefined;
}
const initialState: FutureCoinState = {
  page: 0,
  details: false,
  detailsPayload: undefined,
};

export const setPage =
  (page: number): AppThunk =>
  async (dispatch) => {
    // change page
    console.log("updating page");
    dispatch(updatePage(page));
  };

export const showDetails =
  (status: boolean): AppThunk =>
  async (dispatch) => {
    // change page
    dispatch(updateDetails(status));
  };

export const futureCoinSlice = createSlice({
  name: "futurecoin",
  initialState,
  reducers: {
    updatePage: (state, action) => {
      const pageNumber = action.payload;
      console.log("updating page number to..", pageNumber);
      state.page = pageNumber;
    },
    updateDetails: (state, action) => {
      const status = action.payload;
      state.details = status;
    },
  },
});

export const { updatePage, updateDetails } = futureCoinSlice.actions;
export default futureCoinSlice.reducer;

// Return toast state
export const selectPageSelector = (state: RootState): FutureCoinState => {
  return state.futurepage;
};
