import { motion } from "framer-motion";
import { Star, Quote, ShieldCheck, TrendingUp } from "lucide-react";
import { useState, useEffect } from "react";

const testimonials = [
  {
    name: "Priya M.",
    location: "Mumbai",
    text: "I've owned luxury bags from European brands, but nothing compares to the soul of my Punarvasu piece. People stop me everywhere to ask about it.",
    rating: 5,
    product: "Temple Tote",
  },
  {
    name: "Ananya R.",
    location: "Bangalore",
    text: "My mother cried when she saw the Provenance Card. She said it reminded her of her grandmother's temple visits. This isn't a bag — it's an emotion.",
    rating: 5,
    product: "Krishna Clutch",
  },
  {
    name: "Kavita S.",
    location: "Delhi",
    text: "I bought one for myself and ended up gifting three more. Everyone who receives a Punarvasu piece feels something. It's the most meaningful gift I've ever given.",
    rating: 5,
    product: "Radha Pouch",
  },
  {
    name: "Meera T.",
    location: "Jaipur",
    text: "The fabric has a warmth that no new material can match. When I hold my Punarvsu bag, I feel connected to something timeless.",
    rating: 5,
    product: "Saffron Crossbody",
  },
];

const livePulseMessages = [
  "Someone in Pune just added a Temple Tote to cart",
  "2 Krishna Clutches sold in the last hour",
  "A devotee from Chennai just placed an order",
  "Saffron Crossbody is trending today",
  "Someone in Hyderabad is viewing the Radha Pouch",
];

const SocialProofSection = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [pulseMessage, setPulseMessage] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setPulseMessage((prev) => (prev + 1) % livePulseMessages.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="py-24 bg-background relative overflow-hidden">
      {/* Live activity pulse */}
      <motion.div
        key={pulseMessage}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="fixed bottom-6 left-6 z-50 bg-foreground text-background px-5 py-3 rounded-sm shadow-sacred flex items-center gap-3 max-w-xs"
      >
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75" />
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-accent" />
        </span>
        <p className="font-body text-xs">{livePulseMessages[pulseMessage]}</p>
      </motion.div>

      <div className="container mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="font-body text-xs tracking-[0.4em] uppercase text-muted-foreground mb-4 block">
            Words From Our Devotees
          </span>
          <h2 className="font-display text-4xl md:text-6xl font-light text-foreground mb-4">
            They Didn't Just <span className="italic text-gradient-gold">Buy</span> — They{" "}
            <span className="italic text-gradient-gold">Felt</span>
          </h2>
          <div className="ornament-line w-20 mx-auto mt-6" />
        </motion.div>

        {/* Trust badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-6 mb-16"
        >
          {[
            { icon: ShieldCheck, text: "Verified Artisan Craft" },
            { icon: Star, text: "4.9/5 Customer Rating" },
            { icon: TrendingUp, text: "2000+ Happy Customers" },
          ].map((badge) => (
            <div
              key={badge.text}
              className="flex items-center gap-2 px-5 py-2.5 rounded-sm border border-border bg-card"
            >
              <badge.icon className="w-4 h-4 text-accent" />
              <span className="font-body text-xs tracking-wider text-foreground">{badge.text}</span>
            </div>
          ))}
        </motion.div>

        {/* Testimonials carousel */}
        <div className="max-w-4xl mx-auto relative">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={false}
              animate={{
                opacity: i === currentTestimonial ? 1 : 0,
                scale: i === currentTestimonial ? 1 : 0.95,
                position: i === currentTestimonial ? "relative" as const : "absolute" as const,
              }}
              transition={{ duration: 0.6 }}
              className={`w-full ${i !== currentTestimonial ? "pointer-events-none top-0 left-0" : ""}`}
            >
              <div className="text-center p-8 md:p-12 rounded-sm border border-border bg-card">
                <Quote className="w-8 h-8 text-accent/40 mx-auto mb-6" />
                <p className="font-display text-xl md:text-2xl text-foreground italic leading-relaxed mb-6">
                  "{t.text}"
                </p>
                <div className="flex justify-center gap-1 mb-4">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} className="w-4 h-4 fill-accent text-accent" />
                  ))}
                </div>
                <p className="font-body text-sm font-medium text-foreground">{t.name}</p>
                <p className="font-body text-xs text-muted-foreground">
                  {t.location} · {t.product}
                </p>
              </div>
            </motion.div>
          ))}

          {/* Dots */}
          <div className="flex justify-center gap-2 mt-6">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentTestimonial(i)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  i === currentTestimonial ? "bg-accent w-6" : "bg-border"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SocialProofSection;
