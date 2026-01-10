import { cn } from "../utils/cn";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "placeholder:text-sm placeholder:text-neutral-400 border border-neutral-200 dark:border-neutral-700 h-9 w-full min-w-0 rounded-lg bg-transparent px-3 pt-1 pb-1.5 text-base shadow-xs transition-[color,box-shadow] outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm duration-200 ease-in-out",
        "text-neutral-600 dark:text-neutral-300",
        "hover:ring-neutral-100 dark:hover:ring-neutral-600 hover:ring-2",
        "focus-visible:border-neutral-300 focus-visible:ring-neutral-300 dark:focus-visible:border-neutral-600 dark:focus-visible:ring-neutral-600 focus-visible:ring-[0.5px]",
        className,
      )}
      {...props}
    />
  );
}

export { Input };
