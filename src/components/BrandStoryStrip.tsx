import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

const steps = [
  {
    icon: "🛕",
    title: "Poshak Offered",
    text: "Temple offers Poshak to deity with love and prayers.",
  },
  {
    icon: "♻️",
    title: "Fabric Retired",
    text: "Fabric retired — we step in with reverence, not waste.",
  },
  {
    icon: "🧵",
    title: "Artisan Hands",
    text: "Artisan women of Rohini transform it with their hands.",
  },
  {
    icon: "✨",
    title: "Blessings Forward",
    text: "A sacred potli reaches you — carrying blessings forward.",
  },
];

const BrandStoryStrip = () => {
  const isMobile = useIsMobile();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const lineWidth = useTransform(scrollYProgress, [0.1, 0.6], ["0%", "100%"]);

  return (
    <section ref={ref} className="relative py-16 md:py-24 px-4 overflow-hidden" style={{ background: "#0a0804" }}>
      <motion.h2
        className="text-center font-display text-2xl md:text-4xl font-bold mb-14"
        style={{
          background: "linear-gradient(135deg, #c9a84c, #e8d48b, #c9a84c)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        The Sacred Journey
      </motion.h2>

      <div className="max-w-5xl mx-auto relative">
        {/* Golden thread line (desktop) */}
        {!isMobile && (
          <motion.div
            className="absolute top-1/2 left-0 h-px -translate-y-1/2 z-0"
            style={{
              width: lineWidth,
              background: "linear-gradient(90deg, transparent, #c9a84c, #e8d48b, #c9a84c, transparent)",
              filter: "blur(0.5px)",
              boxShadow: "0 0 8px rgba(201,168,76,0.4)",
            }}
          />
        )}

        {/* Vertical golden line (mobile) */}
        {isMobile && (
          <div
            className="absolute left-6 top-0 bottom-0 w-px z-0"
            style={{
              background: "linear-gradient(180deg, transparent, #c9a84c 20%, #c9a84c 80%, transparent)",
            }}
          />
        )}

        <div className={`relative z-10 ${isMobile ? "flex flex-col gap-8 pl-14" : "grid grid-cols-4 gap-6"}`}>
          {steps.map((step, i) => {
            const floatOffsets = [0, -12, 6, -8];
            return (
              <motion.div
                key={step.title}
                className="relative"
                style={!isMobile ? { marginTop: floatOffsets[i] } : {}}
                initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12, duration: 0.6 }}
              >
                {/* Mobile dot on timeline */}
                {isMobile && (
                  <div
                    className="absolute -left-[2.15rem] top-4 w-3 h-3 rounded-full"
                    style={{
                      background: "#c9a84c",
                      boxShadow: "0 0 8px rgba(201,168,76,0.6)",
                    }}
                  />
                )}

                <div
                  className="backdrop-blur-md rounded-xl p-5 md:p-6 text-center md:text-center"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(201,168,76,0.2)",
                  }}
                >
                  <span className="text-3xl md:text-4xl mb-3 block">{step.icon}</span>
                  <h3 className="font-display text-base md:text-lg font-semibold mb-2" style={{ color: "#c9a84c" }}>
                    {step.title}
                  </h3>
                  <p className="text-xs md:text-sm leading-relaxed" style={{ color: "#d4c9a8" }}>
                    {step.text}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default BrandStoryStrip;
