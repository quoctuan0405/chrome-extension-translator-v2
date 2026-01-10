import { useRef } from "react";
import { cn } from "../utils/cn";
import { Ripples, useRipples } from "./ripples";

type Props = React.ComponentProps<"button"> & {
  isSelected?: boolean;
};

export const Tag: React.FC<Props> = ({
  className,
  isSelected,
  children,
  onClick,
  ...props
}) => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const { ripples, createRipple } = useRipples(buttonRef);

  return (
    <button
      ref={buttonRef}
      type="button"
      className={cn(
        "relative bg-primary overflow-hidden py-1.5 px-3 rounded-full cursor-pointer duration-300 ease-in-out",
        {
          "bg-neutral-300/30 dark:bg-neutral-700/80 hover:bg-neutral-300 dark:hover:bg-neutral-600/80 text-neutral-500 hover:text-neutral-600 dark:text-neutral-400/90 dark:hover:text-neutral-300":
            !isSelected,
          "bg-primary hover:bg-primary/80 dark:bg-neutral-300/90 dark:hover:bg-neutral-300 text-white dark:text-black":
            isSelected,
        },
        className,
      )}
      onClick={(e) => {
        createRipple(e);
        onClick?.(e);
      }}
      {...props}
    >
      <Ripples
        ripples={ripples}
        className={cn({
          "bg-primary-200/50 dark:text-neutral-200/30": isSelected,
        })}
      />

      {children}
    </button>
  );
};
