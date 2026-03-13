import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, type ReactNode } from "react";

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  direction?: "up" | "left" | "right" | "scale" | "rotate";
  delay?: number;
  intensity?: number;
}

const ScrollReveal = ({ children, className = "", direction = "up", delay = 0, intensity = 1 }: ScrollRevealProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [80 * intensity, 0, 0, -30 * intensity]);
  const x = useTransform(scrollYProgress, [0, 0.3], [direction === "left" ? -100 * intensity : direction === "right" ? 100 * intensity : 0, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [direction === "scale" ? 0.8 : 1, 1, 1, direction === "scale" ? 0.95 : 1]);
  const rotate = useTransform(scrollYProgress, [0, 0.3], [direction === "rotate" ? 5 * intensity : 0, 0]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0.3]);

  return (
    <motion.div
      ref={ref}
      style={{
        y: direction === "up" ? y : undefined,
        x: direction === "left" || direction === "right" ? x : undefined,
        scale,
        rotate,
        opacity,
      }}
      transition={{ delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

interface ParallaxLayerProps {
  children: ReactNode;
  speed?: number;
  className?: string;
}

export const ParallaxLayer = ({ children, speed = 0.5, className = "" }: ParallaxLayerProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  
  const y = useTransform(scrollYProgress, [0, 1], [0, -100 * speed]);

  return (
    <motion.div ref={ref} style={{ y }} className={className}>
      {children}
    </motion.div>
  );
};

export default ScrollReveal;
