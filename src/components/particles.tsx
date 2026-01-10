import {
  type RefObject,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";

export const useParticles = (containerRef: RefObject<HTMLElement | null>) => {
  const [iconButtonSize, setIconButtonSize] = useState<number>(0);
  const [burstOfParticlesIds, setBurstOfParticlesIds] = useState<number[]>([]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: this is a a ref
  useEffect(() => {
    const button = containerRef.current;
    if (!button) return;

    setIconButtonSize(button.getBoundingClientRect().width);
  }, []);

  const createBurstOfParticles = useCallback(() => {
    const newBurstOfParticlesId = Date.now();

    setBurstOfParticlesIds((prev) => [...prev, newBurstOfParticlesId]);

    setTimeout(() => {
      setBurstOfParticlesIds((prev) =>
        prev.filter((id) => id !== newBurstOfParticlesId),
      );
    }, 2000);
  }, []);

  return {
    iconButtonSize,
    burstOfParticlesIds,
    createBurstOfParticles,
  } as const;
};

type Props = {
  iconButtonSize: number; // Since icon button is always round
};

export const Particles: React.FC<Props> = ({ iconButtonSize }) => {
  const particleIds = useMemo(
    () => Array.from({ length: 25 + Math.random() * 10 }, (_, i) => i),
    [],
  );

  if (!iconButtonSize) {
    return;
  }

  return (
    <>
      {particleIds.map((id) => (
        <Particle key={id} iconButtonSize={iconButtonSize} />
      ))}
    </>
  );
};

const Particle: React.FC<Props> = ({ iconButtonSize }) => {
  const particleRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const particle = particleRef.current;

    if (iconButtonSize && particle) {
      // Generate random size
      const size = 7 + Math.random() * 10;
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;

      // Place it in the center
      particle.style.left = `${(iconButtonSize - size) / 2}px`;
      particle.style.top = `${(iconButtonSize - size) / 2}px`;
    }
  }, [iconButtonSize]);

  useEffect(() => {
    const particle = particleRef.current;

    if (iconButtonSize && particle) {
      // Generate random color
      const randomHue = Math.round(Math.random() * 359);
      particle.style.backgroundColor = `oklch(0.8 0.3 ${randomHue})`;

      // Generate random position transition
      const randomAngle = Math.round(Math.random() * 359);
      const randomDistance =
        iconButtonSize / 2 + (Math.random() * iconButtonSize) / 8;
      const timeoutId = setTimeout(() => {
        particle.style.transform = `translate(
          calc(cos(${randomAngle}deg) * ${randomDistance}px),
          calc(sin(${randomAngle}deg) * ${randomDistance}px)
        )`;
        clearTimeout(timeoutId);
      }, 50);

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
  }, [iconButtonSize]);

  return (
    <div
      ref={particleRef}
      className="absolute particle rounded-full duration-300 ease-out will-change-transform"
    />
  );
};
