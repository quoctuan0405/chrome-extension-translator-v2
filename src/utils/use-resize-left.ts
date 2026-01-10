import { useCallback, useEffect, useRef, useState } from "react";

export const useResizeLeft = (
  containerRef: React.RefObject<HTMLDivElement | null>,
) => {
  const leftHandleRef = useRef<HTMLDivElement>(null);

  const [isDragging, setIsDragging] = useState<boolean>(false);

  // biome-ignore lint/correctness/useExhaustiveDependencies: containerRef is a ref
  const handleResizing = useCallback((e: PointerEvent) => {
    if (containerRef.current && leftHandleRef.current) {
      const { left, width: containerWidth } =
        containerRef.current.getBoundingClientRect();
      const { width: handleWidth } =
        leftHandleRef.current.getBoundingClientRect();

      const delta = left + handleWidth / 2 - e.clientX;
      containerRef.current.style.width = `${containerWidth + delta}px`;

      const style = window.getComputedStyle(containerRef.current);
      const { m41: translateX, m42: translateY } = new DOMMatrixReadOnly(
        style.transform,
      );

      containerRef.current.style.transform = `translateX(${translateX - delta}px) translateY(${translateY}px)`;
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

  return { leftHandleRef, setIsDragging } as const;
};
