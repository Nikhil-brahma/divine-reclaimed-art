import { motion } from "framer-motion";

const FooterMandala = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Rotating mandala pattern using CSS */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
        className="absolute -right-32 -bottom-32 w-96 h-96 opacity-[0.04]"
      >
        {/* Concentric rings */}
        {[1, 0.75, 0.5, 0.3].map((scale, i) => (
          <div
            key={i}
            className="absolute inset-0 rounded-full border border-gold"
            style={{
              transform: `scale(${scale})`,
              top: `${(1 - scale) * 50}%`,
              left: `${(1 - scale) * 50}%`,
              width: `${scale * 100}%`,
              height: `${scale * 100}%`,
            }}
          />
        ))}
        {/* Radial lines */}
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={`line-${i}`}
            className="absolute top-1/2 left-1/2 w-px h-1/2 bg-gold origin-bottom"
            style={{ transform: `translate(-50%, -100%) rotate(${i * 30}deg)` }}
          />
        ))}
        {/* Petal shapes */}
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={`petal-${i}`}
            className="absolute top-1/2 left-1/2 w-8 h-16 border border-gold rounded-full origin-bottom"
            style={{ transform: `translate(-50%, -100%) rotate(${i * 45}deg)` }}
          />
        ))}
      </motion.div>

      {/* Second smaller mandala */}
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 90, repeat: Infinity, ease: "linear" }}
        className="absolute -left-20 top-10 w-64 h-64 opacity-[0.03]"
      >
        {[1, 0.6, 0.3].map((scale, i) => (
          <div
            key={i}
            className="absolute rounded-full border border-gold"
            style={{
              transform: `scale(${scale})`,
              top: `${(1 - scale) * 50}%`,
              left: `${(1 - scale) * 50}%`,
              width: `${scale * 100}%`,
              height: `${scale * 100}%`,
            }}
          />
        ))}
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={`p2-${i}`}
            className="absolute top-1/2 left-1/2 w-6 h-12 border border-gold rounded-full origin-bottom"
            style={{ transform: `translate(-50%, -100%) rotate(${i * 60}deg)` }}
          />
        ))}
      </motion.div>
    </div>
  );
};

export default FooterMandala;
