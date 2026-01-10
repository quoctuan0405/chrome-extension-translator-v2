import type { PayloadAction } from "@reduxjs/toolkit";
import {
  createListenerMiddleware,
  createSlice,
  isAnyOf,
} from "@reduxjs/toolkit";
import {
  type AssistantModelMessage,
  generateText,
  type ModelMessage,
  streamText,
  type UserModelMessage,
} from "ai";
import { nanoid } from "nanoid";
import { getVercelSDKAIModel } from "../../../utils/get-vercel-sdk-ai-model";
import { addTokenUsageToStorage } from "../../../utils/storage";
import type { RootState } from "..";
import { mockGenerateText, mockStreamText } from "./chat-slice.mock";
import { setStorageData } from "./storage-data-slice";

export type EditMessageContentPayload = {
  messageId: string;
  content: string;
};

export type ExtendedModelMessage = ModelMessage & {
  id: string;
  isHidden?: boolean;
};

export type ChatState = {
  isLoading: boolean;
  _temporaryUserMessage?: UserModelMessage;
  _temporaryAIMessage?: AssistantModelMessage;
  messages: ModelMessage[];
  shortenMessages: ExtendedModelMessage[];
};

const initialState: ChatState = {
  isLoading: false,
  messages: [],
  shortenMessages: [],
};

export const storageDataSlice = createSlice({
  name: "storage",
  initialState,
  reducers: {
    addUserMessage: (state, action: PayloadAction<string>) => {
      state._temporaryUserMessage = { role: "user", content: action.payload };
    },
    abortStreaming: () => {},
    deleteMessageInContext: (state, action: PayloadAction<string>) => {
      state.shortenMessages = state.shortenMessages.filter(
        ({ id }) => action.payload !== id,
      );
    },
    toggleMessageInContextHidden: (state, action: PayloadAction<string>) => {
      const message = state.shortenMessages.find(
        ({ id }) => action.payload === id,
      );
      if (message) {
        message.isHidden = !message.isHidden;
      }
    },
    setContentOfMessageInContext: (
      state,
      action: PayloadAction<EditMessageContentPayload>,
    ) => {
      const message = state.shortenMessages.find(
        ({ id }) => action.payload.messageId === id,
      );
      if (message) {
        message.content = action.payload.content;
      }
    },
    resetChat: (state) => {
      state.isLoading = false;
      state.messages = [];
      state.shortenMessages = [];
      state._temporaryAIMessage = undefined;
      state._temporaryUserMessage = undefined;
    },
    _setAllMessagesInContextVisibility: (
      state,
      action: PayloadAction<boolean>,
    ) => {
      for (const message of state.shortenMessages) {
        message.isHidden = action.payload;
      }
    },
    _setIsLoading: (store, action: PayloadAction<boolean>) => {
      store.isLoading = action.payload;
    },
    _resetTemporaryAIMessage: (state) => {
      state._temporaryAIMessage = undefined;
    },
    _resetTemporaryMessages: (state) => {
      state._temporaryUserMessage = undefined;
      state._temporaryAIMessage = undefined;
    },
    _addAIMessageTextPart: (state, action: PayloadAction<string>) => {
      if (state._temporaryAIMessage) {
        state._temporaryAIMessage.content += action.payload;
      } else {
        state._temporaryAIMessage = {
          role: "assistant",
          content: action.payload,
        };
      }
    },
    _addPairMessages: (state) => {
      const userMessageContent = state._temporaryUserMessage;
      const aiMessageContent = state._temporaryAIMessage;

      if (userMessageContent && aiMessageContent) {
        state.messages.push(userMessageContent, aiMessageContent);
        state.shortenMessages.push(
          { id: nanoid(), ...userMessageContent },
          { id: nanoid(), ...aiMessageContent },
        );
      }
    },
    _addSummarizeMessage: (state, action: PayloadAction<string>) => {
      const lastSixMessages = state.shortenMessages.slice(-6);
      state.shortenMessages = [
        { id: nanoid(), role: "system", content: action.payload },
        ...lastSixMessages,
      ];
    },
  },
});

// Selectors
export const selectMessages = (state: RootState) => {
  const messages = [...state.chat.messages];

  if (state.chat._temporaryUserMessage) {
    messages.push(state.chat._temporaryUserMessage);
  }

  if (state.chat._temporaryAIMessage) {
    messages.push(state.chat._temporaryAIMessage);
  }

  return messages;
};

export const selectDevMessages = (state: RootState): ExtendedModelMessage[] => {
  return [
    // Root system prompt need no id
    { id: "", role: "system", content: state.storageData.systemPrompt },
    ...state.chat.shortenMessages,
  ];
};

// Action creators are generated for each case reducer function
export const {
  addUserMessage,
  abortStreaming,
  deleteMessageInContext,
  toggleMessageInContextHidden,
  setContentOfMessageInContext,
  resetChat,
} = storageDataSlice.actions;

