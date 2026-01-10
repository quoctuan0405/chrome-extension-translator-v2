import { LoaderCircle } from "lucide-react";
import { AnimatePresence, motion, useTime, useTransform } from "motion/react";
import {
  useEffect,
  useEffectEvent,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { FlipText } from "../../components/flip-text";
import GradientText from "../../components/gradient-text";
import { Ripples, useRipples } from "../../components/ripples";
import { cn } from "../../utils/cn";
import type { AIVendor } from "../../utils/storage";

const aiVendorTextMap: Record<AIVendor, string> = {
  chatgpt: "Chat GPT",
  claude: "Claude",
  gemini: "Gemini",
  deepseek: "Deepseek",
  xai: "xAI",
};

type Props = React.ComponentProps<"button"> & {
  aiVendor?: AIVendor;
  isConnecting?: boolean;
  isSuccessfully?: boolean;
};

// https://www.youtube.com/watch?v=OgQI1-9T6ZA
// https://github.com/Built-With-Code/animated-border-gradient/blob/main/src/app/page.tsx
export const ConnectButton: React.FC<Props> = ({
  aiVendor = "chatgpt",
  isConnecting = false,
  isSuccessfully = false,
  onClick,
  children,
  ...props
}) => {
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Ripples
  const { ripples, createRipple } = useRipples(buttonRef);

  // Rotating border animation
  const time = useTime();

  const rotate = useTransform(time, [0, 1000], [0, 360], {
    clamp: false,
  });

  const rotatingBg = useTransform(rotate, (r) => {
    return `conic-gradient(from ${r}deg, #ff4545, #00ff99, #006aff, #ff0095, #ff4545)`;
  });

  // Particles
  const [buttonX, setButtonX] = useState<number>(0);
  const [buttonY, setButtonY] = useState<number>(0);
  const [buttonWidth, setButtonWidth] = useState<number>(0);
  const [buttonHeight, setButtonHeight] = useState<number>(0);

  // Get button position and its width height for particles
  // biome-ignore lint/correctness/useExhaustiveDependencies: aiVendor change will cause layout shift which cause x and y of the button change
  useEffect(() => {
    const button = buttonRef.current;

    if (button) {
      // Wait 1 second for motion layout animation to complete
      const timeoutId = setTimeout(() => {
        const { x, y, width, height } = button.getBoundingClientRect();
        setButtonX(x);
        setButtonY(y);
        setButtonWidth(width);
        setButtonHeight(height);
      }, 1000);

      return () => clearTimeout(timeoutId);
    }
  }, [aiVendor]);

  const [burstOfParticlesIds, setBurstOfParticlesIds] = useState<number[]>([]);

  const createBurstOfParticles = useEffectEvent(() => {
    const newBurstOfParticlesId = Date.now();

    setBurstOfParticlesIds((prev) => [...prev, newBurstOfParticlesId]);

    setTimeout(() => {
      setBurstOfParticlesIds((prev) =>
        prev.filter((id) => id !== newBurstOfParticlesId),
      );
    }, 2000);
  });

  useEffect(() => {
    if (isSuccessfully) {
      createBurstOfParticles();
    }
  }, [isSuccessfully]);

  return (
    <button
      ref={buttonRef}
      className={cn(
        "relative w-full h-max rounded-xl border border-neutral-200 dark:border-neutral-600 outline-0 outline-neutral-500/10 focus-visible:outline-1 focus-visible:outline-neutral-500 dark:outline-neutral-300/10 dark:focus-visible:outline-neutral-300 duration-200 ease-in-out",
        "disabled:opacity-50 disabled:cursor-default",
        {
          "cursor-pointer": !isConnecting,
          "hover:outline-[3px] active:outline-1 active:outline-neutral-300 dark:active:outline-neutral-500/50":
            !props.disabled && !isConnecting,
        },
      )}
      onClick={(e) => {
        onClick?.(e);
        !props.disabled && !isConnecting && createRipple(e);
      }}
      {...props}
    >
      {/* Rotating border animation */}
      <AnimatePresence>
        {isConnecting && (
          <motion.div
            className="absolute top-0 left-0 z-0 -inset-px rounded-xl blur-xs"
            initial={{ opacity: 0 }}
            animate={{ opacity: 100, transition: { duration: 1 } }}
            exit={{ opacity: 0, transition: { duration: 2 } }}
            style={{ background: rotatingBg }}
          />
        )}
      </AnimatePresence>

      {/* Particles */}
      {burstOfParticlesIds.map((id) => (
        <Particles
          key={id}
          containerX={buttonX}
          containerY={buttonY}
          containerWidth={buttonWidth}
          containerHeight={buttonHeight}
        />
      ))}

      <div className="relative overflow-hidden bg-white dark:bg-neutral-800 z-10 rounded-xl size-full px-5 py-3 text-sm">
        <Ripples ripples={ripples} duration={0.4} />

        {/* Content of the button */}
        <div
          className={cn("flex flex-wrap items-center justify-center", {
            "text-neutral-400": isConnecting,
            "text-neutral-600 dark:text-neutral-300": !isConnecting,
          })}
        >
          <AnimatePresence>
            {isConnecting && (
              <motion.div
                className="mr-1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, scale: 0 }}
              >
                <LoaderCircle
                  width={18}
                  height={18}
                  className="animate-[spin_0.3s_linear_infinite] text-primary-400"
                />
              </motion.div>
            )}

            {isSuccessfully && (
              <motion.div
                className="mr-1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <CheckIcon />
              </motion.div>
            )}
          </AnimatePresence>

          <motion.div
            className={cn({
              "mr-1": !isConnecting && !isSuccessfully,
              "text-green-600 dark:text-green-500": isSuccessfully,
            })}
            layout
          >
            Connect
          </motion.div>

          <AnimatePresence>
            {(isConnecting || isSuccessfully) && (
              <motion.div
                className={cn("mr-1", {
                  "text-green-600 dark:text-green-500": isSuccessfully,
                })}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {isConnecting ? "ing" : "ed"}
              </motion.div>
            )}
          </AnimatePresence>

          <motion.div layout="position" className="relative flex flex-wrap">
            <span
              className={cn("mr-1", {
                "text-green-600 dark:text-green-500": isSuccessfully,
              })}
            >
              to
            </span>

            {isConnecting ? (
              <span>{aiVendorTextMap[aiVendor]}</span>
            ) : (
              <FlipText>
                <AIVendorGradientText aiVendor={aiVendor} />
              </FlipText>
            )}
          </motion.div>
        </div>
      </div>
    </button>
  );
};

const CheckIcon: React.FC = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      className="fill-none stroke-green-500 scale-125 -translate-x-1"
    >
      <title>Check</title>
      <motion.circle
        cx="12"
        cy="12"
        r="10"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.3 }}
      />
      <motion.path
        d="m9 12 2 2 4-4"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.2, delay: 0.2 }}
      />
    </svg>
  );
};

