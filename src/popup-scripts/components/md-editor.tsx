import type { MDXEditorProps } from "@mdxeditor/editor";
import { useCallback, useEffect, useRef, useState } from "react";
import { CustomMDXEditor } from "../../components/custom-mdx-editor";

type Props = {
  initialValue?: string;
  onWidthResize?: (delta: number) => void;
  onChange?: MDXEditorProps["onChange"];
};

export const MDEditor: React.FC<Props> = ({
  initialValue,
  onWidthResize,
  onChange,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Scroll
  const makeEditorScrollIfNecessary = useCallback(() => {
    const markdownEditor = containerRef.current?.querySelector(
      "div.prose",
    ) as HTMLDivElement;
    if (markdownEditor) {
      // Vertical scroll if necessary
      if (markdownEditor.scrollHeight > markdownEditor.clientHeight) {
        markdownEditor.style.overflowY = "scroll";
      } else {
        markdownEditor.style.overflowY = "auto";
      }
    }
  }, []);

  // Resize left
  const leftHandleRef = useRef<HTMLDivElement>(null);
  const [isDraggingLeft, setIsDraggingLeft] = useState<boolean>(false);

  const handleResizingLeft = useCallback(
    (e: PointerEvent) => {
      const markdownEditor = containerRef.current?.querySelector(
        "div.prose",
      ) as HTMLDivElement;

      if (markdownEditor && leftHandleRef.current) {
        const { left } = markdownEditor.getBoundingClientRect();
        const { width: handleWidth } =
          leftHandleRef.current.getBoundingClientRect();

        const delta = left + handleWidth / 2 - e.clientX;

        onWidthResize?.(delta);
      }
    },
    [onWidthResize],
  );

  const removeHandleResizingLeft = useCallback(() => {
    setIsDraggingLeft(false);
    document.removeEventListener("pointermove", handleResizingLeft);
  }, [handleResizingLeft]);

  useEffect(() => {
    if (isDraggingLeft) {
      document.body.style.userSelect = "none";
      document.addEventListener("pointermove", handleResizingLeft);
      document.addEventListener("pointerup", removeHandleResizingLeft);
    } else {
      document.body.style.userSelect = "auto";
    }

    return () => {
      document.removeEventListener("pointerup", removeHandleResizingLeft);
      document.body.style.userSelect = "auto";
    };
  }, [isDraggingLeft, handleResizingLeft, removeHandleResizingLeft]);

  // Resize bottom
  const bottomHandleRef = useRef<HTMLDivElement>(null);
  const [isDraggingBottom, setIsDraggingBottom] = useState<boolean>(false);

  const handleResizingBottom = useCallback((e: PointerEvent) => {
    const markdownEditor = containerRef.current?.querySelector(
      "div.prose",
    ) as HTMLDivElement;

    if (markdownEditor && bottomHandleRef.current) {
      const { bottom, height: containerHeight } =
        markdownEditor.getBoundingClientRect();
      const { height: handleHeight } =
        bottomHandleRef.current.getBoundingClientRect();

      const delta = e.clientY - (bottom - handleHeight / 2);
      markdownEditor.style.height = `${containerHeight + delta}px`;
    }
  }, []);

  const removeHandleResizingBottom = useCallback(() => {
    setIsDraggingBottom(false);
    document.removeEventListener("pointermove", handleResizingBottom);
  }, [handleResizingBottom]);

  useEffect(() => {
    if (isDraggingBottom) {
      document.body.style.userSelect = "none";
      document.addEventListener("pointermove", handleResizingBottom);
      document.addEventListener("pointerup", removeHandleResizingBottom);
    } else {
      document.body.style.userSelect = "auto";
    }

    return () => {
      document.removeEventListener("pointerup", removeHandleResizingBottom);
      document.body.style.userSelect = "auto";
    };
  }, [isDraggingBottom, handleResizingBottom, removeHandleResizingBottom]);

  return (
    <div
      ref={containerRef}
      className="relative overflow-hidden rounded-xl border-neutral-200 dark:border-neutral-700 border hover:ring-neutral-100 dark:hover:ring-neutral-600 hover:ring-2 duration-200"
    >
      <div
        ref={leftHandleRef}
        className="absolute top-0 left-0 z-10 h-full w-2 hover:bg-blue-500 cursor-w-resize duration-200"
        onPointerDown={() => {
          setIsDraggingLeft(true);
        }}
      />

      <div
        ref={bottomHandleRef}
        className="absolute bottom-0 left-0 z-10 w-full h-2 hover:bg-blue-500 cursor-s-resize duration-200"
        onPointerDown={() => {
          setIsDraggingBottom(true);
        }}
      />

      <CustomMDXEditor
        className="h-[200px] overflow-y-scroll dark:scrollbar dark:scrollbar-track-neutral-700 dark:scrollbar-thumb-neutral-500"
        initialValue={initialValue}
        onChange={(markdown, initialMarkdownNormalize) => {
          makeEditorScrollIfNecessary();
          onChange?.(markdown, initialMarkdownNormalize);
        }}
      />
    </div>
  );
};
