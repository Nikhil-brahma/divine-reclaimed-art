import { motion } from "framer-motion";

const steps = [
  {
    number: "01",
    title: "We Collect the Cloth",
    description: "Devotees and temples like Khatushyam Delhi Dham donate their retired Bhagwan Ki Poshak to us. Every piece arrives with respect.",
  },
  {
    number: "02",
    title: "We Clean It Thoroughly",
    description: "Each fabric goes through UV sterilisation, eco-friendly washing, and steam treatment — so it's perfectly hygienic without losing its character.",
  },
  {
    number: "03",
    title: "Our Designers Get to Work",
    description: "They study the fabric closely, picking out the best motifs, the richest sections, and planning how to highlight what makes each piece special.",
  },
  {
    number: "04",
    title: "The Artisans Bring It to Life",
    description: "This is where the magic happens. Skilled hands stitch, shape, and assemble each bag — combining sacred fabric with quality materials.",
  },
  {
    number: "05",
    title: "We Check Everything Twice",
    description: "Before anything ships, it goes through a thorough quality check. We're picky about this — because you should be too.",
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
            From Temple to You
          </span>
          <h2 className="font-display text-4xl md:text-6xl font-light text-foreground mb-4">
            How It's <span className="italic text-gradient-gold">Made</span>
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
