import { motion } from "framer-motion";
import { Heart, Leaf, Users, Sparkles, Shield, Globe } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import artisanImg from "@/assets/artisan-crafting.jpg";
import nikhilImg from "@/assets/nikhil-ceo.jpg";
import SectionDivider from "@/components/SectionDivider";

const values = [
  { icon: Heart, title: "Rooted in Devotion", desc: "Every fabric we use was part of someone's prayer — dressed on temple deities during sacred rituals." },
  { icon: Leaf, title: "Zero-Waste Philosophy", desc: "Instead of being discarded, these beautiful textiles get a meaningful, dignified second life." },
  { icon: Users, title: "Women-Led Craft", desc: "Our artisan workshop in Rohini, Delhi is led by Kiran Mam and powered by women from Sampurna NGO." },
  { icon: Sparkles, title: "One of a Kind", desc: "No two pieces are alike. The fabric, the pattern, the story — every bag is uniquely yours." },
  { icon: Shield, title: "35+ Years of Trust", desc: "Backed by Sampurna NGO's legacy of social work spanning over three decades." },
  { icon: Globe, title: "Circular Economy", desc: "We close the loop — turning temple waste into luxury, creating livelihoods along the way." },
];

const About = () => {
  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <SEOHead
        title="About Punarvsu — Our Sacred Mission"
        description="Discover how Punarvsu transforms retired temple textiles into handcrafted luxury bags. Our story of devotion, sustainability, and artisan craft."
      />
      <Navbar />

      <main>
        {/* Hero */}
        <section className="relative py-32 md:py-48 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-sacred" />
          <div className="absolute inset-0 bg-gradient-to-b from-temple-dark/60 to-transparent" />
          <div className="container mx-auto px-6 relative z-10 text-center">
            <motion.span
              initial={{ opacity: 0, letterSpacing: "0.2em" }}
              animate={{ opacity: 1, letterSpacing: "0.4em" }}
              transition={{ duration: 1.2 }}
              className="font-body text-xs uppercase text-gold mb-6 block"
            >
              Our Story
            </motion.span>
            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              className="font-display text-5xl md:text-8xl font-light text-ivory mb-6"
            >
              Where <span className="italic text-gradient-gold">Devotion</span>
              <br />Becomes Legacy
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="font-body text-ivory/60 max-w-2xl mx-auto"
            >
              We don't just make bags. We honour sacred textiles that once dressed the divine — giving them a new life, a new purpose, and a new home.
            </motion.p>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: 80 }}
              transition={{ duration: 1, delay: 0.8 }}
              className="ornament-line mx-auto mt-8"
            />
          </div>
        </section>

        <SectionDivider variant="gold" />

        {/* Mission */}
        <section className="py-24 bg-background">
          <div className="container mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, x: -40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                <div className="aspect-[4/5] rounded-sm overflow-hidden relative group">
                  <img
                    src={artisanImg}
                    alt="Punarvsu artisan handcrafting a bag from temple textile"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-temple-dark/40 via-transparent to-transparent" />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <span className="font-body text-xs tracking-[0.4em] uppercase text-primary mb-4 block">The Beginning</span>
                <h2 className="font-display text-4xl md:text-5xl font-light text-foreground mb-6 leading-tight">
                  It Started with a <span className="italic text-gradient-gold">Simple Question</span>
                </h2>
                <p className="font-body text-muted-foreground leading-relaxed mb-4">
                  What happens to the Bhagwan Ki Poshak — the sacred garments that dress temple deities — when they're replaced? At temples like Khatushyam Delhi Dham, these vibrant, hand-embroidered fabrics were often discarded. That didn't sit right with us.
                </p>
                <p className="font-body text-muted-foreground leading-relaxed mb-4">
                  So we began collecting them — with permission, with gratitude, with reverence. At our workshop in Sector-9, Rohini, Delhi, we clean, design, and handcraft each piece into something you'd genuinely love carrying.
                </p>
                <p className="font-body text-muted-foreground leading-relaxed">
                  What started as a small project with <strong className="text-primary">Sampurna NGO</strong> (35+ years of social work) has become a movement — one that honours the divine, empowers women artisans, and proves that sustainability can be truly beautiful.
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        <SectionDivider variant="sacred" />

        {/* Values */}
        <section className="py-24 bg-card">
          <div className="container mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <span className="font-body text-xs tracking-[0.4em] uppercase text-primary mb-4 block">What Drives Us</span>
              <h2 className="font-display text-4xl md:text-6xl font-light text-foreground">
                Our <span className="italic text-gradient-gold">Values</span>
              </h2>
              <div className="ornament-line w-20 mx-auto mt-6" />
            </motion.div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {values.map((v, i) => (
                <motion.div
                  key={v.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.6 }}
                  className="p-8 rounded-sm border border-border bg-background group hover:border-gold/30 transition-colors duration-500"
                >
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 border border-primary/20 group-hover:bg-primary/20 transition-colors"
                  >
                    <v.icon className="w-5 h-5 text-primary" />
                  </motion.div>
                  <h3 className="font-display text-xl text-foreground mb-2">{v.title}</h3>
                  <p className="font-body text-sm text-muted-foreground leading-relaxed">{v.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <SectionDivider variant="gold" />

        {/* Founder */}
        <section className="py-24 bg-background">
          <div className="container mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-16 items-center max-w-5xl mx-auto">
              <motion.div
                initial={{ opacity: 0, x: -40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                <div className="aspect-[3/4] rounded-sm overflow-hidden relative group max-w-sm mx-auto">
                  <img
                    src={nikhilImg}
                    alt="Nikhil — CEO & Founder of Punarvsu"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-temple-dark/50 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <span className="font-body text-[10px] tracking-[0.3em] uppercase text-gold/80">CEO & Founder</span>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <span className="font-body text-xs tracking-[0.4em] uppercase text-primary mb-4 block">Meet the Founder</span>
                <h2 className="font-display text-4xl md:text-5xl font-light text-foreground mb-6">
                  Nikhil <span className="italic text-gradient-gold">Visionary at 20</span>
                </h2>
                <p className="font-body text-muted-foreground leading-relaxed mb-4">
                  At just 20, Nikhil — CEO & Founder of Punarvsu — saw what others overlooked: sacred temple textiles being discarded after rituals. What started as a heartfelt mission to honour the divine has grown into a purpose-driven brand that bridges faith, sustainability, and artisan empowerment.
                </p>
                <p className="font-body text-muted-foreground leading-relaxed">
                  Under his leadership, Punarvsu partners with Sampurna NGO to create dignified livelihoods for women artisans while ensuring that every fabric once blessed by devotion finds a meaningful second life.
                </p>
                <div className="ornament-line w-20 mt-8" />
              </motion.div>
            </div>
          </div>
        </section>

        <SectionDivider variant="sacred" />
        <section className="py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-sacred" />
          <div className="container mx-auto px-6 relative z-10 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="font-display text-4xl md:text-6xl font-light text-ivory mb-6">
                Ready to Carry a <span className="italic text-gradient-gold">Blessing</span>?
              </h2>
              <p className="font-body text-ivory/60 max-w-xl mx-auto mb-10">
                Every Punarvsu piece carries the energy of prayer, the skill of artisans, and the beauty of sacred textiles. Find yours.
              </p>
              <motion.a
                href="/#collections"
                whileHover={{ scale: 1.05, boxShadow: "0 0 40px hsl(30 80% 48% / 0.4)" }}
                whileTap={{ scale: 0.98 }}
                className="inline-block bg-gradient-saffron text-primary-foreground px-10 py-5 rounded-sm font-body text-sm tracking-[0.25em] uppercase shadow-sacred relative overflow-hidden"
              >
                <span className="relative z-10">Explore the Collection</span>
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-ivory/10 to-transparent"
                  animate={{ x: ["-100%", "200%"] }}
                  transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
                />
              </motion.a>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default About;
