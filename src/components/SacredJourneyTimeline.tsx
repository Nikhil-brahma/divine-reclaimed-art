import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Church, Droplets, Scissors, HandMetal, PackageCheck } from "lucide-react";

const steps = [
  {
    icon: Church,
    title: "Temple Poshak",
    description: "Sacred garments that once adorned temple deities are retired with reverence after years of worship.",
    glow: "hsl(42 85% 55%)",
  },
  {
    icon: Droplets,
    title: "Collected with Reverence",
    description: "Devotees and temples donate each piece. We receive them with gratitude and deep respect for their spiritual journey.",
    glow: "hsl(30 80% 48%)",
  },
  {
    icon: Scissors,
    title: "Hygienically Processed",
    description: "UV sterilisation, eco-friendly washing, and steam treatment — every fibre is purified without losing its sacred character.",
    glow: "hsl(350 55% 45%)",
  },
  {
    icon: HandMetal,
    title: "Handcrafted by Artisans",
    description: "Skilled women artisans led by Kiran Mam at our Rohini workshop carefully stitch, shape, and bring each design to life.",
    glow: "hsl(42 85% 55%)",
  },
  {
    icon: PackageCheck,
    title: "Delivered as Blessing",
    description: "Each piece passes quality checks, receives a Certificate of Sanctity, and reaches you as a tangible blessing.",
    glow: "hsl(30 80% 48%)",
  },
];

const TimelineStep = ({ step, index, total }: { step: typeof steps[0]; index: number; total: number }) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.9", "start 0.3"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.5], [0, 1]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [0.85, 1]);
  const iconScale = useTransform(scrollYProgress, [0, 0.4], [0, 1]);
  const lineProgress = useTransform(scrollYProgress, [0.3, 1], ["0%", "100%"]);

  return (
    <motion.div ref={ref} style={{ opacity, scale }} className="flex gap-6 md:gap-10 relative">
      {/* Icon node */}
      <div className="flex flex-col items-center relative z-10">
        <motion.div
          style={{ scale: iconScale }}
          className="w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center relative"
          whileHover={{ scale: 1.15 }}
        >
          {/* Glow ring */}
          <div
            className="absolute inset-0 rounded-full opacity-30 blur-md"
            style={{ background: step.glow }}
          />
          <div
            className="absolute inset-0 rounded-full border-2"
            style={{ borderColor: step.glow }}
          />
          <div className="absolute inset-1 rounded-full bg-temple-dark" />
          <step.icon className="relative z-10 w-6 h-6 text-gold" />
        </motion.div>

        {/* Connecting line */}
        {index < total - 1 && (
          <div className="w-px flex-1 min-h-[60px] mt-3 bg-border/30 relative overflow-hidden">
            <motion.div
              style={{ height: lineProgress }}
              className="absolute top-0 left-0 w-full"
              transition={{ ease: "easeOut" }}
            >
              <div
                className="w-full h-full"
                style={{
                  background: `linear-gradient(to bottom, ${step.glow}, transparent)`,
                }}
              />
            </motion.div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="pb-12 pt-2">
        <motion.span
          className="font-body text-[10px] tracking-[0.3em] uppercase mb-2 block"
          style={{ color: step.glow }}
        >
          Step {String(index + 1).padStart(2, "0")}
        </motion.span>
        <h3 className="font-display text-2xl md:text-3xl text-ivory mb-2">{step.title}</h3>
        <p className="font-body text-sm text-ivory/60 leading-relaxed max-w-md">
          {step.description}
        </p>
      </div>
    </motion.div>
  );
};

const SacredJourneyTimeline = () => {
  const sectionRef = useRef<HTMLElement>(null);

  return (
    <section ref={sectionRef} className="relative py-32 overflow-hidden">
      {/* Dark sacred background */}
      <div className="absolute inset-0 bg-gradient-sacred" />
      <div className="absolute inset-0 bg-gradient-to-b from-temple-dark/50 via-transparent to-temple-dark/50" />

      {/* Floating orbs */}
      <motion.div
        animate={{ y: [0, -20, 0], opacity: [0.1, 0.2, 0.1] }}
        transition={{ duration: 6, repeat: Infinity }}
        className="absolute top-20 right-[15%] w-32 h-32 rounded-full blur-3xl"
        style={{ background: "hsl(42 85% 55% / 0.1)" }}
      />
      <motion.div
        animate={{ y: [0, 15, 0], opacity: [0.05, 0.15, 0.05] }}
        transition={{ duration: 8, repeat: Infinity, delay: 2 }}
        className="absolute bottom-32 left-[10%] w-48 h-48 rounded-full blur-3xl"
        style={{ background: "hsl(30 80% 48% / 0.08)" }}
      />

      <div className="container mx-auto px-6 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="text-center mb-20"
        >
          <motion.span
            initial={{ opacity: 0, letterSpacing: "0.2em" }}
            whileInView={{ opacity: 1, letterSpacing: "0.4em" }}
            viewport={{ once: true }}
            transition={{ duration: 1.2 }}
            className="font-body text-xs uppercase text-gold mb-4 block"
          >
            The Sacred Journey
          </motion.span>
          <h2 className="font-display text-5xl md:text-7xl font-light text-ivory mb-4">
            From <span className="italic text-gradient-gold">Prayer</span> to{" "}
            <span className="italic text-gradient-gold">Purpose</span>
          </h2>
          <p className="font-body text-ivory/50 max-w-xl mx-auto mt-4">
            Every Punarvsu piece follows a sacred path — from temple to your hands.
          </p>
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: 80 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.3 }}
            className="ornament-line mx-auto mt-8"
          />
        </motion.div>

        {/* Timeline */}
        <div className="max-w-3xl mx-auto">
          {steps.map((step, i) => (
            <TimelineStep key={step.title} step={step} index={i} total={steps.length} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default SacredJourneyTimeline;
