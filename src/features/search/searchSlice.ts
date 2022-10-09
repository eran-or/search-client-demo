import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import { fetchResults } from "./searchAPI";
import type { Result } from "./searchAPI";

export interface SearchState {
  data: Result[];
  status: "idle" | "loading" | "failed";
  limit: number;
  currentSearch: string;
  offset: number;
  totalRequests: number;
}

const initialState: SearchState = {
  data: [],
  status: "idle",
  limit: 9,
  offset: 9,
  currentSearch: "",
  totalRequests: 0,
};
export const searchReducer = createSlice({
  name: "search",
  initialState,
  reducers: {
    setOffset: (state) => {
      state.offset += 9;
    },
    setCurrentSearch: (state, action) => {
      state.currentSearch = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(search.pending, (state) => {
        state.status = "loading";
        state.totalRequests += 1;
      })
      .addCase(search.fulfilled, (state, action) => {
        state.status = "idle";

        if (!action.meta.arg) {
          state.data = [];
        } else if (state.currentSearch !== action.meta.arg) {
          state.data = [...(action.payload as [])];
        } else {
          state.data = [...state.data, ...(action.payload as [])];
        }

        state.currentSearch = action.meta.arg;
      })
      .addCase(search.rejected, (state) => {
        state.status = "failed";
      });
  },
});

export const search = createAsyncThunk<any, string>(
  "searchResults/fetchSearchResults",
  async (q: string, { getState, dispatch }) => {
    const { setOffset } = searchReducer.actions;
    if (!q) {
      return [];
    }
    const { limit, offset } = (getState() as RootState)
      .search as SearchState;
    dispatch(setOffset());
    const response = await fetchResults({ q, limit, offset });
    return (response as any).data as Result[];
  }
);

export const selectStatus = (state: RootState) => state.search.status;
export const selectLimit = (state: RootState) => state.search.limit;
export const selectSearchResult = (state: RootState) => state.search.data;
export const selectCurrentSearch = (state: RootState) =>
  state.search.currentSearch;
export default searchReducer.reducer;
