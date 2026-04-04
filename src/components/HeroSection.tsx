import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowDown } from "lucide-react";
import { useRef, lazy, Suspense } from "react";
import heroBg from "@/assets/hero-bg.jpg";
import TextReveal from "@/components/TextReveal";

const SacredParticles = lazy(() => import("@/components/SacredParticles"));

const HeroSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const bgY = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const bgScale = useTransform(scrollYProgress, [0, 1], [1, 1.2]);
  const textY = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const overlayOpacity = useTransform(scrollYProgress, [0, 0.8], [0.75, 0.95]);

  return (
    <section ref={sectionRef} className="relative min-h-[120vh] flex items-center justify-center overflow-hidden">
      {/* Parallax Background */}
      <motion.div className="absolute inset-0" style={{ y: bgY, scale: bgScale }}>
        <img
          src={heroBg}
          alt="Sacred textile embroidery"
          className="w-full h-full object-cover"
          loading="eager"
        />
      </motion.div>

      {/* Sacred overlay */}
      <motion.div
        className="absolute inset-0 bg-gradient-sacred"
        style={{ opacity: overlayOpacity }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-temple-dark/90 via-transparent to-temple-dark/40" />

      {/* Scan lines for futuristic feel */}
      <div
        className="absolute inset-0 z-[4] pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, hsla(42, 85%, 55%, 0.15) 2px, hsla(42, 85%, 55%, 0.15) 3px)",
        }}
      />

      {/* Incense smoke particles */}
      <div className="absolute bottom-0 left-0 right-0 h-64 z-[3] pointer-events-none overflow-hidden">
        {[0, 1, 2, 3, 4].map((i) => (
          <motion.div
            key={i}
            className="absolute bottom-0 w-1 rounded-full"
            style={{
              left: `${15 + i * 18}%`,
              height: "120px",
              background: "linear-gradient(to top, hsla(42, 85%, 55%, 0.08), transparent)",
              filter: "blur(8px)",
            }}
            animate={{
              y: [0, -80, -160],
              opacity: [0, 0.3, 0],
              scaleX: [1, 2, 3],
            }}
            transition={{
              duration: 6 + i,
              repeat: Infinity,
              delay: i * 1.2,
              ease: "easeOut",
            }}
          />
        ))}
      </div>

      {/* 3D Sacred Particles */}
      <Suspense fallback={null}>
        <SacredParticles className="z-[5]" />
      </Suspense>

      {/* Content */}
      <motion.div
        className="relative z-10 container mx-auto px-6 text-center"
        style={{ y: textY, opacity: textOpacity }}
      >
        <motion.div
          initial={{ opacity: 0, y: 60, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="max-w-5xl mx-auto"
        >
          {/* Animated ornament */}
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: 96 }}
            transition={{ duration: 1.5, delay: 0.3 }}
            className="ornament-line mx-auto mb-8 overflow-hidden"
          />

          <div className="font-display text-5xl sm:text-6xl md:text-8xl lg:text-9xl font-light text-ivory leading-[0.9] mb-8">
            <TextReveal
              text="Because Devotion"
              as="span"
              className="block"
              delay={0.4}
              stagger={0.04}
            />
            <TextReveal
              text="Never Ends."
              as="span"
              className="block text-gradient-gold font-semibold italic mt-2"
              delay={0.9}
              stagger={0.05}
            />
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.8 }}
            className="font-body text-base md:text-lg text-ivory/70 max-w-2xl mx-auto mb-6 leading-relaxed"
          >
            From Temple to Timeless Luxury — Carry Divine Blessings.
            Sacred textiles that once dressed the divine, now handcrafted into bags you'll treasure forever.
          </motion.p>

          {/* Tagline badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 2 }}
            className="inline-block mb-10"
          >
            <span className="font-body text-[10px] tracking-[0.3em] uppercase text-gold/60 px-4 py-2 border border-gold/20 rounded-sm">
              Sustainability Meets Spirituality
            </span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 2.2 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <motion.a
              href="#collections"
              whileHover={{ scale: 1.05, boxShadow: "0 0 40px hsl(30 80% 48% / 0.4)" }}
              whileTap={{ scale: 0.98 }}
              className="bg-gradient-saffron text-primary-foreground px-10 py-5 rounded-sm font-body text-sm tracking-[0.25em] uppercase shadow-sacred relative overflow-hidden group"
            >
              <span className="relative z-10">See the Collection</span>
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-ivory/10 to-transparent"
                animate={{ x: ["-100%", "200%"] }}
                transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
              />
            </motion.a>
            <motion.a
              href="#sacred-journey"
              whileHover={{ scale: 1.05, borderColor: "hsl(42 85% 55% / 0.5)" }}
              whileTap={{ scale: 0.98 }}
              className="border border-ivory/30 text-ivory px-10 py-5 rounded-sm font-body text-sm tracking-[0.25em] uppercase transition-colors"
            >
              The Sacred Journey
            </motion.a>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.5 }}
          className="absolute bottom-16 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <motion.span className="font-body text-[10px] tracking-[0.3em] uppercase text-ivory/40">
            Scroll to explore
          </motion.span>
          <motion.div animate={{ y: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 2 }}>
            <ArrowDown className="text-ivory/40" size={18} />
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