const {
  _setIsLoading,
  _resetTemporaryMessages,
  _resetTemporaryAIMessage,
  _addAIMessageTextPart,
  _addPairMessages,
  _addSummarizeMessage,
  _setAllMessagesInContextVisibility,
} = storageDataSlice.actions;

export const chatListener = createListenerMiddleware();

// Set all messages in shortenMessages to hidden when in forgetful mode (and reset back when not in forgetful mode)
chatListener.startListening({
  actionCreator: setStorageData,
  effect: async (action, listenerApi) => {
    listenerApi.cancelActiveListeners();

    listenerApi.dispatch(
      _setAllMessagesInContextVisibility(action.payload.isForgetfulMode),
    );
  },
});

// Send message to AI
chatListener.startListening({
  matcher: isAnyOf(addUserMessage, abortStreaming),
  effect: async (action, listenerApi) => {
    listenerApi.cancelActiveListeners();

    if (action.type === abortStreaming.type) {
      listenerApi.dispatch(_resetTemporaryMessages());
      listenerApi.dispatch(_setIsLoading(false));
      return;
    }

    listenerApi.dispatch(_setIsLoading(true));

    const task = listenerApi.fork(async (taskApi) => {
      const state = listenerApi.getState() as RootState;
      if (!state.chat._temporaryUserMessage) {
        task.cancel();
        return;
      }

      const messages: ModelMessage[] = [
        { role: "system", content: state.storageData.systemPrompt },
        ...state.chat.shortenMessages.filter(({ isHidden }) => !isHidden), // Filter out messages that is marked as "hidden"
        state.chat._temporaryUserMessage,
      ];

      if (
        !state.storageData.aiVendor ||
        !state.storageData.modelName ||
        !state.storageData.apiKey
      ) {
        task.cancel();
        return;
      }

      const model = getVercelSDKAIModel({
        aiVendor: state.storageData.aiVendor,
        aiModel: state.storageData.modelName,
        apiKey: state.storageData.apiKey,
      });

      const { textStream, usage } = process.env.USE_MOCK
        ? mockStreamText({
            model,
            messages,
            abortSignal: taskApi.signal,
          })
        : streamText({
            model,
            messages,
            abortSignal: taskApi.signal,
          });

      for await (const textPart of textStream) {
        listenerApi.dispatch(_addAIMessageTextPart(textPart));
      }

      return await usage;
    });

    listenerApi.signal.addEventListener("abort", () => {
      listenerApi.dispatch(_resetTemporaryAIMessage());
      listenerApi.dispatch(_setIsLoading(false));
    });

    const result = await task.result;

    if (result.status === "ok") {
      if (result.value?.totalTokens) {
        addTokenUsageToStorage(result.value.totalTokens);
      }

      listenerApi.dispatch(_addPairMessages());
      listenerApi.dispatch(_resetTemporaryMessages());
      listenerApi.dispatch(_setIsLoading(false));
    }
  },
});

// Summarize messages
chatListener.startListening({
  actionCreator: _addPairMessages,
  effect: async (_action, listenerApi) => {
    const state = listenerApi.getState() as RootState;

    // Do not summarize if it's forgetful mode to save on tokens
    if (state.storageData.isForgetfulMode) {
      return;
    }

    // Do not summarize when there's less than 12 messages
    if (state.chat.shortenMessages.length <= 12) {
      return;
    }

    listenerApi.cancelActiveListeners();

    // Summarize the all messages excluding the 6 latest one
    const task = listenerApi.fork(async (taskApi) => {
      const allPreviousMessagesExcludeLastSixMessages =
        state.chat.messages.slice(0, -6);
      const messages: ModelMessage[] = [
        { role: "system", content: "Summarize the following conversation" },
        ...allPreviousMessagesExcludeLastSixMessages,
      ];

      if (
        !state.storageData.aiVendor ||
        !state.storageData.modelName ||
        !state.storageData.apiKey
      ) {
        task.cancel();
        return;
      }

      const model = getVercelSDKAIModel({
        aiVendor: state.storageData.aiVendor,
        aiModel: state.storageData.modelName,
        apiKey: state.storageData.apiKey,
      });

      const { text } = process.env.USE_MOCK
        ? await mockGenerateText({
            model,
            messages,
            abortSignal: taskApi.signal,
          })
        : await generateText({
            model,
            messages,
            abortSignal: taskApi.signal,
          });

      return text;
    });

    listenerApi.signal.addEventListener("abort", () => {
      task.cancel();
    });

    const result = await task.result;

    if (result.status === "ok" && result.value) {
      listenerApi.dispatch(_addSummarizeMessage(result.value));
    }
  },
});

export default storageDataSlice.reducer;
