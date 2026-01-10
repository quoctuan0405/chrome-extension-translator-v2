import { useCallback, useEffect, useRef, useState } from "react";

export const useResizeTop = (
  containerRef: React.RefObject<HTMLDivElement | null>,
) => {
  const topHandleRef = useRef<HTMLDivElement>(null);

  const [isDragging, setIsDragging] = useState<boolean>(false);

  // biome-ignore lint/correctness/useExhaustiveDependencies: containerRef is a ref
  const handleResizing = useCallback((e: PointerEvent) => {
    if (containerRef.current && topHandleRef.current) {
      const { top, height: containerHeight } =
        containerRef.current.getBoundingClientRect();
      const { height: handleHeight } =
        topHandleRef.current.getBoundingClientRect();

      const delta = top + handleHeight / 2 - e.clientY;
      containerRef.current.style.height = `${containerHeight + delta}px`;

      const style = window.getComputedStyle(containerRef.current);
      const { m41: translateX, m42: translateY } = new DOMMatrixReadOnly(
        style.transform,
      );

      containerRef.current.style.transform = `translateX(${translateX}px) translateY(${translateY - delta}px)`;
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

  return { topHandleRef, setIsDragging } as const;
};
