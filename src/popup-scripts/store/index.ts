import { configureStore } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import storageDataReducer, {
  storageDataListener,
} from "./slices/storage-data-slice";

export const store = configureStore({
  reducer: {
    storageData: storageDataReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().prepend(storageDataListener.middleware),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
