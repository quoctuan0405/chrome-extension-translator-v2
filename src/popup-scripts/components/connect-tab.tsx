import { generateText } from "ai";
import {
  AnimatePresence,
  LayoutGroup,
  motion,
  type Variants,
} from "motion/react";
import { useEffect, useRef, useState } from "react";
import { Tag } from "../../components/tag";
import { Textarea } from "../../components/textarea";
import { getVercelSDKAIModel } from "../../utils/get-vercel-sdk-ai-model";
import {
  type AIModel,
  type AIVendor,
  chatgptResponseModels,
  claudeResponseModels,
  defaultChatGPTModel,
  defaultClaudeModel,
  defaultDeepseekModel,
  defaultGeminiModel,
  defaultGrokModel,
  geminiResponseModels,
  grokResponseModels,
  setConnectionDataToStorage,
} from "../../utils/storage";
import { useAppSelector } from "../store";
import { ChatGPTIconButton } from "./chatgpt-icon-button";
import { ClaudeIconButton } from "./claude-icon-button";
import { ConnectButton } from "./connect-button";
import { DeepseekIconButton } from "./deepseek-icon-button";
import { GeminiIconButton } from "./gemini-icon-button";
import { XAiIconButton } from "./xai-icon-button";

type Props = {
  onConnectSuccessfully?: () => void;
};

