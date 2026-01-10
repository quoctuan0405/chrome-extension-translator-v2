import { configureStore } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import chatReducer, { chatListener } from "./slices/chat-slice";
import storageDataReducer from "./slices/storage-data-slice";
import translationWindowReducer from "./slices/translation-window-slice";

export const store = configureStore({
  reducer: {
    storageData: storageDataReducer,
    chat: chatReducer,
    translationWindow: translationWindowReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().prepend(chatListener.middleware),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
