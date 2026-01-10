import type { PayloadAction } from "@reduxjs/toolkit";
import { createListenerMiddleware, createSlice } from "@reduxjs/toolkit";
import {
  defaultIsDarkmode,
  defaultIsForgetfulMode,
  defaultIsOn,
  defaultIsShowContext,
  defaultIsShowTokenUsage,
  defaultSystemPrompt,
  defaultTokenCapLimitAmount,
  defaultTokenUsage,
  type StorageData,
} from "../../../utils/storage";

const initialState: StorageData = {
  apiKey: undefined,
  aiVendor: undefined,
  modelName: undefined,
  isOn: defaultIsOn,
  systemPrompt: defaultSystemPrompt,
  isDarkmode: defaultIsDarkmode,
  isShowContext: defaultIsShowContext,
  isForgetfulMode: defaultIsForgetfulMode,
  isShowTokenUsage: defaultIsShowTokenUsage,
  tokenCapLimitAmount: defaultTokenCapLimitAmount,
  tokenUsage: defaultTokenUsage,
};

export const storageDataSlice = createSlice({
  name: "storage",
  initialState,
  reducers: {
    setStorageData: (state, action: PayloadAction<StorageData>) => {
      state.apiKey = action.payload.apiKey;
      state.aiVendor = action.payload.aiVendor;
      state.modelName = action.payload.modelName;
      state.isOn = action.payload.isOn;
      state.systemPrompt = action.payload.systemPrompt;
      state.isDarkmode = action.payload.isDarkmode;
      state.isShowContext = action.payload.isShowContext;
      state.isForgetfulMode = action.payload.isForgetfulMode;
      state.isShowTokenUsage = action.payload.isShowTokenUsage;
      state.tokenCapLimitAmount = action.payload.tokenCapLimitAmount;
      state.tokenUsage = action.payload.tokenUsage;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setStorageData } = storageDataSlice.actions;

export default storageDataSlice.reducer;

export const storageDataListener = createListenerMiddleware();

storageDataListener.startListening({
  actionCreator: setStorageData,
  effect: async (action) => {
    if (action.payload.isDarkmode) {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  },
});