type AIVendorGradientTextProps = {
  aiVendor: AIVendor;
};

const AIVendorGradientText: React.FC<AIVendorGradientTextProps> = ({
  aiVendor,
}) => {
  const gradientColors: string[] | undefined = useMemo(() => {
    switch (aiVendor) {
      case "chatgpt":
        return [
          "oklch(62.3% 0.214 259.815)",
          "oklch(69.6% 0.17 162.48)",
          "oklch(62.3% 0.214 259.815)",
          "oklch(69.6% 0.17 162.48)",
          "oklch(62.3% 0.214 259.815)",
        ];
      case "claude":
        return [
          "oklch(70.5% 0.213 47.604)",
          "oklch(76.9% 0.188 70.08)",
          "oklch(79.5% 0.184 86.047)",
        ];
      case "deepseek":
        return ["oklch(70.7% 0.165 254.624)", "oklch(70.2% 0.183 293.541)"];
      case "gemini":
        return [
          "oklch(70.4% 0.191 22.216)",
          "oklch(85.2% 0.199 91.936)",
          "oklch(76.5% 0.177 163.223)",
          "oklch(70.7% 0.165 254.624)",
          "oklch(70.4% 0.191 22.216)",
          "oklch(85.2% 0.199 91.936)",
          "oklch(76.5% 0.177 163.223)",
          "oklch(70.7% 0.165 254.624)",
        ];
      case "xai":
        return ["oklch(55.4% 0.046 257.417)", "oklch(55.3% 0.013 58.071)"];
    }
  }, [aiVendor]);

  return (
    <GradientText colors={gradientColors}>
      {aiVendorTextMap[aiVendor]}
    </GradientText>
  );
};

type ParticlesProps = {
  containerX: number;
  containerY: number;
  containerWidth: number;
  containerHeight: number;
};

export const Particles: React.FC<ParticlesProps> = ({
  containerX,
  containerY,
  containerWidth,
  containerHeight,
}) => {
  const particleLeftIds = useMemo(
    () => Array.from({ length: 5 + Math.random() * 2 }, (_, i) => i),
    [],
  );

  const particleTopIds = useMemo(
    () => Array.from({ length: 20 + Math.random() * 5 }, (_, i) => i),
    [],
  );

  const particleRightIds = useMemo(
    () => Array.from({ length: 5 + Math.random() * 2 }, (_, i) => i),
    [],
  );

  const particleBottomIds = useMemo(
    () => Array.from({ length: 20 + Math.random() * 5 }, (_, i) => i),
    [],
  );

  if (!containerWidth || !containerHeight) {
    return;
  }

  return (
    <>
      {particleLeftIds.map((id) => (
        <Particle
          key={id}
          containerX={containerX}
          containerY={containerY}
          containerWidth={containerWidth}
          containerHeight={containerHeight}
          side="left"
        />
      ))}

      {particleTopIds.map((id) => (
        <Particle
          key={id}
          containerX={containerX}
          containerY={containerY}
          containerWidth={containerWidth}
          containerHeight={containerHeight}
          side="top"
        />
      ))}

      {particleRightIds.map((id) => (
        <Particle
          key={id}
          containerX={containerX}
          containerY={containerY}
          containerWidth={containerWidth}
          containerHeight={containerHeight}
          side="right"
        />
      ))}

      {particleBottomIds.map((id) => (
        <Particle
          key={id}
          containerX={containerX}
          containerY={containerY}
          containerWidth={containerWidth}
          containerHeight={containerHeight}
          side="bottom"
        />
      ))}
    </>
  );
};

