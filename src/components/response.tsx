import { type ComponentProps, memo } from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "../utils/cn";
import { parseIncompleteMarkdown } from "../utils/parse-incomplete-markdown";

type ResponseProps = ComponentProps<typeof Markdown> & {
  className?: string;
};

export const Response = memo(
  ({ className, children, ...props }: ResponseProps) => (
    <div
      className={cn(
        "prose max-w-none prose-light md-light dark:md-dark dark:prose-invert prose-xs",
        "[&_hr]:my-3 [&_h1]:my-2.5 [&_h2]:my-2 [&_h3]:my-1.5 [&_h4]:my-1 [&_h5]:my-1 [&_h6]:my-1",
        "[&_ol]:ml-5! [&_ol]:pl-0 [&_ol]:my-1! [&_ol]list-decimal",
        "[&_ul]:ml-5! [&_ul]:pl-0 [&_ul]:my-1! [&_ul]:list-disc",
        "[&_li]:ml-1 [&_li]:my-0 [&_li]:pl-1 [&_li]:list-[inherit] [&_li]:before:content-none [&_li]:after:content-none",
        "[&_p]:my-1",
        "w-full",
        className,
      )}
    >
      <Markdown {...props} remarkPlugins={[remarkGfm]}>
        {children ? parseIncompleteMarkdown(children) : undefined}
      </Markdown>
    </div>
  ),
  (prevProps, nextProps) => prevProps.children === nextProps.children,
);
