import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

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

const ProcessStep = ({ step, index }: { step: typeof steps[0]; index: number }) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.95", "start 0.4"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.4, 1], [0, 1, 1]);
  const x = useTransform(scrollYProgress, [0, 0.6], [index % 2 === 0 ? -40 : 40, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [0.95, 1]);
  const numberScale = useTransform(scrollYProgress, [0, 0.4], [0.7, 1]);
  const lineHeight = useTransform(scrollYProgress, [0.2, 1], ["0%", "100%"]);

  return (
    <motion.div
      ref={ref}
      style={{ opacity, x, scale }}
      className="flex gap-6 md:gap-10 mb-16 last:mb-0"
    >
      <div className="flex flex-col items-center relative">
        <motion.span
          style={{ scale: numberScale }}
          className="font-display text-4xl md:text-5xl text-gradient-gold font-semibold relative z-10"
        >
          {step.number}
        </motion.span>
        {index < steps.length - 1 && (
          <div className="w-px flex-1 mt-3 bg-border relative overflow-hidden">
            <motion.div
              style={{ height: lineHeight }}
              className="absolute top-0 left-0 w-full bg-gradient-to-b from-gold to-transparent"
            />
          </div>
        )}
      </div>
      <div className="pb-8">
        <h3 className="font-display text-2xl md:text-3xl text-foreground mb-3">{step.title}</h3>
        <p className="font-body text-muted-foreground leading-relaxed text-base">
          {step.description}
        </p>
      </div>
    </motion.div>
  );
};

const ProcessSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const bgY = useTransform(scrollYProgress, [0, 1], [30, -30]);

  return (
    <section ref={sectionRef} id="process" className="py-32 bg-card relative overflow-hidden">
      {/* Floating decorative elements */}
      <motion.div
        style={{ y: bgY }}
        className="absolute top-20 right-10 w-40 h-40 rounded-full border border-gold/10 opacity-30"
      />
      <motion.div
        style={{ y: useTransform(scrollYProgress, [0, 1], [-20, 20]) }}
        className="absolute bottom-40 left-10 w-24 h-24 rounded-full border border-gold/10 opacity-20"
      />

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="text-center mb-20"
        >
          <motion.span
            initial={{ opacity: 0, letterSpacing: "0.2em" }}
            whileInView={{ opacity: 1, letterSpacing: "0.4em" }}
            viewport={{ once: true }}
            transition={{ duration: 1.2 }}
            className="font-body text-xs uppercase text-primary mb-4 block"
          >
            From Temple to You
          </motion.span>
          <h2 className="font-display text-5xl md:text-7xl font-light text-foreground mb-4">
            How It's <span className="italic text-gradient-gold">Made</span>
          </h2>
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: 80 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.3 }}
            className="ornament-line mx-auto mt-6"
          />
        </motion.div>

        <div className="max-w-4xl mx-auto">
          {steps.map((step, i) => (
            <ProcessStep key={step.number} step={step} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProcessSection;
