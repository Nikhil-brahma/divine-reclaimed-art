import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
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
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const imageY = useTransform(scrollYProgress, [0, 1], [60, -60]);
  const contentY = useTransform(scrollYProgress, [0, 1], [40, -20]);
  const imageScale = useTransform(scrollYProgress, [0, 0.5], [0.9, 1]);
  const bgOpacity = useTransform(scrollYProgress, [0, 0.3], [0.6, 0.75]);

  return (
    <section ref={sectionRef} id="story" className="relative py-32 overflow-hidden">
      {/* Animated background */}
      <motion.div className="absolute inset-0 bg-gradient-sacred" style={{ opacity: bgOpacity }} />
      <div className="absolute inset-0 bg-gradient-sacred" />

      {/* Floating geometric shapes */}
      <motion.div
        style={{ y: useTransform(scrollYProgress, [0, 1], [-30, 30]) }}
        className="absolute top-32 right-20 w-48 h-48 border border-gold/10 rounded-full opacity-20"
      />
      <motion.div
        style={{ y: useTransform(scrollYProgress, [0, 1], [20, -40]) }}
        className="absolute bottom-20 left-16 w-32 h-32 border border-gold/10 rotate-45 opacity-15"
      />

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Image with parallax */}
          <motion.div
            style={{ y: imageY, scale: imageScale }}
            className="relative"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
              className="aspect-[4/5] rounded-sm overflow-hidden relative group"
            >
              <img
                src={artisanImg}
                alt="Artisan handcrafting a sacred bag at Punarvsu workshop in Rohini, Delhi"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-temple-dark/40 via-transparent to-transparent" />
            </motion.div>
            {/* Decorative corner */}
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="absolute -bottom-4 -right-4 w-32 h-32 border border-gold/30 rounded-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.7, duration: 0.6 }}
              className="absolute -top-4 -left-4 w-20 h-20 border border-gold/20 rounded-sm"
            />
          </motion.div>

          {/* Content with depth */}
          <motion.div style={{ y: contentY }}>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <motion.span
                initial={{ opacity: 0, letterSpacing: "0.2em" }}
                whileInView={{ opacity: 1, letterSpacing: "0.4em" }}
                viewport={{ once: true }}
                transition={{ duration: 1.2 }}
                className="font-body text-xs uppercase text-gold mb-4 block"
              >
                The Full Story
              </motion.span>
              <h2 className="font-display text-4xl md:text-6xl font-light mb-6 leading-tight text-ivory">
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
                <strong className="text-gold">Sampurna NGO</strong> (35+ years of social work) — our head artisan{" "}
                <strong className="text-gold">Kiran Mam</strong> leads a team of skilled women who carefully
                clean, design, and handcraft each piece. What comes out the other end isn't just a bag —
                it's something that carries real meaning.
              </p>
            </motion.div>

            <div className="space-y-6">
              {values.map((value, i) => (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, x: 40, rotateY: 10 }}
                  whileInView={{ opacity: 1, x: 0, rotateY: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.2 + i * 0.15 }}
                  className="flex gap-4 group"
                >
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className="w-12 h-12 rounded-sm bg-gold/10 flex items-center justify-center flex-shrink-0 border border-gold/20 group-hover:bg-gold/20 transition-colors"
                  >
                    <value.icon size={20} className="text-gold" />
                  </motion.div>
                  <div>
                    <h3 className="font-display text-lg text-ivory mb-1">{value.title}</h3>
                    <p className="font-body text-sm text-ivory/60">{value.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default StorySection;
