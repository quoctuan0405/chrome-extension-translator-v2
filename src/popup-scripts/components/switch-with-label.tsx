import type * as SwitchPrimitive from "@radix-ui/react-switch";
import { useId } from "react";
import { Switch } from "../../components/switch";
import { cn } from "../../utils/cn";

type Props = React.ComponentProps<typeof SwitchPrimitive.Root> & {
  label: string;
  className?: string;
};

export const SwitchWithLabel: React.FC<Props> = ({
  label,
  className,
  ...props
}) => {
  const id = useId();

  return (
    <div className={cn("flex group items-center", className)}>
      <Switch id={id} className="mt-0.5 mr-4" {...props} />
      <label
        htmlFor={id}
        className="text-sm text-neutral-500 group-hover:text-neutral-600 dark:text-neutral-400 dark:group-hover:text-neutral-300 select-none font-semibold cursor-pointer duration-200 ease-in-out"
      >
        {label}
      </label>
    </div>
  );
};
