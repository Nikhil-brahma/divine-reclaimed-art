import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const comparisons = [
  {
    ordinary: "Made in a factory, thousands at a time",
    punarvsu: "Handcrafted one by one from sacred temple cloth",
  },
  {
    ordinary: "Sits in your closet, forgotten after a month",
    punarvsu: "Gets compliments everywhere — and sparks real conversations",
  },
  {
    ordinary: "A logo you wear to fit in",
    punarvsu: "A story you carry because it matters to you",
  },
  {
    ordinary: "Ends up in a landfill eventually",
    punarvsu: "Gives beautiful fabric a second chance at life",
  },
];

const WhyYouDeserveSection = () => {
  return (
    <section className="py-24 bg-background relative overflow-hidden">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="font-body text-xs tracking-[0.4em] uppercase text-muted-foreground mb-4 block">
            Think About It
          </span>
          <h2 className="font-display text-4xl md:text-6xl font-light text-foreground mb-4">
            You Already Have Enough Bags.
            <br />
            <span className="italic text-gradient-gold">This One's Different.</span>
          </h2>
          <div className="ornament-line w-20 mx-auto mt-6" />
        </motion.div>

        {/* Comparison table */}
        <div className="max-w-3xl mx-auto mb-16">
          <div className="grid grid-cols-2 gap-0 rounded-sm overflow-hidden border border-border">
            {/* Headers */}
            <div className="p-4 md:p-6 bg-muted text-center border-b border-r border-border">
              <span className="font-body text-xs tracking-wider uppercase text-muted-foreground">
                Regular Bags
              </span>
            </div>
            <div className="p-4 md:p-6 bg-gradient-sacred text-center border-b border-border">
              <span className="font-body text-xs tracking-wider uppercase text-accent">
                Punarvsu
              </span>
            </div>

            {/* Rows */}
            {comparisons.map((row, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="contents"
              >
                <div className="p-4 md:p-6 border-b border-r border-border flex items-center justify-center text-center">
                  <p className="font-body text-sm text-muted-foreground line-through decoration-destructive/30">
                    {row.ordinary}
                  </p>
                </div>
                <div className="p-4 md:p-6 border-b border-border flex items-center justify-center text-center bg-card">
                  <p className="font-body text-sm text-foreground font-medium">
                    ✨ {row.punarvsu}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Emotional closer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto"
        >
          <p className="font-display text-xl md:text-2xl text-foreground/80 italic mb-8 leading-relaxed">
            Right now, a piece of sacred cloth — one that's been part of someone's prayers
            for years — is waiting to become something you'll love carrying.
          </p>
          <a
            href="#collections"
            className="inline-flex items-center gap-2 bg-gradient-saffron text-primary-foreground px-10 py-4 rounded-sm font-body text-sm tracking-[0.2em] uppercase hover:opacity-90 transition-opacity shadow-sacred"
          >
            Browse the Collection <ArrowRight className="w-4 h-4" />
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default WhyYouDeserveSection;
