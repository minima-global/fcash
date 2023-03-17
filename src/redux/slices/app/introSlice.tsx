import { createSlice } from "@reduxjs/toolkit";
import { getFirstTime } from "../../../minima/rpc-commands";
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
  try {
    const isUsersFirstTime = await getFirstTime();
    dispatch(updateFirstTime(isUsersFirstTime));
  } catch (error) {
    console.error(error);
  }
};

export const introSlice = createSlice({
  name: "intro",
  initialState,
  reducers: {
    updatePage: (state, action) => {
      const pageNumber = action.payload;
      // console.log("updating page", pageNumber);
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
