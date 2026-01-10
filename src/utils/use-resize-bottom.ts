import { useCallback, useEffect, useRef, useState } from "react";

export const useResizeBottom = (
  containerRef: React.RefObject<HTMLDivElement | null>,
) => {
  const bottomHandleRef = useRef<HTMLDivElement>(null);

  const [isDragging, setIsDragging] = useState<boolean>(false);

  // biome-ignore lint/correctness/useExhaustiveDependencies: containerRef is a ref
  const handleResizing = useCallback((e: PointerEvent) => {
    if (containerRef.current && bottomHandleRef.current) {
      const { bottom, height: containerHeight } =
        containerRef.current.getBoundingClientRect();
      const { height: handleHeight } =
        bottomHandleRef.current.getBoundingClientRect();

      const delta = e.clientY - (bottom - handleHeight / 2);
      containerRef.current.style.height = `${containerHeight + delta}px`;
    }
  }, []);

  const removeHandleResizing = useCallback(() => {
    setIsDragging(false);
    document.removeEventListener("pointermove", handleResizing);
  }, [handleResizing]);

  useEffect(() => {
    if (isDragging) {
      document.body.style.userSelect = "none";
      document.addEventListener("pointermove", handleResizing);
      document.addEventListener("pointerup", removeHandleResizing);
    } else {
      document.body.style.userSelect = "auto";
    }

    return () => {
      document.removeEventListener("pointerup", removeHandleResizing);
      document.body.style.userSelect = "auto";
    };
  }, [isDragging, handleResizing, removeHandleResizing]);

  return { bottomHandleRef, setIsDragging } as const;
};
