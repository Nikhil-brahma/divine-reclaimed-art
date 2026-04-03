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
    <section className="relative py-16 md:py-24 px-4" style={{ background: "#0a0804" }}>
      <div className="max-w-6xl mx-auto">
        <motion.h2
          className="text-center font-display text-2xl md:text-4xl font-bold mb-12"
          style={{
            background: "linear-gradient(135deg, #c9a84c, #e8d48b, #c9a84c)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
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
                className="rounded-xl p-6 md:p-8 h-full"
                glowColor="42, 85%, 55%"
              >
                <div
                  className="h-full flex flex-col items-center text-center backdrop-blur-md rounded-xl"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(201,168,76,0.2)",
                    padding: "2rem 1.5rem",
                  }}
                >
                  <span className="text-5xl mb-4 block">{card.icon}</span>
                  <h3
                    className="font-display text-xl md:text-2xl font-semibold mb-3"
                    style={{ color: "#c9a84c" }}
                  >
                    {card.title}
                  </h3>
                  <p className="text-sm md:text-base leading-relaxed" style={{ color: "#d4c9a8" }}>
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
