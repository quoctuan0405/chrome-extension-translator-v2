import { useCallback, useEffect, useRef, useState } from "react";

export const useResizeBottomRight = (
  containerRef: React.RefObject<HTMLDivElement | null>,
) => {
  const bottomRightHandleRef = useRef<HTMLDivElement>(null);

  const [isDragging, setIsDragging] = useState<boolean>(false);

  // biome-ignore lint/correctness/useExhaustiveDependencies: containerRef is a ref
  const handleResizing = useCallback((e: PointerEvent) => {
    if (containerRef.current && bottomRightHandleRef.current) {
      const {
        bottom,
        height: containerHeight,
        right,
        width: containerWidth,
      } = containerRef.current.getBoundingClientRect();
      const { height: handleHeight, width: handleWidth } =
        bottomRightHandleRef.current.getBoundingClientRect();

      const deltaX = e.clientX - (right - handleWidth / 2);
      containerRef.current.style.width = `${containerWidth + deltaX}px`;
      const deltaY = e.clientY - (bottom - handleHeight / 2);
      containerRef.current.style.height = `${containerHeight + deltaY}px`;
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

  return { bottomRightHandleRef, setIsDragging } as const;
};
