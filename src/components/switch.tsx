import * as SwitchPrimitive from "@radix-ui/react-switch";
import type * as React from "react";
import { cn } from "../utils/cn";

function Switch({
  className,
  ...props
}: React.ComponentProps<typeof SwitchPrimitive.Root>) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      className={cn(
        "cursor-pointer peer data-[state=checked]:bg-primary-500 data-[state=unchecked]:bg-neutral-300 dark:data-[state=unchecked]:bg-neutral-600 focus-visible:border-ring focus-visible:ring-ring/50 inline-flex h-[1.55rem] w-10 shrink-0 items-center rounded-full border border-transparent shadow-xs transition-all outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className={cn(
          "bg-white dark:data-[state=unchecked]:bg-neutral-100 dark:data-[state=checked]:bg-neutral-100 pointer-events-none block size-5 rounded-full ring-0 transition-transform data-[state=checked]:translate-x-[calc(100%-4px)] data-[state=unchecked]:translate-x-0.5",
        )}
      />
    </SwitchPrimitive.Root>
  );
}

export { Switch };
