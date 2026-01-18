import { PinIcon, XIcon } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { IconButton } from "../../components/icon-button";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "../../components/resizable";
import { type DeltaDimension, Textarea } from "../../components/textarea";
import {
  setIsForgetfulModeToStorage,
  setIsShowContextToStorage,
  setIsShowTokenUsageToStorage,
} from "../../utils/storage";
import { useAppDispatch, useAppSelector } from "../store";
import {
  abortStreaming,
  addUserMessage,
  selectMessages,
} from "../store/slices/chat-slice";
import { DevMessageListContainer } from "./dev-message-list-container";
import { MessageListContainerHandler } from "./message-list-container";
import { SendIconButton } from "./send-icon-button";
import "@mdxeditor/editor/style.css";
import {
  ContextMenu,
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuTrigger,
} from "../../components/context-menu";
import { cn } from "../../utils/cn";
import {
  setVisibility,
  togglePin,
} from "../store/slices/translation-window-slice";
import { ClearConversationButton } from "./clear-conversation-button";
import { TokenUsageProgress } from "./token-usage-progress";

export type Props = {
  onPointerDown?: React.PointerEventHandler<HTMLDivElement>;
  onResizeTextarea?: (delta: DeltaDimension) => void;
};

export const TranslationWindow: React.FC<Props> = ({
  onPointerDown,
  onResizeTextarea,
}) => {
  const dispatch = useAppDispatch();

  const isShowTokenUsage = useAppSelector(
    (state) => state.storageData.isShowTokenUsage,
  );
  const isShowContext = useAppSelector(
    (state) => state.storageData.isShowContext,
  );
  const isForgetfulMode = useAppSelector(
    (state) => state.storageData.isForgetfulMode,
  );

  const isPinned = useAppSelector((state) => state.translationWindow.isPinned);

  const isLoading = useAppSelector((state) => state.chat.isLoading);
  const messages = useAppSelector(selectMessages);

  // Message
  const messageSectionRef = useRef<MessageListContainerHandler>(null);

  const [message, setMessage] = useState<string>("");

  // Scroll to the bottom of messages section when messages length change
  const messagesLength = useMemo(() => messages.length, [messages]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: only scroll when message's length has changed
  useEffect(() => {
    messageSectionRef.current?.scrollToBottom();
  }, [messagesLength]);

  // Handle submit user message
  const handleSubmit = () => {
    dispatch(addUserMessage(message.trim()));
    setMessage("");
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <ContextMenu>
        <ContextMenuTrigger asChild>
          <div
            className="flex flex-wrap items-center border-b-2 border-b-neutral-100 w-full cursor-grab"
            onPointerDown={onPointerDown}
          >
            {isShowTokenUsage && <TokenUsageProgress />}

            <div className="flex-1" />
            <ClearConversationButton className="-mr-1! -my-1" />
            <IconButton
              className="-mr-2! -ml-1.5!"
              tooltip="Pin"
              onClick={() => {
                dispatch(togglePin());
              }}
            >
              <PinIcon
                className={cn(
                  "size-5.5 group-hover:scale-120 group-active:scale-100 duration-200 ease-in-out",
                  {
                    "text-neutral-400 group-hover:text-neutral-500": !isPinned,
                    "text-primary-500 fill-primary-500": isPinned,
                  },
                )}
              />
            </IconButton>
            <IconButton tooltip="Close" contentClassName="p-1">
              <XIcon
                size={30}
                className="stroke-neutral-400 group-hover:stroke-red-500 scale-[0.8] group-hover:scale-100 group-active:scale-[0.8] duration-200 ease-in-out"
                onClick={() => {
                  dispatch(setVisibility(false));
                }}
              />
            </IconButton>
          </div>
        </ContextMenuTrigger>

        <ContextMenuContent className="z-99999999 w-52">
          <ContextMenuCheckboxItem
            checked={isShowTokenUsage}
            onCheckedChange={(isChecked) =>
              setIsShowTokenUsageToStorage(isChecked)
            }
          >
            Show token usage
          </ContextMenuCheckboxItem>
          <ContextMenuCheckboxItem
            checked={isForgetfulMode}
            onCheckedChange={(isChecked) =>
              setIsForgetfulModeToStorage(isChecked)
            }
          >
            Forgetful mode
          </ContextMenuCheckboxItem>
          <ContextMenuCheckboxItem
            checked={isShowContext}
            onCheckedChange={(isChecked) =>
              setIsShowContextToStorage(isChecked)
            }
          >
            Show context
          </ContextMenuCheckboxItem>
        </ContextMenuContent>
      </ContextMenu>

      {/* Body */}
      <ResizablePanelGroup direction="horizontal" className="h-full">
        <ResizablePanel>
          <MessageListContainerHandler
            ref={messageSectionRef}
            messages={messages}
            isLoading={isLoading}
          />
        </ResizablePanel>

        {isShowContext && <ResizableHandle withHandle />}

        {isShowContext && (
          <ResizablePanel>
            <DevMessageListContainer />
          </ResizablePanel>
        )}
      </ResizablePanelGroup>

      {/* User prompt and send button */}
      <form
        className="flex flex-row items-start py-3! pl-3! pr-2!"
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        <Textarea
          className="h-12 w-full"
          placeholder="Translate anything"
          value={message}
          onChange={(e) => {
            const value = e.currentTarget.value;

            // Not set value to message with press enter to submit form
            if (value.trim() === "" && value.endsWith("\n")) {
              return;
            }

            setMessage(value);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.ctrlKey && !e.shiftKey) {
              e.currentTarget.form?.requestSubmit();
            }
          }}
          onResize={onResizeTextarea}
          isRemoveWidthStyleAfterResize={true} // Clean up the inline width style so that textarea auto take max width again
        />

        <SendIconButton
          isLoading={isLoading}
          disabled={!isLoading && !message}
          onClick={(e) => {
            if (isLoading) {
              e.preventDefault();
              e.stopPropagation();
              dispatch(abortStreaming());
            }
          }}
        />
      </form>
    </div>
  );
};
