import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

interface SectionDividerProps {
  variant?: "gold" | "sacred" | "subtle";
}

const SectionDivider = ({ variant = "gold" }: SectionDividerProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const width = useTransform(scrollYProgress, [0, 0.5], ["0%", "100%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);

  const gradients = {
    gold: "linear-gradient(90deg, transparent, hsl(42 85% 55%), hsl(30 80% 48%), hsl(42 85% 55%), transparent)",
    sacred: "linear-gradient(90deg, transparent, hsl(350 55% 35%), hsl(42 85% 55%), hsl(350 55% 35%), transparent)",
    subtle: "linear-gradient(90deg, transparent, hsl(35 20% 85%), transparent)",
  };

  return (
    <div ref={ref} className="relative py-8 flex items-center justify-center overflow-hidden">
      <motion.div
        style={{ width, opacity }}
        className="h-px max-w-lg"
        transition={{ duration: 0.5 }}
      >
        <div className="w-full h-full" style={{ background: gradients[variant] }} />
      </motion.div>
      <motion.div
        style={{ opacity }}
        className="absolute w-2 h-2 rotate-45 border border-gold/40"
      />
    </div>
  );
};

export default SectionDivider;
