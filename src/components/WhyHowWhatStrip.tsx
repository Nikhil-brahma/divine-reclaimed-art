import { motion } from "framer-motion";
import HolographicCard from "@/components/HolographicCard";
import { useIsMobile } from "@/hooks/use-mobile";

const cards = [
  {
    icon: "🛕",
    title: "Sacred Origins",
    text: "Every thread has touched the divine. Sourced from Bhagwan ki Poshak at Khatushyam Delhi Dham — not made, but reborn.",
  },
  {
    icon: "🤝",
    title: "Artisan Reborn",
    text: "UV sanitised, hand-stitched by women artisans at Sampurna NGO Rohini. 35+ years of social purpose in every stitch.",
  },
  {
    icon: "🎁",
    title: "A Blessing You Carry",
    text: "Not just a bag. The vibration of mantras. The history of a temple. Given to you — with intention.",
  },
];

const WhyHowWhatStrip = () => {
  const isMobile = useIsMobile();

  return (
    <section className="relative py-16 md:py-24 px-4 bg-temple-dark">
      {/* Scan lines */}
      <div
        className="absolute inset-0 opacity-[0.02] pointer-events-none"
        style={{
          backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, hsla(42, 85%, 55%, 0.15) 2px, hsla(42, 85%, 55%, 0.15) 3px)",
        }}
      />
      <div className="max-w-6xl mx-auto relative z-10">
        <motion.h2
          className="text-center font-display text-2xl md:text-4xl font-bold mb-12 bg-gradient-to-r from-gold via-saffron to-gold bg-clip-text text-transparent"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          Why · How · What
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {cards.map((card, i) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.6 }}
              whileHover={isMobile ? {} : { y: -8 }}
            >
              <HolographicCard
                className="rounded-xl h-full"
                glowColor="42, 85%, 55%"
              >
                <div className="h-full flex flex-col items-center text-center backdrop-blur-md rounded-xl p-6 md:p-8 bg-foreground/5 border border-gold/20">
                  <span className="text-5xl mb-4 block">{card.icon}</span>
                  <h3 className="font-display text-xl md:text-2xl font-semibold mb-3 text-gold">
                    {card.title}
                  </h3>
                  <p className="text-sm md:text-base leading-relaxed text-ivory/70 font-body">
                    {card.text}
                  </p>
                </div>
              </HolographicCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyHowWhatStrip;
