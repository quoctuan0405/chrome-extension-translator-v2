import {
  headingsPlugin,
  listsPlugin,
  MDXEditor,
  type MDXEditorMethods,
  type MDXEditorProps,
  markdownShortcutPlugin,
  quotePlugin,
  thematicBreakPlugin,
} from "@mdxeditor/editor";
import { useRef } from "react";
import { cn } from "../utils/cn";

type Props = {
  className?: string;
  initialValue?: string;
  onChange?: MDXEditorProps["onChange"];
};

export const CustomMDXEditor: React.FC<Props> = ({
  className,
  initialValue,
  onChange,
}) => {
  const mdxEditorRef = useRef<MDXEditorMethods>(null);

  return (
    <MDXEditor
      ref={mdxEditorRef}
      contentEditableClassName={cn(
        "prose max-w-none prose-light md-light dark:md-dark dark:prose-invert prose-xs",
        "[&_hr]:my-3 [&_h1]:my-2.5 [&_h2]:my-2 [&_h3]:my-1.5 [&_h4]:my-1 [&_h5]:my-1 [&_h6]:my-1",
        "[&_ol]:ml-4 [&_ol]:pl-0 [&_ol]:my-0 [&_ol]list-decimal!",
        "[&_ul]:ml-4 [&_ul]:pl-0 [&_ul]:my-0 [&_ul]:list-disc!",
        "[&_li]:ml-4 [&_li]:my-0 [&_li]:pl-0 [&_li]:before:content-none [&_li]:after:content-none",
        "[&_p]:my-1",
        "w-full",
        className,
      )}
      markdown={initialValue ?? ""}
      onChange={(value, initialMarkdownNormalize) => {
        mdxEditorRef.current?.setMarkdown(value);
        onChange?.(value, initialMarkdownNormalize);
      }}
      plugins={[
        headingsPlugin(),
        listsPlugin(),
        quotePlugin(),
        thematicBreakPlugin(),
        markdownShortcutPlugin(),
      ]}
    />
  );
};
