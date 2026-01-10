import { AnimatePresence, motion } from "motion/react";
import { useRef } from "react";
import type { DeltaDimension } from "../components/textarea";
import { useDrag } from "../utils/use-drag";
import { useResizeBottom } from "../utils/use-resize-bottom";
import { useResizeBottomRight } from "../utils/use-resize-bottom-right";
import { useResizeLeft } from "../utils/use-resize-left";
import { useResizeRight } from "../utils/use-resize-right";
import { useResizeTop } from "../utils/use-resize-top";
import { TranslationWindow } from "./components/translation-window";
import { useAppSelector } from "./store";

export const App: React.FC = () => {
  const { isVisible, left, top } = useAppSelector(
    (state) => state.translationWindow,
  );

  const containerRef = useRef<HTMLDivElement>(null);

  // Resizing container
  const { rightHandleRef, setIsDragging: setIdDraggingRight } =
    useResizeRight(containerRef);
  const { leftHandleRef, setIsDragging: setIsDraggingLeft } =
    useResizeLeft(containerRef);
  const { bottomHandleRef, setIsDragging: setIsDraggingBottom } =
    useResizeBottom(containerRef);
  const { topHandleRef, setIsDragging: setIsDraggingTop } =
    useResizeTop(containerRef);
  const { bottomRightHandleRef, setIsDragging: setIsDraggingBottomRight } =
    useResizeBottomRight(containerRef);

  const { onPointerDown } = useDrag(containerRef);

  // Resize according to the inner textarea for user prompt
  const handleResizeTextarea = ({
    deltaWidth,
    deltaHeight,
  }: DeltaDimension) => {
    const container = containerRef.current;
    if (container) {
      const { width: containerWidth, height: containerHeight } =
        container.getBoundingClientRect();

      container.style.width = `${containerWidth + deltaWidth}px`;
      container.style.height = `${containerHeight + deltaHeight}px`;
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          ref={containerRef}
          className="fixed overflow-hidden z-9999 left-[350px] top-[150px] bg-white w-[550px] h-[400px] rounded-2xl border-2 border-neutral-500/10 ring-2 ring-neutral-500/5"
          style={{ left, top }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.065 }}
        >
          <div
            ref={rightHandleRef}
            className="absolute top-0 right-0 z-10 h-full w-2 hover:bg-primary-500 cursor-e-resize duration-200"
            onPointerDown={() => {
              setIdDraggingRight(true);
            }}
          />
          <div
            ref={leftHandleRef}
            className="absolute top-0 left-0 z-10 h-full w-2 hover:bg-primary-500 cursor-w-resize duration-200"
            onPointerDown={() => {
              setIsDraggingLeft(true);
            }}
          />
          <div
            ref={bottomHandleRef}
            className="absolute bottom-0 left-0 z-10 w-full h-2 hover:bg-primary-500 cursor-s-resize duration-200"
            onPointerDown={() => {
              setIsDraggingBottom(true);
            }}
          />
          <div
            ref={topHandleRef}
            className="absolute top-0 left-0 z-10 w-full h-2 hover:bg-primary-500 cursor-s-resize duration-200"
            onPointerDown={() => {
              setIsDraggingTop(true);
            }}
          />
          <div
            ref={bottomRightHandleRef}
            className="absolute bottom-0 right-0 z-10 size-4 hover:bg-primary-500 cursor-se-resize duration-200"
            onPointerDown={() => {
              setIsDraggingBottomRight(true);
            }}
          />
          <TranslationWindow
            onPointerDown={onPointerDown}
            onResizeTextarea={handleResizeTextarea}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};
