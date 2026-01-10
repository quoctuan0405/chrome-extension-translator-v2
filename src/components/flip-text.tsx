import { motion, type Transition, type Variants } from "motion/react";
import { useEffect, useState } from "react";
import { usePrevious } from "../utils/use-previous";

type Props = {
  noAnimation?: boolean;
  children?: React.ReactNode;
};

export const FlipText: React.FC<Props> = ({
  children,
  noAnimation = false,
}) => {
  const flipToFrontVariants: Variants = {
    initial: {
      opacity: 0,
      rotateX: 90,
      y: "-50%",
    },
    animate: {
      opacity: 1,
      rotateX: 0,
      y: "0%",
    },
  };

  const flipAwayVariants: Variants = {
    initial: {
      opacity: 1,
      rotateX: 0,
      y: "0%",
    },
    animate: {
      opacity: 0,
      rotateX: 90,
      y: "50%",
    },
  };

  const transition: Transition = {
    type: "spring",
    stiffness: 280,
    damping: 20,
    duration: noAnimation ? 0 : 0.2,
  };

  const previousChildren = usePrevious(children);

  const [animationKey, setAnimationKey] = useState<string>(`${Date.now()}`);
  const previousAnimationKey = usePrevious(animationKey);

  // biome-ignore lint/correctness/useExhaustiveDependencies: set new text key to force rerender when children change
  useEffect(() => {
    setAnimationKey(`${Date.now()}`);
  }, [children]);

  return (
    <div className="relative">
      <motion.div
        key={animationKey}
        className="absolute w-max"
        initial="initial"
        animate="animate"
        variants={flipToFrontVariants}
        transition={transition}
      >
        {children}
      </motion.div>

      <motion.div
        key={previousAnimationKey}
        className="absolute w-max"
        initial="initial"
        animate="animate"
        variants={flipAwayVariants}
        transition={transition}
      >
        {previousChildren}
      </motion.div>

      <div className="invisible">{children}</div>
    </div>
  );
};
