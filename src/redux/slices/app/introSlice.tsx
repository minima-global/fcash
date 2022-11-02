import { createSlice } from "@reduxjs/toolkit";
import { FIRSTTIMETXT } from "../../../minima/constants";
import {
  getFirstTime,
  loadFile,
  loadFileMetaData,
} from "../../../minima/rpc-commands";
import { AppThunk, RootState } from "../../store";

export interface IntroState {
  page: number;
  firstTime: boolean;
}
const initialState: IntroState = {
  page: 0,
  firstTime: true,
};

export const setPage =
  (page: number): AppThunk =>
  async (dispatch) => {
    dispatch(updatePage(page));
  };
export const checkIfFirstTime = (): AppThunk => async (dispatch) => {
  // let's check if file exists, if not create it
  getFirstTime()
    .then((r) => {
      if (r) {
        return dispatch(updateFirstTime(false));
      }

      dispatch(updateFirstTime(true));
    })
    .catch((err) => {
      console.log(err);
      dispatch(updateFirstTime(true));
    });
};

export const introSlice = createSlice({
  name: "intro",
  initialState,
  reducers: {
    updatePage: (state, action) => {
      const pageNumber = action.payload;
      console.log("updating page", pageNumber);
      state.page = pageNumber;
    },
    updateFirstTime: (state, action) => {
      const s = action.payload;

      state.firstTime = s;
    },
  },
});

export const { updatePage, updateFirstTime } = introSlice.actions;
export default introSlice.reducer;

// Return toast state
export const selectPageSelector = (state: RootState): number => {
  return state.intropage.page;
};

export const selectFirstTime = (state: RootState): boolean => {
  return state.intropage.firstTime;
};
