import type { PayloadAction } from "@reduxjs/toolkit";
import { createListenerMiddleware, createSlice } from "@reduxjs/toolkit";
import { setStorageData } from "./storage-data-slice";

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
      if (!action.payload) {
        state.isPinned = false;
      }
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

// Listener
export const translationWindowListener = createListenerMiddleware();

translationWindowListener.startListening({
  actionCreator: setStorageData,
  effect: async (action, listenerApi) => {
    listenerApi.cancelActiveListeners();

    if (action.payload.isOn) {
      listenerApi.dispatch(
        setPosition({
          left: window.innerWidth / 2 + 100,
          top: window.innerHeight / 2 - 250,
        }),
      );
      listenerApi.dispatch(setVisibility(action.payload.isOn));
    }
  },
});
