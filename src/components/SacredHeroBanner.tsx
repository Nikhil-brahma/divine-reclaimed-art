import { motion } from "framer-motion";
import { useIsMobile } from "@/hooks/use-mobile";
import { useMemo } from "react";

const PARTICLE_COLORS = [
  "#c9a84c", "#c9a84c", "#c9a84c",
  "#8b0000", "#8b0000",
  "#1a4a1a",
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
    <section
      className="relative w-full min-h-screen flex flex-col items-center justify-center overflow-hidden"
      style={{ background: "#0a0804" }}
    >
      {/* Anti-gravity particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {particles.map((p) => (
          <motion.div
            key={p.id}
            className="absolute rounded-sm opacity-60"
            style={{
              left: `${p.x}%`,
              bottom: "-20px",
              width: p.size,
              height: p.size * 1.4,
              background: p.color,
              filter: "blur(0.5px)",
            }}
            animate={{
              y: [0, -window.innerHeight * 1.3],
              x: [0, p.drift],
              rotate: [0, p.rotation],
              opacity: [0, 0.7, 0.5, 0],
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

      {/* Potli silhouette with golden glow */}
      <div className="relative z-10 flex flex-col items-center text-center px-4">
        {/* Golden halo */}
        <div
          className="absolute rounded-full"
          style={{
            width: isMobile ? 180 : 260,
            height: isMobile ? 180 : 260,
            top: isMobile ? -20 : -40,
            background: "radial-gradient(circle, rgba(201,168,76,0.25) 0%, rgba(201,168,76,0.08) 40%, transparent 70%)",
            filter: "blur(20px)",
          }}
        />

        {/* 3D rotating potli */}
        <motion.div
          className="relative mb-6"
          style={{ perspective: 800 }}
          animate={{ rotateY: [0, 360] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        >
          <div
            className="flex items-center justify-center"
            style={{
              width: isMobile ? 100 : 140,
              height: isMobile ? 100 : 140,
              background: "radial-gradient(circle at 40% 35%, #c9a84c 0%, #8b6914 40%, #3d2e0a 100%)",
              borderRadius: "35% 35% 50% 50% / 40% 40% 60% 60%",
              boxShadow: "0 0 60px rgba(201,168,76,0.4), inset 0 -10px 30px rgba(0,0,0,0.5)",
            }}
          >
            <div
              style={{
                width: "30%",
                height: "12%",
                background: "#8b0000",
                borderRadius: "50%",
                position: "absolute",
                top: "22%",
                boxShadow: "0 0 10px rgba(139,0,0,0.5)",
              }}
            />
          </div>
        </motion.div>

        {/* Headline */}
        <motion.h1
          className="font-display text-3xl md:text-5xl lg:text-6xl font-bold leading-tight mb-4"
          style={{
            background: "linear-gradient(135deg, #c9a84c 0%, #e8d48b 40%, #c9a84c 60%, #8b6914 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            textShadow: "none",
          }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
        >
          Mandir Ki Poshak Ko
          <br />
          Dustbin Se Bachaya.
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          className="text-base md:text-lg max-w-xl mb-8"
          style={{ color: "#f5f0e1" }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.6 }}
        >
          Handcrafted potlis from sacred temple fabric — for weddings, gifting &amp; conscious souls.
        </motion.p>

        {/* CTA */}
        <motion.a
          href="#collections"
          className="inline-flex items-center gap-2 px-8 py-3 rounded-md font-semibold text-base transition-all duration-300"
          style={{
            background: "#8b0000",
            color: "#f5f0e1",
            border: "1.5px solid #c9a84c",
            boxShadow: "0 0 20px rgba(139,0,0,0.3)",
          }}
          whileHover={{
            boxShadow: "0 0 35px rgba(201,168,76,0.5), 0 0 20px rgba(139,0,0,0.4)",
            scale: 1.04,
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
        >
          Shop Bridal Collection →
        </motion.a>
      </div>

      {/* Trust bar */}
      <motion.div
        className="absolute bottom-6 left-0 right-0 z-10 flex flex-wrap justify-center gap-4 md:gap-8 px-4 text-xs md:text-sm"
        style={{ color: "#c9a84c" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.3, duration: 1 }}
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
