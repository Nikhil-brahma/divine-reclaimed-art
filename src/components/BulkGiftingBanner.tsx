import { motion } from "framer-motion";
import { useIsMobile } from "@/hooks/use-mobile";
import { useMemo } from "react";

interface Petal {
  id: number;
  x: number;
  size: number;
  delay: number;
  duration: number;
  drift: number;
}

const BulkGiftingBanner = () => {
  const isMobile = useIsMobile();
  const petalCount = isMobile ? 8 : 16;

  const petals = useMemo<Petal[]>(() =>
    Array.from({ length: petalCount }, (_, i) => ({
      id: i,
      x: 10 + Math.random() * 80,
      size: 6 + Math.random() * 6,
      delay: Math.random() * 6,
      duration: 8 + Math.random() * 8,
      drift: (Math.random() - 0.5) * 40,
    })),
    [petalCount]
  );

  return (
    <section className="relative py-16 md:py-24 overflow-hidden bg-temple-dark">
      <div
        className="absolute inset-0 opacity-[0.02] pointer-events-none"
        style={{
          backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, hsla(42, 85%, 55%, 0.15) 2px, hsla(42, 85%, 55%, 0.15) 3px)",
        }}
      />
      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center relative z-10">
        {/* Left: animated scene */}
        <div className="relative flex items-center justify-center min-h-[250px] md:min-h-[320px]">
          <div className="absolute w-52 h-28 md:w-72 md:h-40 bottom-[10%] rounded-full bg-gold/10 blur-2xl" />

          {/* Potli arrangement */}
          <div className="relative flex items-end gap-3 md:gap-5 z-10">
            {[
              "hsl(42, 85%, 55%)",
              "hsl(350, 55%, 35%)",
              "hsl(120, 30%, 20%)",
              "hsl(42, 85%, 55%)",
              "hsl(350, 55%, 35%)",
            ].map((color, i) => (
              <motion.div
                key={i}
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 3, delay: i * 0.4, repeat: Infinity, ease: "easeInOut" }}
                className="rounded-[30%_30%_50%_50%/35%_35%_65%_65%]"
                style={{
                  width: isMobile ? 30 + i * 4 : 40 + i * 6,
                  height: isMobile ? 35 + i * 4 : 50 + i * 6,
                  background: `radial-gradient(circle at 40% 35%, ${color}, ${color}88 70%, hsl(20, 12%, 16%))`,
                  boxShadow: `0 0 20px ${color}33`,
                }}
              />
            ))}
          </div>

          {/* Diyas */}
          {[20, 75].map((left, i) => (
            <motion.div
              key={i}
              className="absolute bottom-[8%]"
              style={{ left: `${left}%` }}
              animate={{ opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 2, delay: i * 0.7, repeat: Infinity }}
            >
              <span className="text-xl md:text-2xl">🪔</span>
            </motion.div>
          ))}

          {/* Floating marigold petals */}
          {petals.map((p) => (
            <motion.div
              key={p.id}
              className="absolute rounded-full"
              style={{
                left: `${p.x}%`,
                bottom: 0,
                width: p.size,
                height: p.size,
                background: "radial-gradient(circle, hsl(38, 85%, 50%), hsl(30, 80%, 40%))",
                opacity: 0,
              }}
              animate={{
                y: [0, -(isMobile ? 280 : 360)],
                x: [0, p.drift],
                rotate: [0, 200],
                opacity: [0, 0.7, 0.4, 0],
              }}
              transition={{
                duration: p.duration,
                delay: p.delay,
                repeat: Infinity,
                ease: "linear",
              }}
            />
          ))}
        </div>

        {/* Right: text content */}
        <motion.div
          className="text-center md:text-left"
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <h2 className="font-display text-3xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-gold via-saffron to-gold bg-clip-text text-transparent">
            Planning a Wedding?
          </h2>
          <p className="text-base md:text-lg mb-3 text-ivory/70 font-body">
            50 to 500 potlis — customised, sacred, unforgettable. Bridal gifting that carries a soul.
          </p>
          <p className="text-lg md:text-xl font-semibold mb-6 text-gold font-display">
            Starting ₹350 per potli for bulk orders
          </p>
          <motion.a
            href="/contact"
            className="inline-flex items-center gap-2 px-8 py-3 rounded-md font-semibold text-base font-body bg-secondary text-ivory border border-gold/40 shadow-lg transition-all duration-300 hover:shadow-gold/30 hover:shadow-xl hover:scale-[1.04]"
          >
            Request Bulk Quote →
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
};

export default BulkGiftingBanner;
