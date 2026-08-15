import { motion } from "framer-motion";
import { Sparkles, Scissors, Recycle, Truck } from "lucide-react";

const items = [
  { icon: Sparkles, label: "Sacred Origin", sub: "Real Bhagwan Vastra" },
  { icon: Scissors, label: "Handstitched", sub: "8–15 hours per bag" },
  { icon: Recycle, label: "Eco-Upcycled", sub: "3,200+ kg saved" },
  { icon: Truck, label: "Free Shipping", sub: "On orders above ₹999" },
];

const UspStrip = () => (
  <section aria-label="Why shop Punarvsu" className="border-y border-border/60 bg-card/50 py-8">
    <div className="container mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-6">
      {items.map((it, i) => (
        <motion.div
          key={it.label}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: i * 0.06 }}
          className="flex items-center gap-3"
        >
          <span className="inline-flex w-10 h-10 shrink-0 items-center justify-center rounded-full border border-primary/25 text-primary">
            <it.icon size={16} aria-hidden="true" />
          </span>
          <span>
            <span className="block font-body text-[11px] tracking-[0.2em] uppercase text-foreground">{it.label}</span>
            <span className="block font-body text-xs text-muted-foreground">{it.sub}</span>
          </span>
        </motion.div>
      ))}
    </div>
  </section>
);

export default UspStrip;
