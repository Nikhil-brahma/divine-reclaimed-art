import { motion } from "framer-motion";
import artisanImg from "@/assets/artisan-crafting.jpg";
import { Leaf, Heart, Sparkles } from "lucide-react";

const values = [
  {
    icon: Heart,
    title: "Symbol of Devotion",
    description: "Each piece is a tangible connection to your faith — sacred art you carry with you.",
  },
  {
    icon: Leaf,
    title: "Sustainable & Sacred",
    description: "We promote a circular economy, giving beautiful temple textiles a new divine purpose.",
  },
  {
    icon: Sparkles,
    title: "One-of-a-Kind",
    description: "No two pieces are alike. Each bag tells a unique story of tradition and renewal.",
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
                alt="Artisan handcrafting a sacred bag at Punarvsu workshop"
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
              The Punarvsu Story
            </span>
            <h2 className="font-display text-4xl md:text-5xl font-light mb-6 leading-tight">
              Where Devotion Meets
              <br />
              <span className="italic text-gradient-gold">Artistry</span>
            </h2>
            <p className="font-body text-ivory/70 leading-relaxed mb-6">
              The Bhagwan Ki Poshak is more than fabric — it is imbued with the energy of countless
              prayers, rituals, and acts of devotion. When these sacred clothes are replaced at
              temples like Khatushyam Delhi Dham, instead of being discarded, we give them a second life.
            </p>
            <p className="font-body text-ivory/70 leading-relaxed mb-10">
              At our manufacturing unit in Rohini, Delhi — managed by <strong className="text-gold">Sampurna NGO</strong>, 
              an organisation with over 35 years in social work — our head artisans <strong className="text-gold">Kiran Mam</strong> and 
              <strong className="text-gold"> Samar Mam</strong> lead a team of skilled craftswomen who carefully clean, sanitise, and 
              transform these vibrant, intricate textiles into stunning, one-of-a-kind bags and accessories. 
              Each piece tells a story of devotion, faith, and renewal — the essence of <strong className="text-gold">Punarvsu</strong>.
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
