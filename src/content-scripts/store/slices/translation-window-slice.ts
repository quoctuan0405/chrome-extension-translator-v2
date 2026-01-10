import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";

export type PositionPayload = {
  left: number;
  top: number;
};

export type TranslationWindowState = {
  isVisible: boolean;
  isPinned: boolean;
  left: number;
  top: number;
};

const initialState: TranslationWindowState = {
  isVisible: false,
  isPinned: false,
  left: 0,
  top: 0,
};

export const translationWindowSlice = createSlice({
  name: "translation-window",
  initialState,
  reducers: {
    setVisibility: (state, action: PayloadAction<boolean>) => {
      state.isVisible = action.payload;
      state.isPinned = false;
    },
    togglePin: (state) => {
      state.isPinned = !state.isPinned;
    },
    setPosition: (state, action: PayloadAction<PositionPayload>) => {
      state.left = action.payload.left;
      state.top = action.payload.top;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setVisibility, setPosition, togglePin } =
  translationWindowSlice.actions;

export default translationWindowSlice.reducer;
