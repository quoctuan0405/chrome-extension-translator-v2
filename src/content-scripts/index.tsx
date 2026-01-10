import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App";
import "./index.css";
import { Provider } from "react-redux";
import { getDataFromStorage, listenFromStorage } from "../utils/storage";
import { store } from "./store";
import { addUserMessage } from "./store/slices/chat-slice";
import { setStorageData } from "./store/slices/storage-data-slice";
import {
  setPosition,
  setVisibility,
} from "./store/slices/translation-window-slice";

const root = document.createElement("div");
document.body.appendChild(root);

createRoot(root).render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>,
);

listenFromStorage((storageData) => {
  store.dispatch(setStorageData(storageData));
});

getDataFromStorage().then((data) => store.dispatch(setStorageData(data)));

window.addEventListener("mouseup", async (e) => {
  if (!e.target || !(e.target instanceof Node)) {
    return;
  }

  if (root.contains(e.target)) {
    return;
  }

  const { isOn } = await getDataFromStorage();

  const selectionText = window.getSelection()?.toString();
  if (selectionText && selectionText.trim() !== "" && isOn) {
    store.dispatch(addUserMessage(selectionText.trim()));

    if (!store.getState().translationWindow.isPinned) {
      store.dispatch(
        setPosition({
          left: e.clientX + 10,
          top: e.clientY - 200,
        }),
      );
      store.dispatch(setVisibility(true));
    }
  }

  if (!selectionText && !store.getState().translationWindow.isPinned) {
    store.dispatch(setVisibility(false));
  }
});
