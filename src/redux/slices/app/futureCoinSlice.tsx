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
export const setDetails =
  (payload: ICoinDetails): AppThunk =>
  async (dispatch) => {
    // switch details page on
    dispatch(updateDetails(true));
    // set coin details payload
    dispatch(updateDetailsPayload(payload));
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
    updateDetailsPayload: (state, action) => {
      const payload = action.payload;
      state.detailsPayload = payload;
    },
  },
});

export const { updatePage, updateDetails, updateDetailsPayload } =
  futureCoinSlice.actions;
export default futureCoinSlice.reducer;

// Return toast state
export const selectPageSelector = (state: RootState): FutureCoinState => {
  return state.futurepage;
};
