import { composeRefs } from "@radix-ui/react-compose-refs";
import { motion } from "motion/react";
import { useRef } from "react";
import { cn } from "../utils/cn";
import { Particles, useParticles } from "./particles";
import { Ripples, useRipples } from "./ripples";
import { Tooltip, TooltipContent, TooltipTrigger } from "./tooltip";

export type TooltipSide = "bottom" | "top" | "right" | "left";

type Props = React.ComponentProps<"button"> & {
  isSelected?: boolean;
  isBackgroundLayoutTransition?: boolean;
  isBurstParticlesWhenClick?: boolean;
  isRippleWhenClick?: boolean;
  tooltip?: string;
  side?: TooltipSide;
  rippleScale?: number;
  contentClassName?: string;
};

export const IconButton: React.FC<Props> = ({
  ref,
  isSelected = false,
  isBackgroundLayoutTransition = false,
  isBurstParticlesWhenClick = false,
  isRippleWhenClick = true,
  tooltip,
  side,
  rippleScale,
  children,
  onClick,
  className,
  disabled,
  contentClassName,
  ...props
}) => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const { ripples, createRipple } = useRipples(buttonRef);
  const { iconButtonSize, burstOfParticlesIds, createBurstOfParticles } =
    useParticles(buttonRef);

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          ref={composeRefs(ref, buttonRef)}
          type="button"
          className={cn(
            "relative group rounded-full duration-200 ease-in-out",
            { "cursor-pointer": !disabled },
            className,
          )}
          disabled={disabled}
          onClick={(e) => {
            isRippleWhenClick && createRipple(e);
            isBurstParticlesWhenClick && createBurstOfParticles();
            onClick?.(e);
          }}
          {...props}
        >
          {isSelected && (
            <motion.div
              layout
              layoutId="icon-button-background"
              className="absolute top-0 left-0 size-full rounded-full bg-neutral-200 dark:bg-neutral-600"
            />
          )}

          {burstOfParticlesIds.map((id) => (
            <Particles key={id} iconButtonSize={iconButtonSize} />
          ))}

          <div
            className={cn(
              "relative z-10 overflow-hidden p-3 rounded-full",
              {
                "backdrop-blur-sm": !isBackgroundLayoutTransition,
              },
              contentClassName,
            )}
          >
            <Ripples ripples={ripples} scale={rippleScale} />

            {children}
          </div>
        </button>
      </TooltipTrigger>

      {tooltip && (
        <TooltipContent side={side}>
          <p>{tooltip}</p>
        </TooltipContent>
      )}
    </Tooltip>
  );
};
