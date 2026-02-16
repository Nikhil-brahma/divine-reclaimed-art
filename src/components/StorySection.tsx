import { motion } from "framer-motion";
import artisanImg from "@/assets/artisan-crafting.jpg";
import { Leaf, Heart, Sparkles } from "lucide-react";

const values = [
  {
    icon: Heart,
    title: "A Piece of Faith",
    description: "You're not just carrying a bag — you're carrying something that was part of someone's prayers.",
  },
  {
    icon: Leaf,
    title: "Nothing Goes to Waste",
    description: "Instead of being discarded, these beautiful temple textiles get a meaningful second life.",
  },
  {
    icon: Sparkles,
    title: "Truly One of a Kind",
    description: "No two pieces look the same. The fabric, the patterns, the story — yours is uniquely yours.",
  },
];

const StorySection = () => {
  return (
    <section id="story" className="py-24 bg-gradient-sacred text-ivory">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="aspect-[4/5] rounded-sm overflow-hidden">
              <img
                src={artisanImg}
                alt="Artisan handcrafting a sacred bag at Punarvsu workshop in Rohini, Delhi"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
            <div className="absolute -bottom-4 -right-4 w-32 h-32 border border-gold/30 rounded-sm" />
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <span className="font-body text-xs tracking-[0.4em] uppercase text-gold mb-4 block">
              How It Started
            </span>
            <h2 className="font-display text-4xl md:text-5xl font-light mb-6 leading-tight">
              A Simple Idea That
              <br />
              <span className="italic text-gradient-gold">Felt Right</span>
            </h2>
            <p className="font-body text-ivory/70 leading-relaxed mb-6">
              You know the Bhagwan Ki Poshak — the sacred clothes that dress temple deities? They're beautiful,
              vibrant, and deeply meaningful. But when they're replaced at temples like Khatushyam Delhi Dham,
              they often end up discarded. That didn't sit right with us.
            </p>
            <p className="font-body text-ivory/70 leading-relaxed mb-10">
              So we started giving them a new life. At our workshop in Rohini, Delhi — run by{" "}
              <strong className="text-gold">Sampurna NGO</strong> (35+ years of social work) — our head artisans{" "}
              <strong className="text-gold">Kiran Mam</strong> and{" "}
              <strong className="text-gold">Samar Mam</strong> lead a team of skilled women who carefully
              clean, design, and handcraft each piece. What comes out the other end isn't just a bag —
              it's something that carries real meaning.
            </p>

            <div className="space-y-6">
              {values.map((value) => (
                <div key={value.title} className="flex gap-4">
                  <div className="w-10 h-10 rounded-sm bg-gold/10 flex items-center justify-center flex-shrink-0">
                    <value.icon size={18} className="text-gold" />
                  </div>
                  <div>
                    <h3 className="font-display text-lg text-ivory mb-1">{value.title}</h3>
                    <p className="font-body text-sm text-ivory/60">{value.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default StorySection;
