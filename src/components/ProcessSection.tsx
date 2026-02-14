import { motion } from "framer-motion";

const steps = [
  {
    number: "01",
    title: "Collection",
    description: "We partner with devotees and temples like Khatushyam Delhi Dham who generously donate their retired Bhagwan Ki Poshak.",
  },
  {
    number: "02",
    title: "Sanitization",
    description: "Each piece is carefully sanitized using gentle, eco-friendly methods to preserve the fabric's integrity.",
  },
  {
    number: "03",
    title: "Design & Cutting",
    description: "Our designers identify the most beautiful sections, ensuring key motifs and embellishments are highlighted.",
  },
  {
    number: "04",
    title: "Handcrafting",
    description: "Skilled artisans meticulously handcraft each bag, combining sacred fabric with premium materials.",
  },
  {
    number: "05",
    title: "Quality Check",
    description: "Every finished piece undergoes thorough quality inspection to meet our highest standards.",
  },
];

const ProcessSection = () => {
  return (
    <section id="process" className="py-24 bg-card">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <span className="font-body text-xs tracking-[0.4em] uppercase text-primary mb-4 block">
            Our Sacred Process
          </span>
          <h2 className="font-display text-4xl md:text-6xl font-light text-foreground mb-4">
            The Art of <span className="italic text-gradient-gold">Upcycling</span>
          </h2>
          <div className="ornament-line w-20 mx-auto mt-6" />
        </motion.div>

        <div className="max-w-4xl mx-auto">
          {steps.map((step, i) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="flex gap-6 md:gap-10 mb-12 last:mb-0"
            >
              <div className="flex flex-col items-center">
                <span className="font-display text-3xl md:text-4xl text-gradient-gold font-semibold">
                  {step.number}
                </span>
                {i < steps.length - 1 && (
                  <div className="w-px flex-1 mt-3 bg-gradient-to-b from-gold/30 to-transparent" />
                )}
              </div>
              <div className="pb-8">
                <h3 className="font-display text-2xl text-foreground mb-2">{step.title}</h3>
                <p className="font-body text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProcessSection;
