import { PauseIcon, SendIcon } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { IconButton } from "../../components/icon-button";
import { cn } from "../../utils/cn";

type Props = React.ComponentProps<"button"> & {
  isLoading?: boolean;
};

export const SendIconButton: React.FC<Props> = ({
  disabled,
  isLoading,
  onClick,
  ...props
}) => {
  return (
    <IconButton
      type="submit"
      disabled={disabled}
      tooltip="Send"
      contentClassName="size-12 -mt-1"
      onClick={onClick}
      {...props}
    >
      <AnimatePresence>
        {!isLoading && (
          <motion.div
            className="absolute left-0 top-0 size-full flex flex-wrap items-center justify-center"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.15, ease: "linear" }}
          >
            <SendIcon
              size={27}
              className={cn(
                "stroke-primary-500 grayscale scale-[0.85] translate-y-px -translate-x-px duration-200 ease-in-out",
                {
                  "opacity-50": disabled,
                  "group-hover:scale-100 group-hover:grayscale-0 group-active:scale-[0.85]":
                    !disabled,
                },
              )}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isLoading && (
          <motion.div
            className="absolute left-0 top-0 size-full flex flex-wrap items-center justify-center"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.15, ease: "linear" }}
          >
            <PauseIcon className="stroke-0 fill-neutral-400 scale-90 group-hover:scale-110 group-active:scale-90 duration-200 ease-in-out" />
          </motion.div>
        )}
      </AnimatePresence>
    </IconButton>
  );
};
