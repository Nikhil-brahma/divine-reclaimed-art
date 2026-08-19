import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const BhagwanVastraStory = () => (
  <section id="bhagwan-vastra" className="py-20 md:py-24 bg-background">
    <div className="container mx-auto px-6 max-w-3xl text-center">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.7 }}
      >
        <span className="font-body text-xs tracking-[0.4em] uppercase text-primary/70 block mb-3">
          Where It All Begins
        </span>
        <h2 className="font-display text-4xl md:text-6xl font-light text-foreground mb-6">
          The Story Behind <span className="italic text-gradient-gold">Bhagwan Vastra</span>
        </h2>
        <div className="ornament-line mx-auto mb-8 w-20" />
        <p className="font-body text-muted-foreground leading-relaxed mb-4">
          Bhagwan Vastra is the sacred fabric used to drape deities at Hindu temples. At Punarvsu,
          we respectfully reclaim this cloth after its divine service, sanitise it using UV
          sterilisation and plant-based washing, and transform it into handcrafted potli bags that
          carry meaning far beyond their form.
        </p>
        <p className="font-body text-muted-foreground leading-relaxed mb-8">
          Every bag is made by Kiran Mam and her team at Sampurna NGO in Rohini, Delhi — an
          organisation with 35+ years of work empowering women through craft. When you buy a
          Punarvsu bag, you support sacred heritage, the livelihood of women artisans, and
          sustainable fashion.
        </p>

        <Link
          to="/about"
          className="inline-block font-body text-[11px] tracking-[0.25em] uppercase text-primary border border-primary/30 px-8 py-4 rounded-sm hover:bg-primary/10 transition-colors"
        >
          Read the full story
        </Link>
      </motion.div>
    </div>
  </section>
);

export default BhagwanVastraStory;
