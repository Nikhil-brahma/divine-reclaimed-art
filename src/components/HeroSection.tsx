import { motion } from "framer-motion";
import { ArrowDown } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={heroBg}
          alt="Sacred textile embroidery"
          className="w-full h-full object-cover"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-sacred opacity-75" />
        <div className="absolute inset-0 bg-gradient-to-t from-temple-dark/90 via-transparent to-temple-dark/40" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="max-w-4xl mx-auto"
        >
          <div className="ornament-line w-24 mx-auto mb-8" />
          
          <h1 className="font-display text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-light text-ivory leading-tight mb-6">
            From Sacred Cloth
            <br />
            <span className="text-gradient-gold font-semibold italic">to Living Art</span>
          </h1>

          <p className="font-body text-base md:text-lg text-ivory/70 max-w-2xl mx-auto mb-10 leading-relaxed">
            We transform blessed temple textiles into extraordinary handcrafted accessories.
            Each piece carries centuries of devotion, reborn as timeless luxury.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a
              href="#collections"
              className="bg-gradient-saffron text-primary-foreground px-8 py-4 rounded-sm font-body text-sm tracking-[0.2em] uppercase hover:opacity-90 transition-opacity shadow-sacred"
            >
              Explore Collection
            </a>
            <a
              href="#story"
              className="border border-ivory/30 text-ivory px-8 py-4 rounded-sm font-body text-sm tracking-[0.2em] uppercase hover:bg-ivory/10 transition-colors"
            >
              Our Story
            </a>
          </div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            <ArrowDown className="text-ivory/50" size={20} />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
