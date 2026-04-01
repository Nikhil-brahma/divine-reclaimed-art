import { motion } from "framer-motion";
import { Mail, MapPin, Phone, Send } from "lucide-react";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error("Please fill in all fields");
      return;
    }
    setSending(true);
    // Simulate send
    await new Promise((r) => setTimeout(r, 1500));
    toast.success("Message sent! We'll get back to you soon.");
    setForm({ name: "", email: "", message: "" });
    setSending(false);
  };

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <SEOHead
        title="Contact Punarvsu — Get in Touch"
        description="Reach out to Punarvsu for queries about our handcrafted bags from sacred temple textiles. Located in Rohini, Delhi."
      />
      <Navbar />

      <main>
        {/* Hero */}
        <section className="relative py-32 md:py-40 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-sacred" />
          <div className="container mx-auto px-6 relative z-10 text-center">
            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              className="font-display text-5xl md:text-7xl font-light text-ivory mb-4"
            >
              Get in <span className="italic text-gradient-gold">Touch</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="font-body text-ivory/60 max-w-lg mx-auto"
            >
              Whether you have a question, a custom order request, or just want to say hello — we'd love to hear from you.
            </motion.p>
          </div>
        </section>

        {/* Form + Info */}
        <section className="py-24 bg-background">
          <div className="container mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-16 max-w-5xl mx-auto">
              {/* Form */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                <h2 className="font-display text-3xl text-foreground mb-8">
                  Send Us a <span className="italic text-gradient-gold">Message</span>
                </h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="font-body text-xs tracking-[0.2em] uppercase text-muted-foreground mb-2 block">
                      Your Name
                    </label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full bg-card border border-border rounded-sm px-5 py-4 font-body text-foreground focus:outline-none focus:border-primary/50 transition-colors"
                      placeholder="Enter your name"
                    />
                  </div>
                  <div>
                    <label className="font-body text-xs tracking-[0.2em] uppercase text-muted-foreground mb-2 block">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="w-full bg-card border border-border rounded-sm px-5 py-4 font-body text-foreground focus:outline-none focus:border-primary/50 transition-colors"
                      placeholder="you@example.com"
                    />
                  </div>
                  <div>
                    <label className="font-body text-xs tracking-[0.2em] uppercase text-muted-foreground mb-2 block">
                      Message
                    </label>
                    <textarea
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      rows={5}
                      className="w-full bg-card border border-border rounded-sm px-5 py-4 font-body text-foreground focus:outline-none focus:border-primary/50 transition-colors resize-none"
                      placeholder="Tell us what's on your mind..."
                    />
                  </div>
                  <motion.button
                    type="submit"
                    disabled={sending}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full bg-gradient-saffron text-primary-foreground px-8 py-4 rounded-sm font-body text-sm tracking-[0.2em] uppercase shadow-sacred flex items-center justify-center gap-2 disabled:opacity-50 relative overflow-hidden"
                  >
                    <span className="relative z-10 flex items-center gap-2">
                      {sending ? "Sending..." : "Send Message"}
                      <Send className="w-4 h-4" />
                    </span>
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-ivory/10 to-transparent"
                      animate={{ x: ["-100%", "200%"] }}
                      transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
                    />
                  </motion.button>
                </form>
              </motion.div>

              {/* Contact Info */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="flex flex-col justify-center"
              >
                <h2 className="font-display text-3xl text-foreground mb-8">
                  Or Reach Us <span className="italic text-gradient-gold">Directly</span>
                </h2>

                <div className="space-y-8">
                  <a href="mailto:punarvsu.com@gmail.com" className="flex items-start gap-4 group">
                    <div className="w-12 h-12 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                      <Mail className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-display text-lg text-foreground mb-1">Email</h3>
                      <p className="font-body text-sm text-muted-foreground">punarvsu.com@gmail.com</p>
                    </div>
                  </a>

                  <a href="tel:09220464425" className="flex items-start gap-4 group">
                    <div className="w-12 h-12 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                      <Phone className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-display text-lg text-foreground mb-1">Phone</h3>
                      <p className="font-body text-sm text-muted-foreground">09220464425</p>
                    </div>
                  </a>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-display text-lg text-foreground mb-1">Visit Us</h3>
                      <p className="font-body text-sm text-muted-foreground leading-relaxed">
                        Maharana Pratap Community Centre,<br />
                        Sector-9, Rohini, Delhi — 110085
                      </p>
                    </div>
                  </div>
                </div>

                {/* Working hours */}
                <div className="mt-12 p-6 rounded-sm border border-border bg-card">
                  <h3 className="font-display text-lg text-foreground mb-3">Working Hours</h3>
                  <div className="space-y-2 font-body text-sm text-muted-foreground">
                    <p>Monday – Saturday: 10:00 AM – 6:00 PM</p>
                    <p>Sunday: Closed</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Contact;
