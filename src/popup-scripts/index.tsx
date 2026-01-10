import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App";
import "./index.css";
import { Provider } from "react-redux";
import { getDataFromStorage, listenFromStorage } from "../utils/storage";
import { store } from "./store";
import { setStorageData } from "./store/slices/storage-data-slice";

const root = document.querySelector("div#root");
if (root) {
  createRoot(root).render(
    <StrictMode>
      <Provider store={store}>
        <App />
      </Provider>
    </StrictMode>,
  );
}

listenFromStorage((data) => {
  store.dispatch(setStorageData(data));
});

getDataFromStorage().then((data) => store.dispatch(setStorageData(data)));
