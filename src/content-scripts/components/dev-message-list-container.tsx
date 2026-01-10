import type { MDXEditorProps } from "@mdxeditor/editor";
import type { AssistantContent, UserContent } from "ai";
import { Eye, Trash2 } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import type React from "react";
import {
  useCallback,
  useEffect,
  useEffectEvent,
  useMemo,
  useRef,
  useState,
} from "react";
import { Button } from "../../components/button";
import {
  ContextMenu,
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuTrigger,
} from "../../components/context-menu";
import { CustomMDXEditor } from "../../components/custom-mdx-editor";
import { IconButton } from "../../components/icon-button";
import { cn } from "../../utils/cn";
import { setSystemPromptToStorage } from "../../utils/storage";
import { usePrevious } from "../../utils/use-previous";
import { useAppDispatch, useAppSelector } from "../store";
import {
  deleteMessageInContext,
  selectDevMessages,
  setContentOfMessageInContext,
  toggleMessageInContextHidden,
} from "../store/slices/chat-slice";

export const DevMessageListContainer: React.FC = () => {
  const dispatch = useAppDispatch();

  const devMessages = useAppSelector(selectDevMessages);

  const containerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useEffectEvent(() => {
    const container = containerRef.current;
    if (container) {
      container.scrollTo({
        top: container.scrollHeight,
        behavior: "smooth",
      });
    }
  });

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

  // Scrolling to the bottom if necessary
  const devMessagesLength = useMemo(() => devMessages.length, [devMessages]);
  const previousDevMessagesLength = usePrevious(devMessagesLength);

  useEffect(() => {
    if (devMessagesLength !== previousDevMessagesLength) {
      makeMessagesScrollIfNecessary();
      makeInsetShadowIfNeccessary();
      scrollToBottom();
    }
  }, [
    devMessagesLength,
    previousDevMessagesLength,
    makeInsetShadowIfNeccessary,
  ]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      makeInsetShadowIfNeccessary();
      makeMessagesScrollIfNecessary();
      clearTimeout(timeoutId);
    }, 100);
  }, [makeInsetShadowIfNeccessary]);

  return (
    <div
      ref={containerRef}
      className="size-full"
      onScroll={makeInsetShadowIfNeccessary}
    >
      <div className="flex flex-col flex-wrap px-2 py-3">
        <AnimatePresence>
          {devMessages.map((devMessage) => (
            <motion.div
              key={devMessage.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 1 }}
              exit={{ opacity: 0, y: -10 }}
            >
              {devMessage.role === "system" && (
                <div>
                  <p className="-mb-3 text-xs text-neutral-400 dark:text-neutral-600">
                    System prompt
                  </p>
                  <EditableMessage
                    initialValue={devMessage.content}
                    onChange={(markdown) => setSystemPromptToStorage(markdown)}
                    isNotShowContextMenu
                  />
                </div>
              )}

              {devMessage.role === "user" && (
                <div className="-mb-2 duration-200 ease-in-out">
                  <EditableMessage
                    className={
                      "ml-auto bg-neutral-100 rounded-xl pb-1.5! pt-0.5!"
                    }
                    initialValue={devMessage.content}
                    isMessageHidden={devMessage.isHidden}
                    onChange={(markdown) =>
                      dispatch(
                        setContentOfMessageInContext({
                          messageId: devMessage.id,
                          content: markdown,
                        }),
                      )
                    }
                    onHideMessage={() =>
                      dispatch(toggleMessageInContextHidden(devMessage.id))
                    }
                  />

                  <MessageAction messageId={devMessage.id} side="right" />
                </div>
              )}

              {devMessage.role === "assistant" && (
                <div className="-mb-2 duration-200 ease-in-out">
                  <EditableMessage
                    initialValue={devMessage.content}
                    isMessageHidden={devMessage.isHidden}
                    onChange={(markdown) =>
                      dispatch(
                        setContentOfMessageInContext({
                          messageId: devMessage.id,
                          content: markdown,
                        }),
                      )
                    }
                    onHideMessage={() =>
                      dispatch(toggleMessageInContextHidden(devMessage.id))
                    }
                  />

                  <MessageAction
                    messageId={devMessage.id}
                    side="left"
                    className="ml-2 -mt-[18px] mb-[18px]"
                  />
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

type EditableMessageProps = {
  className?: string;
  initialValue?: UserContent | AssistantContent;
  onChange?: MDXEditorProps["onChange"];
  isNotShowContextMenu?: boolean;
  isMessageHidden?: boolean;
  onHideMessage?: (isHidden: boolean) => void;
};

const EditableMessage: React.FC<EditableMessageProps> = ({
  className,
  initialValue,
  isMessageHidden,
  isNotShowContextMenu,
  onChange,
  onHideMessage,
}) => {
  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 1 }}
        >
          <CustomMDXEditor
            className={cn(
              "[&_ol]:ml-3! [&_ul]:ml-3! px-3 rounded-xl max-w-full",
              {
                "opacity-30": isMessageHidden,
              },
              className,
            )}
            initialValue={
              typeof initialValue === "string" ? initialValue : undefined
            }
            onChange={onChange}
          />
        </motion.div>
      </ContextMenuTrigger>

      <ContextMenuContent
        className="z-99999999 w-52"
        hidden={isNotShowContextMenu}
      >
        <ContextMenuCheckboxItem
          checked={isMessageHidden}
          onCheckedChange={onHideMessage}
        >
          Hide this message
        </ContextMenuCheckboxItem>
      </ContextMenuContent>
    </ContextMenu>
  );
};

type Side = "left" | "right";

type MessageActionProps = {
  messageId?: string;
  side: Side;
  className?: string;
};

const MessageAction: React.FC<MessageActionProps> = ({
  messageId,
  side,
  className,
}) => {
  const dispatch = useAppDispatch();

  const [isShowDeleteMessageButton, setIsShowDeleteMessageButton] =
    useState<boolean>(false);

  const handleClickDeleteMessage = () => {
    setTimeout(() => {
      messageId && dispatch(deleteMessageInContext(messageId));
    }, 500);
  };

  // Detect click outside delete message button
  const deleteMessageSectionRef = useRef<HTMLDivElement>(null);

  const closeDeleteMessageButtonWhenClickOutside = useCallback(
    (e: PointerEvent) => {
      if (!e.target || !(e.target instanceof Node)) {
        setIsShowDeleteMessageButton(false);
        return;
      }

      if (!deleteMessageSectionRef.current?.contains(e.target)) {
        setIsShowDeleteMessageButton(false);
      }
    },
    [],
  );

  useEffect(() => {
    if (isShowDeleteMessageButton) {
      window.addEventListener(
        "click",
        closeDeleteMessageButtonWhenClickOutside,
      );

      return () =>
        window.removeEventListener(
          "click",
          closeDeleteMessageButtonWhenClickOutside,
        );
    }
  }, [isShowDeleteMessageButton, closeDeleteMessageButtonWhenClickOutside]);

  return (
    <div
      className={cn(
        "flex flex-row flex-wrap w-max",
        { "ml-auto": side === "right" },
        className,
      )}
    >
      <div ref={deleteMessageSectionRef} className="relative mt-1">
        <IconButton
          tooltip="Delete this message"
          side="bottom"
          contentClassName="p-1.5"
          onClick={() => setIsShowDeleteMessageButton((prev) => !prev)}
        >
          <Trash2
            size={18}
            className="stroke-neutral-500/80 group-hover:scale-110 group-active:scale-100 duration-200 ease-in-out"
          />
        </IconButton>

        <AnimatePresence>
          {isShowDeleteMessageButton && (
            <motion.div
              className={cn("absolute -top-11", {
                "-right-[110px]": side === "left",
                "-left-[85px]": side === "right",
              })}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 5 }}
              transition={{ duration: 0.1 }}
            >
              <Button onClick={handleClickDeleteMessage}>
                <p className="w-max rounded-lg bg-white py-2 px-5 text-red-500">
                  Delete message
                </p>
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <IconButton
        tooltip="Send / not send this message to LLM"
        side="bottom"
        className="-mt-1"
        contentClassName="p-1.5"
        onClick={() =>
          messageId && dispatch(toggleMessageInContextHidden(messageId))
        }
      >
        <Eye
          size={20}
          className="stroke-neutral-500/80 group-hover:scale-110 group-active:scale-100 duration-200 ease-in-out"
        />
      </IconButton>
    </div>
  );
};
