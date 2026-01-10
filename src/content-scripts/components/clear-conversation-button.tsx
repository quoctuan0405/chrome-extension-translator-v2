import { RotateCcw } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { Button } from "../../components/button";
import { IconButton } from "../../components/icon-button";
import { cn } from "../../utils/cn";
import { resetChat } from "../store/slices/chat-slice";

type Props = {
  className?: string;
};

export const ClearConversationButton: React.FC<Props> = ({ className }) => {
  const dispatch = useDispatch();

  const [isShowClearConverstaionButton, setIsShowClearConverstaionButton] =
    useState<boolean>(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = useCallback((e: PointerEvent) => {
    if (!e.target || !(e.target instanceof Node)) {
      setIsShowClearConverstaionButton(false);
      return;
    }

    if (
      !containerRef.current?.contains(e.target) &&
      !dropdownRef.current?.contains(e.target)
    ) {
      setIsShowClearConverstaionButton(false);
    }
  }, []);

  useEffect(() => {
    if (isShowClearConverstaionButton) {
      window.addEventListener("click", handleClickOutside);

      return () => window.removeEventListener("click", handleClickOutside);
    }
  }, [isShowClearConverstaionButton, handleClickOutside]);

  return (
    <div ref={containerRef} className={cn("relative size-max", className)}>
      <IconButton
        className="mt-1.5!"
        tooltip="Clear this conversation"
        onClick={() => {
          setIsShowClearConverstaionButton((prevState) => !prevState);
        }}
      >
        <RotateCcw className="text-neutral-400 group-hover:text-neutral-500 group-hover:scale-110 group-active:scale-100 duration-200 ease-in-out" />
      </IconButton>

      <AnimatePresence>
        {isShowClearConverstaionButton && (
          <motion.div
            ref={dropdownRef}
            className="absolute top-12 -left-32 z-10"
            initial={{ opacity: 0, y: -3 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -3 }}
            transition={{ duration: 0.1 }}
          >
            <Button
              onClick={() => {
                dispatch(resetChat());
                const timeoutId = setTimeout(() => {
                  setIsShowClearConverstaionButton((prevState) => !prevState);
                  clearTimeout(timeoutId);
                }, 200);
              }}
            >
              <p className="bg-white text-red-500 px-5 py-2 w-max">
                Clear this conversation
              </p>
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
