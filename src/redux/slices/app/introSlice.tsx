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
      state.page = pageNumber;
    },
  },
});

export const { updatePage } = introSlice.actions;
export default introSlice.reducer;

// Return toast state
export const selectPageSelector = (state: RootState): IntroState => {
  return state.page;
};
