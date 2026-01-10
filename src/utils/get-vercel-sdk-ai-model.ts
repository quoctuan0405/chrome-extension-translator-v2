import { createAnthropic } from "@ai-sdk/anthropic";
import { createDeepSeek } from "@ai-sdk/deepseek";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { createOpenAI } from "@ai-sdk/openai";
import { createXai } from "@ai-sdk/xai";
import type { LanguageModel } from "ai";
import { type AIModel, type AIVendor, defaultChatGPTModel } from "./storage";

export type Params = {
  aiVendor: AIVendor;
  aiModel: AIModel;
  apiKey: string;
};

export const getVercelSDKAIModel = ({ aiVendor, aiModel, apiKey }: Params) => {
  let model: LanguageModel;

  switch (aiVendor) {
    case "chatgpt":
      model = createOpenAI({ apiKey })(aiModel);
      break;
    case "claude":
      model = createAnthropic({ apiKey })(aiModel);
      break;
    case "gemini":
      model = createGoogleGenerativeAI({ apiKey })(aiModel);
      break;
    case "deepseek":
      model = createDeepSeek({ apiKey })(aiModel);
      break;
    case "xai":
      model = createXai({ apiKey })(aiModel);
      break;
    default:
      model = createOpenAI({ apiKey })(defaultChatGPTModel);
  }

  return model;
};
