import { motion } from "framer-motion";
import { Landmark, Scissors, Leaf, Truck } from "lucide-react";

const items = [
  { icon: Landmark, label: "Sacred Bhagwan Vastra", sub: "Fabric blessed at Delhi temples" },
  { icon: Scissors, label: "Handstitched", sub: "Every bag crafted by women artisans" },
  { icon: Leaf, label: "Eco-Conscious", sub: "Upcycled sacred fabric, zero textile waste" },
  { icon: Truck, label: "Ships Across India", sub: "Free shipping above ₹999" },
];

const UspStrip = () => (
  <section aria-label="Why shop Punarvsu" className="border-y border-border/60 bg-card/50 py-10">
    <div className="container mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
      {items.map((it, i) => (
        <motion.div
          key={it.label}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: i * 0.06 }}
          className="flex flex-col items-center text-center gap-3"
        >
          <span className="inline-flex w-12 h-12 shrink-0 items-center justify-center rounded-full border border-primary/25 text-primary">
            <it.icon size={20} aria-hidden="true" />
          </span>
          <span>
            <span className="block font-body text-[11px] tracking-[0.2em] uppercase text-foreground">{it.label}</span>
            <span className="block font-body text-xs text-muted-foreground mt-1">{it.sub}</span>
          </span>
        </motion.div>
      ))}
    </div>
  </section>
);

export default UspStrip;
