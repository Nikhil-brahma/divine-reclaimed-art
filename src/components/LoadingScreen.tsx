import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

const LoadingScreen = ({ onComplete }: { onComplete: () => void }) => {
  const [phase, setPhase] = useState(0); // 0=bloom, 1=glow, 2=fade

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 1200);
    const t2 = setTimeout(() => setPhase(2), 2200);
    const t3 = setTimeout(() => onComplete(), 2800);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [onComplete]);

  return (
    <AnimatePresence>
      {phase < 2 && (
        <motion.div
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-temple-dark"
        >
          {/* Radial glow */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: phase >= 1 ? 2.5 : 1, opacity: phase >= 1 ? 0.3 : 0.15 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="absolute w-64 h-64 rounded-full"
            style={{
              background: "radial-gradient(circle, hsla(42, 85%, 55%, 0.4), hsla(30, 80%, 48%, 0.1), transparent 70%)",
            }}
          />

          {/* Lotus / Diya SVG */}
          <div className="relative">
            {/* Outer petals */}
            {[0, 45, 90, 135, 180, 225, 270, 315].map((deg, i) => (
              <motion.div
                key={deg}
                initial={{ scale: 0, opacity: 0, rotate: deg }}
                animate={{ scale: 1, opacity: 0.6, rotate: deg }}
                transition={{ duration: 0.8, delay: i * 0.08, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="absolute top-1/2 left-1/2 origin-bottom"
                style={{ transform: `translate(-50%, -100%) rotate(${deg}deg)` }}
              >
                <div
                  className="w-4 h-12 rounded-full"
                  style={{
                    background: `linear-gradient(to top, hsl(42 85% 55% / 0.8), hsl(30 80% 48% / 0.2), transparent)`,
                  }}
                />
              </motion.div>
            ))}

            {/* Center flame */}
            <motion.div
              initial={{ scaleY: 0, opacity: 0 }}
              animate={{ scaleY: 1, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="relative z-10 w-6 h-10 mx-auto origin-bottom"
            >
              <motion.div
                animate={{ scaleX: [1, 1.15, 0.9, 1], scaleY: [1, 1.1, 0.95, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="w-full h-full rounded-full"
                style={{
                  background: "radial-gradient(ellipse at bottom, hsl(42 85% 65%), hsl(30 80% 48%), transparent 80%)",
                  filter: "blur(1px)",
                }}
              />
            </motion.div>
          </div>

          {/* Brand name */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: phase >= 1 ? 1 : 0, y: phase >= 1 ? 0 : 20 }}
            transition={{ duration: 0.6 }}
            className="absolute bottom-1/3 font-display text-2xl tracking-[0.3em] text-gold/80"
          >
            PUNARVSU
          </motion.p>

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: phase >= 1 ? 0.5 : 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="absolute bottom-1/3 mt-12 translate-y-10 font-body text-xs tracking-[0.2em] text-ivory/40 uppercase"
          >
            From Temple to Timeless Luxury
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoadingScreen;
