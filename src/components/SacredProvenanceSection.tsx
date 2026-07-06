import { motion } from "framer-motion";
import { Shield, Fingerprint, Heart, Sparkles, ArrowRight } from "lucide-react";

const provenanceFeatures = [
  {
    icon: Fingerprint,
    title: "Rooted in Devotion",
    description:
      "These aren't just fabrics we picked off a shelf. They come from temples — places where people have prayed, celebrated, and found peace for years. That energy? It stays in every thread.",
    accent: "from-primary to-accent",
  },
  {
    icon: Shield,
    title: "A Card That Tells You Everything",
    description:
      "Every bag comes with a handwritten Provenance Card. It tells you which temple the fabric came from, how old it is, and who crafted your piece. No mystery — just honesty.",
    accent: "from-secondary to-primary",
  },
  {
    icon: Heart,
    title: "Blessed by Intention™",
    description:
      "Our artisans don't just stitch — they sit down, take a moment, and begin each piece with quiet intention. The care that went into the original textile carries forward into what you hold.",
    accent: "from-accent to-primary",
  },
  {
    icon: Sparkles,
    title: "Trace Its Journey",
    description:
      "Each piece has an NFC tag. Tap it with your phone and you'll see the full story — where the fabric came from, whose hands shaped it, and the prayers it witnessed.",
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
            Why People Trust Us
          </span>
          <h2 className="font-display text-4xl md:text-6xl font-light mb-4">
            What Makes <span className="italic text-gradient-gold">Punarvsu</span> Different
          </h2>
          <p className="font-body text-sm md:text-base text-primary-foreground/70 max-w-2xl mx-auto mt-4 leading-relaxed">
            We're not trying to be another bag brand. We take sacred cloth that would otherwise be discarded,
            and give it a second life — with full transparency about where it comes from.
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

        {/* Emotional CTA */}
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
                "It's not just a bag. It's something you feel."
              </p>
              <p className="font-body text-xs tracking-[0.3em] uppercase text-accent/80 mb-6">
                — That's what our customers keep telling us
              </p>
              <a
                href="/#collections"
                className="inline-flex items-center gap-2 bg-gradient-saffron text-primary-foreground px-8 py-3 rounded-sm font-body text-xs tracking-[0.2em] uppercase hover:opacity-90 transition-opacity"
              >
                See for Yourself <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default SacredProvenanceSection;
