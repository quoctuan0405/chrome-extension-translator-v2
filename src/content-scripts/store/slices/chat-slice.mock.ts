import type { LanguageModelUsage, ModelMessage } from "ai";

export type MockStreamTextParams = {
  [key: string]: any;
  abortSignal: AbortSignal;
  messages: ModelMessage[];
};

export const mockStreamText = ({ abortSignal }: MockStreamTextParams) => {
  const aiTexts = [
    "### Stream ",
    "of ",
    "AI ",
    "text ",
    "coming ",
    "at ",
    "you ",
    "at ",
    "_supersonic ",
    "speed!_ \n\n",
    "This is a link: http://localhost:3000 \n",
    "### **Breakdown:**\n\n",
    `1. **A 씨는** – "Person A" (씨 is an honorific used for people, similar to "Mr." or "Ms.").\n`,
    `\t* This introduces the subject, Person A.\n\n`,
    `2. **“고소공포증이 있어** – "I have acrophobia (fear of heights)"\n`,
    `\t* **고소공포증** means "fear of heights."\n`,
    `\t* **있어** means "I have" (literally "exists").\n\n`,
    `3. **3시간 동안 옥상에서 구조를 기다리면서`,
    `** – "while waiting for 3 hours on the rooftop for rescue"\n\n`,
    `\t* **3시간 동안** – "for 3 hours"\n`,
    `\t* **옥상에서** – "on the rooftop"\n`,
    `\t* **구조를 기다리면서** – "waiting for rescue"\n`,
    `\t\t* **구조** – "rescue""\n`,
    `\t\t* **기다리면서** – "while waiting"`,
  ];

  async function* textStream() {
    for (const text of aiTexts) {
      if (abortSignal.aborted) break;

      yield text;

      await new Promise<void>((resolve) => {
        setTimeout(() => {
          resolve();
        }, 100);
      });
    }
  }

  const usage: Promise<LanguageModelUsage> = new Promise((resolve) =>
    resolve({
      inputTokens: undefined,
      outputTokens: undefined,
      totalTokens: 10000,
      cachedInputTokens: undefined,
      reasoningTokens: undefined,
    }),
  );

  return { textStream: textStream(), usage } as const;
};

export type MockGenerateTextParams = {
  [key: string]: any;
  abortSignal: AbortSignal;
  messages: ModelMessage[];
};

export type MockGenerateTextResult = {
  text: string;
};

export const mockGenerateText = ({
  abortSignal,
}: MockGenerateTextParams): Promise<MockGenerateTextResult> => {
  return new Promise((resolve, reject) => {
    const timeoutId = setTimeout(() => {
      resolve({ text: "Summarize AI message" });

      abortSignal.addEventListener("abort", () => {
        clearTimeout(timeoutId);
        reject();
      });
    }, 1000);
  });
};
