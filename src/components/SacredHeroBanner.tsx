import { motion } from "framer-motion";
import { useIsMobile } from "@/hooks/use-mobile";
import { useMemo } from "react";

const PARTICLE_COLORS = [
  "hsl(42, 85%, 55%)",   // gold
  "hsl(42, 85%, 55%)",
  "hsl(30, 80%, 48%)",   // saffron
  "hsl(350, 55%, 35%)",  // crimson
  "hsl(350, 55%, 35%)",
  "hsl(120, 30%, 20%)",  // emerald
];

interface Particle {
  id: number;
  x: number;
  size: number;
  color: string;
  delay: number;
  duration: number;
  drift: number;
  rotation: number;
}

const SacredHeroBanner = () => {
  const isMobile = useIsMobile();
  const particleCount = isMobile ? 12 : 28;

  const particles = useMemo<Particle[]>(() =>
    Array.from({ length: particleCount }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      size: 4 + Math.random() * 8,
      color: PARTICLE_COLORS[Math.floor(Math.random() * PARTICLE_COLORS.length)],
      delay: Math.random() * 8,
      duration: 10 + Math.random() * 12,
      drift: (Math.random() - 0.5) * 60,
      rotation: Math.random() * 360,
    })),
    [particleCount]
  );

  return (
    <section className="relative w-full py-20 md:py-28 flex flex-col items-center justify-center overflow-hidden bg-temple-dark">
      {/* Gradient overlay matching existing sacred style */}
      <div className="absolute inset-0 bg-gradient-to-b from-temple-dark via-temple-dark/95 to-temple-dark" />
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, hsla(42, 85%, 55%, 0.15) 2px, hsla(42, 85%, 55%, 0.15) 3px)",
        }}
      />

      {/* Anti-gravity particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {particles.map((p) => (
          <motion.div
            key={p.id}
            className="absolute rounded-sm"
            style={{
              left: `${p.x}%`,
              bottom: "-20px",
              width: p.size,
              height: p.size * 1.4,
              background: p.color,
              filter: "blur(0.5px)",
              opacity: 0,
            }}
            animate={{
              y: [0, -600],
              x: [0, p.drift],
              rotate: [0, p.rotation],
              opacity: [0, 0.6, 0.4, 0],
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

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center px-4 max-w-3xl mx-auto">
        {/* Golden halo */}
        <div className="absolute -top-10 w-48 h-48 md:w-64 md:h-64 rounded-full bg-gold/10 blur-3xl pointer-events-none" />

        {/* 3D rotating potli silhouette */}
        <motion.div
          className="relative mb-8"
          style={{ perspective: 800 }}
          animate={{ rotateY: [0, 360] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        >
          <div
            className="flex items-center justify-center relative"
            style={{
              width: isMobile ? 90 : 120,
              height: isMobile ? 90 : 120,
              background: "radial-gradient(circle at 40% 35%, hsl(42, 85%, 55%) 0%, hsl(38, 70%, 40%) 40%, hsl(20, 12%, 16%) 100%)",
              borderRadius: "35% 35% 50% 50% / 40% 40% 60% 60%",
              boxShadow: "0 0 60px hsla(42, 85%, 55%, 0.35), inset 0 -10px 30px rgba(0,0,0,0.5)",
            }}
          >
            <div
              className="absolute"
              style={{
                width: "30%",
                height: "12%",
                background: "hsl(350, 55%, 35%)",
                borderRadius: "50%",
                top: "22%",
                boxShadow: "0 0 10px hsla(350, 55%, 35%, 0.5)",
              }}
            />
          </div>
        </motion.div>

        {/* Headline */}
        <motion.h2
          className="font-display text-3xl md:text-5xl lg:text-6xl font-bold leading-tight mb-4 bg-gradient-to-r from-gold via-saffron to-gold bg-clip-text text-transparent"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.2 }}
        >
          Mandir Ki Poshak Ko
          <br />
          Dustbin Se Bachaya.
        </motion.h2>

        {/* Subheadline */}
        <motion.p
          className="text-ivory/80 text-base md:text-lg max-w-xl mb-8 font-body"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.4 }}
        >
          Handcrafted potlis from sacred temple fabric — for weddings, gifting &amp; conscious souls.
        </motion.p>

        {/* CTA */}
        <motion.a
          href="#collections"
          className="inline-flex items-center gap-2 px-8 py-3 rounded-md font-semibold text-base font-body bg-secondary text-ivory border border-gold/40 shadow-lg transition-all duration-300 hover:shadow-gold/30 hover:shadow-xl hover:scale-[1.04]"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          Shop Bridal Collection →
        </motion.a>
      </div>

      {/* Trust bar */}
      <motion.div
        className="relative z-10 mt-12 flex flex-wrap justify-center gap-4 md:gap-8 px-4 text-xs md:text-sm text-gold"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.8, duration: 1 }}
      >
        {[
          { icon: "🛕", label: "Temple Sourced" },
          { icon: "♻️", label: "UV Sanitised" },
          { icon: "🤝", label: "Artisan Made" },
          { icon: "🎁", label: "Bulk Orders" },
        ].map((item) => (
          <span key={item.label} className="flex items-center gap-1.5 whitespace-nowrap">
            <span className="text-base">{item.icon}</span>
            {item.label}
          </span>
        ))}
      </motion.div>
    </section>
  );
};

export default SacredHeroBanner;