export const ConnectTab: React.FC<Props> = ({ onConnectSuccessfully }) => {
  const storedAIVendor = useAppSelector((state) => state.storageData.aiVendor);
  const storedAIModel = useAppSelector((state) => state.storageData.modelName);
  const storedAPIKey = useAppSelector((state) => state.storageData.apiKey);

  const [aiVendor, setAIVendor] = useState<AIVendor>(
    storedAIVendor || "chatgpt",
  );
  const [aiModel, setAIModel] = useState<AIModel>(
    storedAIModel || "gpt-4o-mini",
  );
  const [apiKey, setApiKey] = useState<string>(storedAPIKey || "");
  const [isError, setIsError] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSuccessfully, setIsSuccessfully] = useState<boolean>(false);

  const simulateConnectToAISuccessfully = () => {
    setIsLoading(true);
    setIsSuccessfully(false);

    const timeoutId1 = setTimeout(() => {
      setIsLoading(false);
      setIsSuccessfully(true);
    }, 1000);

    const timeoutId2 = setTimeout(() => {
      setIsLoading(false);
      setIsSuccessfully(false);
      onConnectSuccessfully?.();
    }, 2000);

    return () => {
      clearTimeout(timeoutId1);
      clearTimeout(timeoutId2);
    };
  };

  const testConnectToAI = async () => {
    if (!apiKey) {
      return;
    }

    setIsLoading(true);

    const model = getVercelSDKAIModel({ aiVendor, aiModel, apiKey });

    try {
      await generateText({
        model,
        prompt: "what is 1 + 1",
      });

      setIsError(false);
      setIsSuccessfully(true);

      await setConnectionDataToStorage({
        aiVendor,
        apiKey,
        modelName: aiModel,
      });

      // Wait for the pretty animation to complete :)
      setTimeout(() => {
        onConnectSuccessfully?.();
      }, 2000);
    } catch (e) {
      console.log(e);
      setIsError(true);
    }

    setIsLoading(false);
  };

  // Set connection data to local state
  useEffect(() => {
    storedAIVendor && setAIVendor(storedAIVendor);
    storedAIModel && setAIModel(storedAIModel);
    storedAPIKey && setApiKey(storedAPIKey);
  }, [storedAIVendor, storedAIModel, storedAPIKey]);

  // Set default ai model when ai vendor change (https://www.luisgonzalezdev.com/articles/make-react-useeffect-hook-not-run-on-initial-render)
  const isFirstRender = useRef<boolean>(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    switch (aiVendor) {
      case "chatgpt":
        setAIModel(defaultChatGPTModel);
        break;
      case "claude":
        setAIModel(defaultClaudeModel);
        break;
      case "gemini":
        setAIModel(defaultGeminiModel);
        break;
      case "deepseek":
        setAIModel(defaultDeepseekModel);
        break;
      case "xai":
        setAIModel(defaultGrokModel);
        break;
    }
  }, [aiVendor]);

  const tagListVariants: Variants = {
    hidden: {
      opacity: 0,
    },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const tagVariants: Variants = {
    hidden: {
      opacity: 0,
    },
    visible: {
      opacity: 1,
    },
  };

  return (
    <motion.div initial={{ opacity: 0, y: 2 }} animate={{ opacity: 1, y: 0 }}>
      {/* Select AI Vendor (eg: chatgpt, claude, gemini) */}
      <div className="mt-1 flex flex-row m-auto w-max">
        <LayoutGroup>
          <ChatGPTIconButton
            isSelected={aiVendor === "chatgpt"}
            onClick={() => {
              setAIVendor("chatgpt");
            }}
          />
          <ClaudeIconButton
            isSelected={aiVendor === "claude"}
            onClick={() => {
              setAIVendor("claude");
            }}
          />
          <GeminiIconButton
            isSelected={aiVendor === "gemini"}
            onClick={() => {
              setAIVendor("gemini");
            }}
          />
          <DeepseekIconButton
            isSelected={aiVendor === "deepseek"}
            onClick={() => {
              setAIVendor("deepseek");
            }}
          />
          <XAiIconButton
            isSelected={aiVendor === "xai"}
            onClick={() => {
              setAIVendor("xai");
            }}
          />
        </LayoutGroup>
      </div>

      {/* Select AI model (eg: chatgpt-4, chatgpt-5,...) */}
      <div className="mt-2.5">
        <AnimatePresence>
          {/* ChatGPT */}
          {aiVendor === "chatgpt" && (
            <motion.div
              key="chatgpt"
              className="flex flex-row flex-wrap gap-x-1 gap-y-1.5"
              initial="hidden"
              animate="visible"
              variants={tagListVariants}
            >
              {chatgptResponseModels.map((model) => (
                <motion.div key={model} variants={tagVariants}>
                  <Tag
                    key={model}
                    isSelected={aiModel === model}
                    onClick={() => setAIModel(model)}
                  >
                    {model}
                  </Tag>
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* Claude */}
          {aiVendor === "claude" && (
            <motion.div
              key="claude"
              className="flex flex-row flex-wrap gap-x-1 gap-y-1.5"
              initial="hidden"
              animate="visible"
              variants={tagListVariants}
            >
              {claudeResponseModels.map((model) => (
                <motion.div key={model} variants={tagVariants}>
                  <Tag
                    key={model}
                    className="px-2.5"
                    isSelected={aiModel === model}
                    onClick={() => setAIModel(model)}
                  >
                    {model.replace("claude-", "")}
                  </Tag>
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* Gemini */}
          {aiVendor === "gemini" && (
            <motion.div
              key="gemini"
              className="flex flex-row flex-wrap gap-x-1 gap-y-1.5"
              initial="hidden"
              animate="visible"
              variants={tagListVariants}
            >
              {geminiResponseModels.map((model) => (
                <motion.div key={model} variants={tagVariants}>
                  <Tag
                    key={model}
                    className="px-2.5"
                    isSelected={aiModel === model}
                    onClick={() => setAIModel(model)}
                  >
                    {model.replace("gemini-", "")}
                  </Tag>
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* xAI */}
          {aiVendor === "xai" && (
            <motion.div
              key="xai"
              className="flex flex-row flex-wrap gap-x-1 gap-y-1.5"
              initial="hidden"
              animate="visible"
              variants={tagListVariants}
            >
              {grokResponseModels.map((model) => (
                <motion.div key={model} variants={tagVariants}>
                  <Tag
                    key={model}
                    className="px-2.5"
                    isSelected={aiModel === model}
                    onClick={() => setAIModel(model)}
                  >
                    {model}
                  </Tag>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* AI key input */}
      <motion.div layout className="mt-3">
        <Textarea
          className="h-40 resize-y!"
          autoFocus
          placeholder="Paste your AI token here"
          value={apiKey}
          onChange={(e) => setApiKey(e.currentTarget.value)}
        />
      </motion.div>

      {isError && (
        <p className="text-red-500 px-1 mb-1">
          Please check your model and token again!
        </p>
      )}

      {/* Connect button */}
      <motion.div layout className="mt-1.5 mb-1">
        <ConnectButton
          disabled={!apiKey}
          aiVendor={aiVendor}
          isConnecting={isLoading}
          isSuccessfully={isSuccessfully}
          onClick={
            process.env.USE_MOCK
              ? simulateConnectToAISuccessfully
              : testConnectToAI
          }
        />
      </motion.div>
    </motion.div>
  );
};
