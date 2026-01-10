import { ChevronRight } from "lucide-react";
import { cn } from "../../utils/cn";

type Props = React.ComponentProps<"button"> & {
  isExpanded?: boolean;
};

export const AdvancedSettingsCollapse: React.FC<Props> = ({
  isExpanded = false,
  onClick,
  ...props
}) => {
  return (
    <button
      type="button"
      className="flex flex-row flex-wrap items-center group gap-2 w-full cursor-pointer"
      onClick={onClick}
      {...props}
    >
      <ChevronRight
        className={cn(
          "stroke-neutral-500/80 group-hover:stroke-neutral-600/80 dark:stroke-neutral-400 dark:group-hover:stroke-neutral-300 duration-200 ease-in-out",
          { "rotate-0": !isExpanded, "rotate-90": isExpanded },
        )}
      />
      <p className="text-sm text-neutral-500/80 group-hover:text-neutral-600/80 dark:text-neutral-400/80 dark:group-hover:text-neutral-300/80 font-semibold duration-200 ease-in-out">
        Advanced settings
      </p>
    </button>
  );
};
