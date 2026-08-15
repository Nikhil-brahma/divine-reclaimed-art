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
          Bhagwan Vastra is the sacred cloth used to drape deities in Hindu temples. When the
          fabric completes its spiritual service, most of it is discarded. Punarvsu reclaims it
          from temple partners across Delhi, sanitises it with UV sterilisation and plant-based
          washing, and hands it to women artisans in Rohini who work with Sampurna NGO.
        </p>
        <p className="font-body text-muted-foreground leading-relaxed mb-8">
          What comes back is a handcrafted potli bag — silk, velvet or brocade, one of a kind,
          arriving with a Certificate of Sanctity. No other brand in India makes potli bags this
          way, which is why every Punarvsu piece is genuinely unrepeatable.
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
