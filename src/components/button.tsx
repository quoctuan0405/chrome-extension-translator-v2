import { useComposedRefs } from "@radix-ui/react-compose-refs";
import { useRef } from "react";
import { cn } from "../utils/cn";
import { Ripples, useRipples } from "./ripples";

type Props = React.ComponentProps<"button">;

export const Button: React.FC<Props> = ({
  ref,
  className,
  children,
  onClick,
  ...rest
}) => {
  const localRef = useRef<HTMLButtonElement>(null);
  const { createRipple, ripples } = useRipples(localRef);

  const composedRefs = useComposedRefs(localRef, ref);

  return (
    <button
      ref={composedRefs}
      type="button"
      className={cn(
        "group w-full cursor-pointer rounded-lg duration-100 ease-in-out",
        "border! border-neutral-200! dark:border-neutral-500/80! dark:hover:border-neutral-400/70! dark:active:border-neutral-500/80!",
        "outline-0 hover:outline-3 dark:hover:outline-4 outline-neutral-200/50 dark:outline-neutral-400/10 active:outline-1 dark:active:outline-2",
        className,
      )}
      onClick={(e) => {
        createRipple(e);
        onClick?.(e);
      }}
      {...rest}
    >
      <div className="relative size-full rounded-lg overflow-hidden">
        <Ripples ripples={ripples} className="bg-neutral-500/10" />

        <div className="group-active:scale-[0.98] text-neutral-500 dark:text-neutral-300 dark:group-active:text-neutral-400 text-sm duration-200">
          {children}
        </div>
      </div>
    </button>
  );
};
