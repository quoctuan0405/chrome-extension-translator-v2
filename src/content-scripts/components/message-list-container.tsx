import type { ModelMessage } from "ai";
import React, {
  useCallback,
  useEffect,
  useEffectEvent,
  useImperativeHandle,
  useRef,
} from "react";
import { AIMessage } from "./ai-message";
import { UserMessage } from "./user-message";

export type MessageListContainerHandler = {
  scrollToBottom: () => void;
};

type Props = {
  ref?: React.Ref<MessageListContainerHandler>;
  messages?: ModelMessage[];
};

export const MessageListContainerHandler: React.FC<Props> = ({
  ref,
  messages = [],
}) => {
  // Scroll to bottom
  const containerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    const container = containerRef.current;
    if (container) {
      container.scrollTo({
        top: container.scrollHeight,
        behavior: "smooth",
      });
    }
  };

  useImperativeHandle(ref, () => ({
    scrollToBottom,
  }));

  // Make container scroll if necessary
  const makeMessagesScrollIfNecessary = useEffectEvent(() => {
    const container = containerRef.current;
    if (container) {
      // Vertical scroll if necessary
      if (container.scrollHeight > container.clientHeight) {
        container.style.overflowY = "scroll";
      } else {
        container.style.overflowY = "hidden";
      }

      // Horizontal scroll if necessary
      if (container.scrollWidth > container.clientWidth) {
        container.style.overflowX = "scroll";
      } else {
        container.style.overflowX = "hidden";
      }
    }
  });

  // Messages section inset shadow if needed
  const makeInsetShadowIfNeccessary = useCallback(() => {
    const container = containerRef.current;
    if (container) {
      // Shadow inset at the top
      if (container.scrollTop > 0) {
        container.style.boxShadow = `inset 0 10px 10px -10px rgba(0, 0, 0, 0.1)`;
      } else {
        container.style.boxShadow = "";
      }

      // "Modern" (ChatGPT told me so) gradually transparent at the bottom
      const tolerance = 5;

      if (
        container.scrollTop + container.clientHeight <
        container.scrollHeight - tolerance
      ) {
        container.style.maskImage = `linear-gradient(to bottom, black 90%, transparent)`;
      } else {
        container.style.maskImage = "";
      }
    }
  }, []);

  // biome-ignore lint/correctness/useExhaustiveDependencies: messagesSection overflow or not dependes on changes in messages
  useEffect(() => {
    makeMessagesScrollIfNecessary();
    makeInsetShadowIfNeccessary();
  }, [messages]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      makeInsetShadowIfNeccessary();
      clearTimeout(timeoutId);
    }, 100);
  }, [makeInsetShadowIfNeccessary]);

  return (
    <div
      ref={containerRef}
      className="size-full"
      onScroll={makeInsetShadowIfNeccessary}
    >
      <div className="flex flex-col flex-wrap gap-2 px-3 py-2">
        {messages.map((message, i) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: it's ok to use index as key here
          <React.Fragment key={i}>
            {message.role === "user" && (
              <UserMessage>
                {typeof message.content === "string" ? message.content : ""}
              </UserMessage>
            )}

            {message.role === "assistant" && (
              <AIMessage>
                {typeof message.content === "string" ? message.content : ""}
              </AIMessage>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};
