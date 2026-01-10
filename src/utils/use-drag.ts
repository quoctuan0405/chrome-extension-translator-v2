import {
  useCallback,
  useEffect,
  useEffectEvent,
  useRef,
  useState,
} from "react";

export const useDrag = (
  containerRef: React.RefObject<HTMLDivElement | null>,
) => {
  const pointerDownPositionRef = useRef({
    x: 0,
    y: 0,
  });
  const translatePositionRef = useRef({
    translateX: 0,
    translateY: 0,
  });
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const handleResizing = useEffectEvent((e: PointerEvent) => {
    if (containerRef.current) {
      const deltaX = e.pageX - pointerDownPositionRef.current.x;
      const deltaY = e.pageY - pointerDownPositionRef.current.y;
      const { translateX, translateY } = translatePositionRef.current;

      containerRef.current.style.transform = `translateX(${translateX + deltaX}px) translateY(${translateY + deltaY}px)`;
    }
  });

  const removeHandleResizing = useEffectEvent(() => {
    setIsDragging(false);
    document.removeEventListener("pointermove", handleResizing);
  });

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
  }, [isDragging]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: containerRef.current is a ref
  const onPointerDown: React.PointerEventHandler = useCallback((e) => {
    setIsDragging(true);
    pointerDownPositionRef.current.x = e.pageX;
    pointerDownPositionRef.current.y = e.pageY;

    if (containerRef.current) {
      const style = window.getComputedStyle(containerRef.current);

      const { m41: translateX, m42: translateY } = new DOMMatrixReadOnly(
        style.transform,
      );

      translatePositionRef.current.translateX = translateX;
      translatePositionRef.current.translateY = translateY;
    }
  }, []);

  return { onPointerDown } as const;
};
