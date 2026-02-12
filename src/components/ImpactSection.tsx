import { useEffect, useRef, useState } from "react";
import { motion, useInView, useSpring, useTransform } from "framer-motion";

interface StatItem {
  value: number;
  suffix: string;
  label: string;
  sublabel: string;
  icon: string;
}

const stats: StatItem[] = [
  { value: 12000, suffix: "+", label: "Blessings Carried", sublabel: "Sacred garments transformed into timeless pieces", icon: "🙏" },
  { value: 850, suffix: "+", label: "Artisan Hours", sublabel: "Handcrafted with devotion in every stitch", icon: "✋" },
  { value: 3200, suffix: " kg", label: "Sacred Cloth Collected", sublabel: "Temple textiles saved from disposal", icon: "🧵" },
  { value: 47, suffix: "", label: "Temple Partnerships", sublabel: "Holy sites contributing to circular fashion", icon: "🕉️" },
  { value: 5000, suffix: "+", label: "Devotees Connected", sublabel: "Carrying the divine in their everyday", icon: "💛" },
  { value: 0, suffix: "%", label: "Zero Waste", sublabel: "Every thread finds purpose, nothing is discarded", icon: "♻️" },
];

function AnimatedNumber({ value, suffix, inView }: { value: number; suffix: string; inView: boolean }) {
  const [displayed, setDisplayed] = useState(0);
  const spring = useSpring(0, { stiffness: 30, damping: 20 });
  const rounded = useTransform(spring, (v) => Math.round(v));

  useEffect(() => {
    if (inView) spring.set(value);
  }, [inView, value, spring]);

  useEffect(() => {
    const unsubscribe = rounded.on("change", (v) => setDisplayed(v));
    return unsubscribe;
  }, [rounded]);

  return (
    <span className="tabular-nums">
      {value === 0 ? "0" : displayed.toLocaleString("en-IN")}
      {suffix}
    </span>
  );
}

const ImpactSection = () => {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      ref={ref}
      className="relative py-28 overflow-hidden bg-gradient-sacred"
    >
      {/* Floating particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-gold/30"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -40, 0],
              opacity: [0.2, 0.8, 0.2],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 3 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 3,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Radial glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-saffron/5 blur-[120px]" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Header */}
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <motion.span
            className="font-body text-xs tracking-[0.4em] uppercase text-gold/70 block mb-4"
            initial={{ opacity: 0, letterSpacing: "0.1em" }}
            animate={isInView ? { opacity: 1, letterSpacing: "0.4em" } : {}}
            transition={{ duration: 1.2, delay: 0.2 }}
          >
            Our Sacred Impact
          </motion.span>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-ivory leading-tight">
            Every Number Tells{" "}
            <span className="text-gradient-gold">a Story</span>
          </h2>
          <p className="font-body text-ivory/40 mt-4 max-w-lg mx-auto text-sm">
            Behind every stitch lies a blessing. Behind every product, a prayer answered.
          </p>
        </motion.div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 md:gap-8 max-w-5xl mx-auto">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              className="group relative text-center p-6 md:p-8 rounded-2xl border border-gold/10 bg-ivory/[0.03] backdrop-blur-sm hover:border-gold/30 transition-all duration-500"
              initial={{ opacity: 0, y: 60, scale: 0.9 }}
              animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
              transition={{ duration: 0.7, delay: 0.15 * i, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
            >
              {/* Hover glow */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-gold/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <motion.span
                className="text-3xl md:text-4xl block mb-3"
                animate={isInView ? { rotateY: [0, 360] } : {}}
                transition={{ duration: 1, delay: 0.3 + i * 0.15 }}
              >
                {stat.icon}
              </motion.span>

              <div className="font-display text-3xl md:text-4xl lg:text-5xl text-gold mb-2 relative z-10">
                <AnimatedNumber value={stat.value} suffix={stat.suffix} inView={isInView} />
              </div>

              <h3 className="font-display text-sm md:text-base text-ivory/90 mb-1 relative z-10">
                {stat.label}
              </h3>
              <p className="font-body text-[11px] md:text-xs text-ivory/35 leading-relaxed relative z-10 hidden md:block">
                {stat.sublabel}
              </p>

              {/* Pulse ring on hover */}
              <motion.div
                className="absolute inset-0 rounded-2xl border border-gold/20 opacity-0 group-hover:opacity-100"
                animate={isInView ? { scale: [1, 1.05, 1] } : {}}
                transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
              />
            </motion.div>
          ))}
        </div>

        {/* Bottom tagline */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 1, delay: 1.5 }}
        >
          <div className="ornament-line w-48 mx-auto mb-6" />
          <p className="font-display text-lg md:text-xl text-ivory/50 italic">
            "From the divine to the devoted — nothing is wasted, everything is sacred."
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default ImpactSection;
