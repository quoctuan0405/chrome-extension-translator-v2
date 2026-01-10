import * as TabsPrimitive from "@radix-ui/react-tabs";
import { motion } from "motion/react";
import type * as React from "react";
import { cn } from "../utils/cn";

const Tabs = ({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Root>) => {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      className={cn("flex flex-col gap-2", className)}
      {...props}
    />
  );
};

const TabsList = ({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.List>) => {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      className={cn(
        "bg-neutral-100 dark:bg-neutral-700 inline-flex h-9 w-fit items-center justify-center rounded-lg p-[3px]",
        className,
      )}
      {...props}
    />
  );
};

export type TabsTriggerProps = React.ComponentProps<
  typeof TabsPrimitive.Trigger
> & {
  selectedValue?: string;
};

const TabsTrigger = ({
  className,
  children,
  selectedValue,
  ...props
}: TabsTriggerProps) => {
  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      className={cn(
        "relative cursor-pointer focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:outline-ring dark:data-[state=active]:border-input dark:data-[state=active]:bg-input/30 text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 hover:dark:text-neutral-300 dark:data-[state=active]:text-neutral-300 inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1.5 rounded-md border border-transparent px-2 py-1 text-sm font-medium whitespace-nowrap transition-[color,box-shadow] focus-visible:ring-[3px] focus-visible:outline-1 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:shadow-sm [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 duration-200",
        className,
      )}
      {...props}
    >
      {selectedValue === props.value && (
        <motion.div
          layout
          layoutId="tab-trigger"
          className="absolute top-0 left-0 size-full rounded-lg bg-white dark:bg-neutral-600"
        />
      )}

      <div className="z-10">{children}</div>
    </TabsPrimitive.Trigger>
  );
};

const TabsContent = ({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Content>) => {
  return (
    <TabsPrimitive.Content
      data-slot="tabs-content"
      className={className}
      {...props}
    />
  );
};

export { Tabs, TabsList, TabsTrigger, TabsContent };
