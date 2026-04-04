import { motion } from "framer-motion";
import { Heart, Leaf, Gift } from "lucide-react";

const columns = [
  {
    icon: Heart,
    label: "The Origin",
    heading: "Born in the Temples",
    body: "Born in the temples of Delhi, Punarvsu was created to ensure that sacred fabrics are given a second life, not a landfill.",
    tag: "WHY",
  },
  {
    icon: Leaf,
    label: "The Craft",
    heading: "Reclaimed with Reverence",
    body: "Each bag is UV-sanitized and hand-stitched at the Sampurna NGO workshop, empowering women through dignified work.",
    tag: "HOW",
  },
  {
    icon: Gift,
    label: "The Gift",
    heading: "A Blessing You Can Carry",
    body: "A perfect, meaningful favor for weddings and festivities that your guests will cherish as a blessing.",
    tag: "WHAT",
  },
];

const WhyHowWhatSection = () => {
  return (
    <section id="why-how-what" className="py-24 md:py-32 bg-background relative">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <span className="font-body text-xs uppercase tracking-[0.3em] text-primary mb-4 block">
            Our Purpose
          </span>
          <h2 className="font-display text-3xl md:text-5xl font-light text-foreground leading-tight">
            What Makes This <span className="text-gradient-gold italic">Sacred</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 max-w-5xl mx-auto">
          {columns.map((col, i) => (
            <motion.div
              key={col.tag}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7, delay: i * 0.15 }}
              className="text-center group"
            >
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full border border-primary/30 mb-6 group-hover:border-primary/60 transition-colors">
                <col.icon className="w-6 h-6 text-primary" />
              </div>

              <span className="font-body text-[10px] tracking-[0.3em] uppercase text-primary/60 block mb-2">
                {col.tag} — {col.label}
              </span>

              <div className="w-8 h-px bg-primary/30 mx-auto mb-4" />

              <h3 className="font-display text-xl md:text-2xl font-light text-foreground mb-4">
                {col.heading}
              </h3>

              <p className="font-body text-sm text-muted-foreground leading-relaxed max-w-xs mx-auto">
                {col.body}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyHowWhatSection;
