import { motion } from "framer-motion";
import { Clock, AlertTriangle, Flame, Gift } from "lucide-react";
import { useState, useEffect } from "react";

const UrgencySection = () => {
  // Simulated limited stock counter
  const [stockLeft] = useState(Math.floor(Math.random() * 8) + 3);

  // Countdown to end of current "batch"
  const getNextSunday = () => {
    const now = new Date();
    const daysUntilSunday = (7 - now.getDay()) % 7 || 7;
    const nextSunday = new Date(now);
    nextSunday.setDate(now.getDate() + daysUntilSunday);
    nextSunday.setHours(23, 59, 59, 999);
    return nextSunday;
  };

  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const target = getNextSunday();
    const tick = () => {
      const diff = target.getTime() - Date.now();
      if (diff <= 0) return;
      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      });
    };
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-20 bg-card relative overflow-hidden">
      {/* Subtle animated background */}
      <div className="absolute inset-0 opacity-5">
        <motion.div
          className="absolute w-96 h-96 rounded-full bg-primary blur-[100px]"
          animate={{ x: [0, 100, 0], y: [0, -50, 0] }}
          transition={{ duration: 20, repeat: Infinity }}
          style={{ top: "20%", left: "10%" }}
        />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Scarcity header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-sm mb-6">
              <Flame className="w-4 h-4" />
              <span className="font-body text-xs tracking-wider uppercase">Limited Sacred Collection</span>
            </div>
            <h2 className="font-display text-3xl md:text-5xl font-light text-foreground mb-4">
              Only <span className="text-gradient-gold font-semibold">{stockLeft} Pieces</span> Left This Batch
            </h2>
            <p className="font-body text-sm text-muted-foreground max-w-xl mx-auto">
              Each batch is handcrafted from a specific temple's sacred textiles. Once this collection is gone,
              these exact fabrics will never return.
            </p>
          </motion.div>

          {/* Countdown */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="grid grid-cols-4 gap-3 md:gap-6 max-w-lg mx-auto mb-12"
          >
            {[
              { label: "Days", value: timeLeft.days },
              { label: "Hours", value: timeLeft.hours },
              { label: "Minutes", value: timeLeft.minutes },
              { label: "Seconds", value: timeLeft.seconds },
            ].map((unit) => (
              <div key={unit.label} className="text-center p-4 rounded-sm border border-border bg-background">
                <span className="font-display text-2xl md:text-4xl text-foreground block">
                  {String(unit.value).padStart(2, "0")}
                </span>
                <span className="font-body text-[10px] tracking-wider uppercase text-muted-foreground">
                  {unit.label}
                </span>
              </div>
            ))}
          </motion.div>

          {/* Psychological triggers grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid md:grid-cols-3 gap-4 mb-12"
          >
            {[
              {
                icon: AlertTriangle,
                title: "Never Repeated",
                desc: "Once a batch of sacred fabric is used, it's gone forever. Each collection is truly limited.",
              },
              {
                icon: Clock,
                title: "Next Batch: 4-6 Weeks",
                desc: "Our artisans source and craft each batch with care. The next collection won't arrive soon.",
              },
              {
                icon: Gift,
                title: "Free Blessing Card",
                desc: "Order this week and receive a handwritten blessing card from our artisan family — complimentary.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="p-6 rounded-sm border border-border bg-background text-center"
              >
                <item.icon className="w-6 h-6 text-accent mx-auto mb-3" />
                <h3 className="font-display text-lg text-foreground mb-2">{item.title}</h3>
                <p className="font-body text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <a
              href="#collections"
              className="inline-flex items-center gap-3 bg-gradient-saffron text-primary-foreground px-10 py-4 rounded-sm font-body text-sm tracking-[0.2em] uppercase hover:opacity-90 transition-opacity shadow-sacred"
            >
              <Flame className="w-4 h-4" />
              Claim Your Piece Before It's Gone
            </a>
            <p className="font-body text-xs text-muted-foreground mt-4">
              🔒 Secure checkout · Free shipping above ₹2,999
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default UrgencySection;
