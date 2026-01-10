import { useCallback, useEffect, useRef, useState } from "react";

export const useResizeRight = (
  containerRef: React.RefObject<HTMLDivElement | null>,
) => {
  const rightHandleRef = useRef<HTMLDivElement>(null);

  const [isDragging, setIsDragging] = useState<boolean>(false);

  // biome-ignore lint/correctness/useExhaustiveDependencies: containerRef is a ref
  const handleResizing = useCallback((e: PointerEvent) => {
    if (containerRef.current && rightHandleRef.current) {
      const { right, width: containerWidth } =
        containerRef.current.getBoundingClientRect();
      const { width: handleWidth } =
        rightHandleRef.current.getBoundingClientRect();

      const delta = e.clientX - (right - handleWidth / 2);
      containerRef.current.style.width = `${containerWidth + delta}px`;
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

  return { rightHandleRef, setIsDragging } as const;
};
