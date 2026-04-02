import { motion, AnimatePresence } from "framer-motion";
import { Star, Quote, ShieldCheck, TrendingUp } from "lucide-react";
import { useState, useEffect } from "react";

const testimonials = [
  {
    name: "Priya M.",
    location: "Mumbai",
    text: "I wasn't sure what to expect honestly. But when I held it, I could feel the texture, the weight — it's nothing like a regular bag. My friends keep asking where I got it.",
    rating: 5,
    product: "Sacred Heritage Potli",
  },
  {
    name: "Ananya R.",
    location: "Bangalore",
    text: "I gave one to my mom for her birthday. She read the provenance card and got emotional — said it reminded her of visiting temples as a kid. Best gift I've ever picked.",
    rating: 5,
    product: "Crimson Velvet Potli",
  },
  {
    name: "Kavita S.",
    location: "Delhi",
    text: "Bought one, then bought three more for Diwali gifts. There's something about giving someone a Punarvsu piece — it just feels more thoughtful than anything else.",
    rating: 5,
    product: "Grand Heritage Potli",
  },
  {
    name: "Meera T.",
    location: "Jaipur",
    text: "The colours are so rich — you can tell this fabric has lived a life. It's hard to explain but it feels different carrying something with real history.",
    rating: 5,
    product: "Mustard Silk Potli",
  },
];

// Real Shopify product names synced with actual catalog
const realProducts = [
  "Crimson Velvet Potli",
  "Grand Heritage Potli",
  "Mustard Silk Potli",
  "Sacred Heritage Potli – Classic Edition",
  "Sacred Heritage Potli – Premium Zari Edition",
  "Saffron & Teal Potli",
  "Sacred Heritage Potli – Devotion Edition",
  "Sacred Heritage Potli – Lite Edition",
];

const cities = ["Pune", "Chennai", "Hyderabad", "Mumbai", "Bangalore", "Delhi", "Jaipur", "Kolkata", "Ahmedabad", "Lucknow"];

const templates = [
  (product: string, city: string) => `Someone in ${city} just added a ${product} to their cart`,
  (product: string, _city: string) => `2 ${product} ordered in the last hour`,
  (_product: string, city: string) => `A customer from ${city} just placed an order`,
  (product: string, _city: string) => `${product} is getting a lot of love today`,
  (product: string, city: string) => `Someone in ${city} is checking out the ${product}`,
];

function generatePulseMessage(): string {
  const product = realProducts[Math.floor(Math.random() * realProducts.length)];
  const city = cities[Math.floor(Math.random() * cities.length)];
  const template = templates[Math.floor(Math.random() * templates.length)];
  return template(product, city);
}

const SocialProofSection = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [pulseMessage, setPulseMessage] = useState(() => generatePulseMessage());
  const [pulseKey, setPulseKey] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setPulseMessage(generatePulseMessage());
      setPulseKey((prev) => prev + 1);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="py-24 bg-background relative overflow-hidden">
      {/* Live activity pulse - fixed for mobile visibility */}
      <AnimatePresence mode="wait">
        <motion.div
          key={pulseKey}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4 }}
          className="fixed bottom-4 left-3 right-3 md:left-4 md:right-auto z-50 bg-foreground text-background px-4 py-3 rounded-lg shadow-sacred flex items-center gap-3 md:max-w-sm"
        >
          <span className="relative flex h-2.5 w-2.5 shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-accent" />
          </span>
          <p className="font-body text-xs leading-snug">{pulseMessage}</p>
        </motion.div>
      </AnimatePresence>

      <div className="container mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="font-body text-xs tracking-[0.4em] uppercase text-muted-foreground mb-4 block">
            Real People, Real Stories
          </span>
          <h2 className="font-display text-4xl md:text-6xl font-light text-foreground mb-4">
            Don't Take Our Word —{" "}
            <span className="italic text-gradient-gold">Take Theirs</span>
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
            { icon: Star, text: "4.9/5 Average Rating" },
            { icon: TrendingUp, text: "2,000+ Happy Customers" },
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
