import { motion } from "motion/react";
import { type RefObject, useCallback, useState } from "react";
import { cn } from "../utils/cn";

type Ripple = {
  id: number;
  x: number;
  y: number;
};

type Props = {
  ripples: Ripple[];
  scale?: number;
  duration?: number;
  className?: string;
};

export const Ripples: React.FC<Props> = ({
  ripples,
  className,
  duration = 0.5,
  scale = 10,
}) => {
  return (
    <>
      {ripples.map((ripple) => (
        <motion.span
          key={ripple.id}
          initial={{ scale: 0, opacity: 1 }}
          animate={{ scale, opacity: 0 }}
          transition={{ duration, ease: "easeOut" }}
          className={cn(
            "absolute z-10 rounded-full size-5 pointer-events-none bg-neutral-500/20 dark:bg-neutral-300/20",
            className,
          )}
          style={{
            top: ripple.y - 10,
            left: ripple.x - 10,
          }}
        />
      ))}
    </>
  );
};

export const useRipples = (containerRef: RefObject<HTMLElement | null>) => {
  const [ripples, setRipples] = useState<Ripple[]>([]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: this is a ref
  const createRipple = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      const container = containerRef.current;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      const newRipple: Ripple = {
        id: Date.now(),
        x,
        y,
      };

      setRipples((prev) => [...prev, newRipple]);

      setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
      }, 1000);
    },
    [],
  );

  return { ripples, createRipple } as const;
};
