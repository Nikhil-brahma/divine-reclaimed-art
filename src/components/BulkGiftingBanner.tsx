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
    <section className="relative py-16 md:py-24 overflow-hidden" style={{ background: "#0a0804" }}>
      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">
        {/* Left: animated scene */}
        <div className="relative flex items-center justify-center min-h-[280px] md:min-h-[360px]">
          {/* Thaal glow */}
          <div
            className="absolute rounded-full"
            style={{
              width: isMobile ? 200 : 280,
              height: isMobile ? 120 : 160,
              bottom: "10%",
              background: "radial-gradient(ellipse, rgba(201,168,76,0.15) 0%, transparent 70%)",
              filter: "blur(15px)",
            }}
          />

          {/* Potli arrangement */}
          <div className="relative flex items-end gap-3 md:gap-5 z-10">
            {["#c9a84c", "#8b0000", "#1a4a1a", "#c9a84c", "#8b0000"].map((color, i) => (
              <motion.div
                key={i}
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 3, delay: i * 0.4, repeat: Infinity, ease: "easeInOut" }}
                style={{
                  width: isMobile ? 30 + i * 4 : 40 + i * 6,
                  height: isMobile ? 35 + i * 4 : 50 + i * 6,
                  background: `radial-gradient(circle at 40% 35%, ${color}, ${color}88 70%, #1a1206)`,
                  borderRadius: "30% 30% 50% 50% / 35% 35% 65% 65%",
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
                background: `radial-gradient(circle, #e8a317, #c9761c)`,
                opacity: 0.7,
              }}
              animate={{
                y: [0, -(isMobile ? 300 : 400)],
                x: [0, p.drift],
                rotate: [0, 200],
                opacity: [0, 0.8, 0.5, 0],
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
          <h2
            className="font-display text-3xl md:text-5xl font-bold mb-4"
            style={{
              background: "linear-gradient(135deg, #c9a84c, #e8d48b)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Planning a Wedding?
          </h2>
          <p className="text-base md:text-lg mb-3" style={{ color: "#d4c9a8" }}>
            50 to 500 potlis — customised, sacred, unforgettable. Bridal gifting that carries a soul.
          </p>
          <p className="text-lg md:text-xl font-semibold mb-6" style={{ color: "#c9a84c" }}>
            Starting ₹350 per potli for bulk orders
          </p>
          <motion.a
            href="/contact"
            className="inline-flex items-center gap-2 px-8 py-3 rounded-md font-semibold text-base transition-all"
            style={{
              background: "#8b0000",
              color: "#f5f0e1",
              border: "1.5px solid #c9a84c",
              boxShadow: "0 0 20px rgba(139,0,0,0.3)",
            }}
            whileHover={{
              boxShadow: "0 0 35px rgba(201,168,76,0.5)",
              scale: 1.04,
            }}
          >
            Request Bulk Quote →
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
};

export default BulkGiftingBanner;
