import { z } from "zod";

export const aiVendorSchema = z.literal([
  "chatgpt",
  "claude",
  "gemini",
  "deepseek",
  "xai",
]);

export type AIVendor = z.infer<typeof aiVendorSchema>;

export const chatgptResponseModels = [
  "gpt-5",
  "gpt-5-pro",
  "gpt-5-mini",
  "gpt-5-nano",
  "chatgpt-4o-latest",
  "gpt-4o-mini",
] as const;

export const defaultChatGPTModel = "gpt-4o-mini";

export const chatgptResponseModelSchema = z.enum(chatgptResponseModels);

export type ChatGPTResponseModel = z.infer<typeof chatgptResponseModelSchema>;

export const claudeResponseModels = [
  "claude-sonnet-4-5",
  "claude-opus-4-1",
  "claude-opus-4-0",
  "claude-sonnet-4-0",
  "claude-3-7-sonnet-latest",
  "claude-3-5-haiku-latest",
] as const;

export const defaultClaudeModel = "claude-3-7-sonnet-latest";

export const claudeResponseModelSchema = z.enum(claudeResponseModels);

export type ClaudeResponseModel = z.infer<typeof claudeResponseModelSchema>;

export const geminiResponseModels = [
  "gemini-2.5-pro",
  "gemini-2.5-flash",
  "gemini-2.5-flash-lite",
  "gemini-2.0-flash",
  "gemini-1.5-pro-latest",
  "gemini-1.5-flash-latest",
  "gemini-1.5-flash",
] as const;

export const defaultGeminiModel = "gemini-2.0-flash";

export const geminiResponseModelSchema = z.enum(geminiResponseModels);

export type GeminiResponseModel = z.infer<typeof geminiResponseModelSchema>;

export const deepseekResponseModels = ["deepseek-chat"] as const;

export const defaultDeepseekModel = "deepseek-chat";

export const deepseekResponseModelSchema = z.enum(deepseekResponseModels);

export type DeepseekResponseModel = z.infer<typeof deepseekResponseModelSchema>;

export const grokResponseModels = [
  "grok-4",
  "grok-3",
  "grok-3-fast",
  "grok-3-mini",
] as const;

export const defaultGrokModel = "grok-3-fast";

export const grokResponseModelSchema = z.enum(grokResponseModels);

export type GrokResponseModel = z.infer<typeof grokResponseModelSchema>;

export type AIModel =
  | ChatGPTResponseModel
  | ClaudeResponseModel
  | GeminiResponseModel
  | DeepseekResponseModel
  | GrokResponseModel;

export const defaultSystemPrompt = `You are a korean learning assistant.

If the user provide you a sentence like this: "불이 시작된 10층은 바닥과 천장, 벽면까지 분진이 가득했고 벽면 타일이 전부 뜯겨 나간 상태였다.", translate and break it down like this:

### **Translation:**

On the 10th floor where the fire started, the floor, ceiling, and walls were filled with dust, and the wall tiles were completely ripped off.

---

### **Breakdown:**

1. **불이 시작된** – "where the fire started"

   * **불** – "fire"
   * **이** – subject particle indicating that "fire" is the subject.
   * **시작된** – "started" (the past participle form of the verb **시작하다**, meaning "to start").

2. **10층은** – "the 10th floor"

   * **10층** – "10th floor"
   * **은** – topic particle indicating that "the 10th floor" is the topic of the sentence.

3. **바닥과 천장, 벽면까지** – "the floor, ceiling, and even the walls"

   * **바닥** – "floor"
   * **과** – "and" (used with nouns).
   * **천장** – "ceiling"
   * **벽면까지** – "up to the walls" (where **벽면** means "walls" and **까지** means "up to" or "even").

4. **분진이 가득했고** – "were filled with dust"

   * **분진** – "dust"
   * **이** – subject particle for "dust."
   * **가득했고** – "were filled" (the past tense form of **가득하다**, meaning "to be filled").

5. **벽면 타일이** – "the wall tiles"

   * **벽면** – "walls" (referring to the wall surfaces).
   * **타일이** – "tiles" (subject particle indicating that "wall tiles" is the subject of the next clause).

6. **전부** – "completely" or "entirely"

   * This adverb emphasizes that all tiles were affected.

7. **뜯겨 나간 상태였다** – "were completely ripped off"

   * **뜯겨 나간** – "ripped off" (the past participle form of the verb **뜯겨 나가다**, meaning "to be ripped off").
   * **상태였다** – "was in a state of" (indicating the condition or state of something).

If the user give you a word, break down that word and give some examples.
`;

