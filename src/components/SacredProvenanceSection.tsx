import { motion } from "framer-motion";
import { Shield, Fingerprint, Heart, Sparkles, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const provenanceFeatures = [
  {
    icon: Fingerprint,
    title: "One-of-One Origin",
    description:
      "Every Punarvasu piece is born from a unique sacred textile — no two bags share the same fabric. Your piece carries a story that belongs only to you.",
    accent: "from-primary to-accent",
  },
  {
    icon: Shield,
    title: "Certificate of Sanctity",
    description:
      "Each product ships with a handwritten Provenance Card detailing the temple, the textile's age, and the artisan who transformed it — your proof of sacred authenticity.",
    accent: "from-secondary to-primary",
  },
  {
    icon: Heart,
    title: "Blessing Inside™",
    description:
      "Hidden within every lining is a hand-stamped mantra by our artisans — a silent blessing for the one who carries it. Discovered only by you.",
    accent: "from-accent to-primary",
  },
  {
    icon: Sparkles,
    title: "Living Heritage Number",
    description:
      "Scan the NFC tag on your Punarvasu piece to unlock its full journey: the temple it came from, the hands that crafted it, and the prayers woven into its threads.",
    accent: "from-primary to-secondary",
  },
];

const SacredProvenanceSection = () => {
  return (
    <section className="py-24 bg-gradient-sacred text-primary-foreground relative overflow-hidden">
      {/* Decorative background pattern */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
      }} />

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <span className="font-body text-xs tracking-[0.4em] uppercase text-accent mb-4 block">
            What Makes Us Sacred
          </span>
          <h2 className="font-display text-4xl md:text-6xl font-light mb-4">
            The <span className="italic text-gradient-gold">Punarvasu</span> Promise
          </h2>
          <p className="font-body text-sm md:text-base text-primary-foreground/70 max-w-2xl mx-auto mt-4 leading-relaxed">
            We don't just make bags — we resurrect stories. Every stitch is an act of devotion,
            every piece a bridge between the divine and the everyday.
          </p>
          <div className="ornament-line w-20 mx-auto mt-6" />
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6 lg:gap-8 mb-16">
          {provenanceFeatures.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              className="group relative p-8 rounded-sm border border-primary-foreground/10 backdrop-blur-sm hover:border-accent/30 transition-all duration-500"
            >
              <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${feature.accent} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}>
                <feature.icon className="w-5 h-5 text-primary-foreground" />
              </div>
              <h3 className="font-display text-2xl mb-3">{feature.title}</h3>
              <p className="font-body text-sm text-primary-foreground/60 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Sticky emotional CTA */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <div className="inline-block p-px rounded-sm bg-gradient-to-r from-accent via-primary to-secondary">
            <div className="bg-gradient-sacred rounded-sm px-10 py-8 md:px-16 md:py-10">
              <p className="font-display text-2xl md:text-3xl italic mb-2">
                "You don't buy a Punarvasu — you inherit a blessing."
              </p>
              <p className="font-body text-xs tracking-[0.3em] uppercase text-accent/80 mb-6">
                — From our artisan family to yours
              </p>
              <a
                href="#collections"
                className="inline-flex items-center gap-2 bg-gradient-saffron text-primary-foreground px-8 py-3 rounded-sm font-body text-xs tracking-[0.2em] uppercase hover:opacity-90 transition-opacity"
              >
                Discover Your Piece <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default SacredProvenanceSection;
