import { createSlice } from "@reduxjs/toolkit";
import { AppThunk, RootState } from "../../store";

export interface IntroState {
  page: number;
}
const initialState: IntroState = {
  page: 0,
};

export const setPage =
  (page: number): AppThunk =>
  async (dispatch) => {
    dispatch(updatePage(page));
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
  },
});

export const { updatePage } = introSlice.actions;
export default introSlice.reducer;

export const selectPageSelector = (state: RootState): number => {
  return state.intropage.page;
};