export const defaultIsOn = false;
export const defaultIsDarkmode = false;
export const defaultIsShowContext = false;
export const defaultIsForgetfulMode = false;
export const defaultIsShowTokenUsage = false;
export const defaultTokenCapLimitAmount = undefined;
export const defaultTokenUsage = 0;

const connectionDataSchema = z.looseObject({
  apiKey: z.nullish(z.string()),
  aiVendor: z.nullish(aiVendorSchema),
  modelName: z.nullish(
    z.enum([
      ...chatgptResponseModels,
      ...claudeResponseModels,
      ...geminiResponseModels,
      ...deepseekResponseModels,
      ...grokResponseModels,
    ]),
  ),
});

export type ConnectionData = z.infer<typeof connectionDataSchema>;

const settingsDataSchema = z.looseObject({
  isOn: z.nullish(z.boolean()),
  isDarkmode: z.nullish(z.boolean()),
  systemPrompt: z.nullish(z.string()),
  isShowContext: z.nullish(z.boolean()),
  isForgetfulMode: z.nullish(z.boolean()),
  isShowTokenUsage: z.nullish(z.boolean()),
  tokenCapLimitAmount: z.nullish(z.number()),
  tokenUsage: z.nullish(z.number()),
});

const storageDataSchema = connectionDataSchema.extend(settingsDataSchema.shape);

export type StorageData = {
  apiKey?: string;
  aiVendor?: AIVendor;
  modelName?: AIModel;
  isOn: boolean;
  isDarkmode: boolean;
  systemPrompt: string;
  isShowContext: boolean;
  isForgetfulMode: boolean;
  isShowTokenUsage: boolean;
  tokenCapLimitAmount?: number;
  tokenUsage: number;
};

export type Listener = (data: StorageData) => void;

export const getDataFromStorage = async () => {
  const data = await chrome.storage.sync.get();
  const safeData = storageDataSchema.parse(data);

  safeData.isOn ??= defaultIsOn;
  safeData.systemPrompt ??= defaultSystemPrompt;
  safeData.isDarkmode ??= defaultIsDarkmode;
  safeData.isShowContext ??= defaultIsShowContext;
  safeData.isForgetfulMode ??= defaultIsForgetfulMode;
  safeData.isShowTokenUsage ??= defaultIsShowTokenUsage;
  safeData.tokenCapLimitAmount ??= defaultTokenCapLimitAmount;
  safeData.tokenUsage ??= defaultTokenUsage;

  return safeData as StorageData;
};

export const listenFromStorage = (listener: Listener) => {
  chrome.storage.sync.onChanged.addListener(async () => {
    const data = await getDataFromStorage();

    listener(data);
  });
};

export const setConnectionDataToStorage = async (data: ConnectionData) => {
  await chrome.storage.sync.set(data);
};

export const setIsOnToStorage = async (isOn: boolean) => {
  await chrome.storage.sync.set({ isOn });
};

export const toggleIsOnToStorage = async () => {
  const { isOn = false } = await chrome.storage.sync.get("isOn");
  await chrome.storage.sync.set({ isOn: !isOn });
};

export const setSystemPromptToStorage = async (systemPrompt: string) => {
  await chrome.storage.sync.set({ systemPrompt });
};

export const toggleDarkmodeToStorage = async () => {
  const { isDarkmode } = await getDataFromStorage();

  await chrome.storage.sync.set({ isDarkmode: !isDarkmode });
};

export const setIsShowContextToStorage = async (isShowContext: boolean) => {
  await chrome.storage.sync.set({ isShowContext });
};

export const setIsForgetfulModeToStorage = async (isForgetfulMode: boolean) => {
  await chrome.storage.sync.set({ isForgetfulMode });
};

export const setIsShowTokenUsageToStorage = async (
  isShowTokenUsage: boolean,
) => {
  await chrome.storage.sync.set({ isShowTokenUsage });
};

export const setTokenCapLimitAmountToStorage = async (
  tokenCapLimitAmount?: number,
) => {
  if (tokenCapLimitAmount === undefined) {
    await chrome.storage.sync.remove("tokenCapLimitAmount");
  } else {
    await chrome.storage.sync.set({ tokenCapLimitAmount });
  }
};

export const addTokenUsageToStorage = async (tokenUsage: number) => {
  const { tokenUsage: oldTokenUsage } = await getDataFromStorage();

  await chrome.storage.sync.set({ tokenUsage: oldTokenUsage + tokenUsage });
};

export const clearTokenUsageToStorage = async () => {
  await chrome.storage.sync.set({ tokenUsage: 0 });
};

export const clearStorage = async () => {
  await chrome.storage.sync.clear();
};
