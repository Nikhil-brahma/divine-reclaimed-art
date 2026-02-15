import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const comparisons = [
  {
    ordinary: "Mass-produced in factories",
    punarvasu: "Handcrafted from sacred temple textiles",
  },
  {
    ordinary: "Made by machines, forgotten in closets",
    punarvasu: "Made with devotion, cherished for generations",
  },
  {
    ordinary: "A brand logo you wear for status",
    punarvasu: "A blessing you carry for purpose",
  },
  {
    ordinary: "Adds to landfill waste",
    punarvasu: "Gives sacred cloth a second life",
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
            The Choice Is Clear
          </span>
          <h2 className="font-display text-4xl md:text-6xl font-light text-foreground mb-4">
            You Don't Need Another Bag.
            <br />
            <span className="italic text-gradient-gold">You Deserve a Story.</span>
          </h2>
          <div className="ornament-line w-20 mx-auto mt-6" />
        </motion.div>

        {/* Comparison table */}
        <div className="max-w-3xl mx-auto mb-16">
          <div className="grid grid-cols-2 gap-0 rounded-sm overflow-hidden border border-border">
            {/* Headers */}
            <div className="p-4 md:p-6 bg-muted text-center border-b border-r border-border">
              <span className="font-body text-xs tracking-wider uppercase text-muted-foreground">
                Ordinary Bags
              </span>
            </div>
            <div className="p-4 md:p-6 bg-gradient-sacred text-center border-b border-border">
              <span className="font-body text-xs tracking-wider uppercase text-accent">
                Punarvasu
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
                    ✨ {row.punarvasu}
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
            Somewhere, a sacred cloth that witnessed thousands of prayers is waiting to become yours.
            Will you let it pass you by?
          </p>
          <a
            href="#collections"
            className="inline-flex items-center gap-2 bg-gradient-saffron text-primary-foreground px-10 py-4 rounded-sm font-body text-sm tracking-[0.2em] uppercase hover:opacity-90 transition-opacity shadow-sacred"
          >
            Find Your Sacred Piece <ArrowRight className="w-4 h-4" />
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default WhyYouDeserveSection;