type Side = "top" | "right" | "bottom" | "left";

type ParticleProps = {
  containerX: number;
  containerY: number;
  containerWidth: number;
  containerHeight: number;
  side?: Side;
};

const Particle: React.FC<ParticleProps> = ({
  containerX,
  containerY,
  containerWidth,
  containerHeight,
  side,
}) => {
  const particleRef = useRef<HTMLDivElement>(null);

  type RandomPointOnRectanglePerimeterParameter = {
    width: number;
    height: number;
    inset?: number;
    particleSize?: number;
    side?: Side;
  };

  const randomPointOnRectanglePerimeter = useEffectEvent(
    ({
      width,
      height,
      inset = 0,
      particleSize = 0,
      side,
    }: RandomPointOnRectanglePerimeterParameter) => {
      const x = inset;
      const y = inset;
      const calculatedWidth = width - 2 * inset;
      const calculatedHeight = height - 2 * inset;

      const perimeter = 2 * (calculatedWidth + calculatedHeight);
      let r = Math.random() * perimeter;

      switch (side) {
        case "top":
          r = Math.random() * calculatedWidth;
          break;
        case "right":
          r = calculatedWidth + Math.random() * calculatedHeight;
          break;
        case "bottom":
          r =
            calculatedWidth +
            calculatedHeight +
            Math.random() * calculatedWidth;
          break;
        case "left":
          r =
            calculatedWidth +
            calculatedHeight +
            calculatedWidth +
            Math.random() * calculatedHeight;
          break;
      }

      // Top edge
      if (r < calculatedWidth) {
        return { x: x + r, y: y };
      }
      r -= calculatedWidth;

      // Right edge
      if (r < calculatedHeight) {
        return {
          x: x + calculatedWidth - particleSize,
          y: y + r - particleSize,
        };
      }
      r -= calculatedHeight;

      // Bottom edge
      if (r < calculatedWidth) {
        return {
          x: x + calculatedWidth - r - particleSize,
          y: y + calculatedHeight - particleSize,
        };
      }
      r -= calculatedWidth;

      // Left edge
      return {
        x: x,
        y: y + calculatedHeight - r,
      };
    },
  );

  // Position the particle
  useLayoutEffect(() => {
    const particle = particleRef.current;

    if (particle) {
      // Generate random size
      const size = 5 + Math.random() * 5;
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;

      // Place it in the center
      particle.style.left = `${containerWidth / 2 - size / 2}px`;
      particle.style.top = `${containerHeight / 2 - size / 2}px`;
    }
  }, [containerWidth, containerHeight]);

  // Animate the particle
  useEffect(() => {
    const particle = particleRef.current;

    if (particle) {
      // Generate random color
      const randomHue = Math.round(Math.random() * 359);
      particle.style.backgroundColor = `oklch(0.85 0.275 ${randomHue})`;

      // Generate random position transition
      const {
        x: particleX,
        y: particleY,
        width: particleWidth,
      } = particle.getBoundingClientRect();
      const { x, y } = randomPointOnRectanglePerimeter({
        width: containerWidth,
        height: containerHeight,
        inset: -5 - 10 * Math.random(),
        particleSize: particleWidth,
        side,
      });

      const timeoutId = setTimeout(() => {
        particle.style.transform = `translate(
          ${x - (particleX - containerX)}px,
          ${y - (particleY - containerY)}px
        )`;
        clearTimeout(timeoutId);
      }, 25);

      // Random twinkle amount
      particle.style.setProperty("--twinkle-amount", `${Math.random()}`);

      // Random twinkle duration
      particle.style.setProperty(
        "--twinkle-duration",
        `${150 + Math.random() * 100}ms`,
      );

      // Random fade out duration
      particle.style.setProperty(
        "--fade-duration",
        `${1500 + Math.random() * 1000}ms`,
      );
    }
  }, [containerX, containerY, containerWidth, containerHeight, side]);

  return (
    <div
      ref={particleRef}
      className="absolute particle z-0 rounded-full duration-300"
    />
  );
};
