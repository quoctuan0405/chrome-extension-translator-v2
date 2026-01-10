import { useComposedRefs } from "@radix-ui/react-compose-refs";
import { useCallback, useEffectEvent, useRef } from "react";
import { cn } from "../utils/cn";

export type DeltaDimension = {
  deltaWidth: number;
  deltaHeight: number;
};

type Props = React.ComponentProps<"textarea"> & {
  isRemoveWidthStyleAfterResize?: boolean;
  onResize?: (delta: DeltaDimension) => void;
};

export const Textarea: React.FC<Props> = ({
  className,
  onPointerDown,
  onResize,
  isRemoveWidthStyleAfterResize,
  ref,
  ...props
}) => {
  const localRef = useRef<HTMLTextAreaElement>(null);
  const composedRefs = useComposedRefs(localRef, ref);

  const removeWidthStyleAfterResize = useEffectEvent(() => {
    const textarea = localRef.current;
    if (isRemoveWidthStyleAfterResize && textarea) {
      textarea.style.width = "";
    }
  });

  const previousPointerPosition = useRef({
    x: 0,
    y: 0,
  });

  const handleResizing = useCallback(
    (e: PointerEvent) => {
      const { x: previousX, y: previousY } = previousPointerPosition.current;

      const deltaWidth = e.pageX - previousX;
      const deltaHeight = e.pageY - previousY;

      previousPointerPosition.current = {
        x: e.pageX,
        y: e.pageY,
      };

      onResize?.({ deltaWidth, deltaHeight });
    },
    [onResize],
  );

  const removeHandleResizing = useCallback(() => {
    removeWidthStyleAfterResize();
    document.removeEventListener("pointermove", handleResizing);
    document.removeEventListener("pointermove", removeHandleResizing);
  }, [handleResizing]);

  const onPointerDownForResizing: React.PointerEventHandler<
    HTMLTextAreaElement
  > = (e) => {
    previousPointerPosition.current = {
      x: e.pageX,
      y: e.pageY,
    };

    document.addEventListener("pointermove", handleResizing);
    document.addEventListener("pointerup", removeHandleResizing);
  };

  return (
    <textarea
      ref={composedRefs}
      data-slot="textarea"
      className={cn(
        "resize! overflow-hidden border-neutral-200 dark:border-neutral-700 border placeholder:text-neutral-400 text-neutral-600 dark:text-neutral-300 dark:bg-input/30 w-full min-w-0 rounded-xl bg-transparent px-3! py-2! text-sm shadow-xs transition-[color,box-shadow] outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "hover:ring-neutral-100 dark:hover:ring-neutral-600 hover:ring-2",
        "focus-visible:border-neutral-300 focus-visible:ring-neutral-300 dark:focus-visible:border-neutral-600 dark:focus-visible:ring-neutral-600 focus-visible:ring-[0.5px]",
        className,
      )}
      onPointerDown={(e) => {
        onPointerDownForResizing(e);
        onPointerDown?.(e);
      }}
      {...props}
    />
  );
};
