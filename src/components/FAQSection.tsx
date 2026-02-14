import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    q: "What is 'Bhagwan ki Poshak' and how do you source it?",
    a: "Bhagwan ki Poshak refers to the sacred garments that adorn deities in temples across India. After a certain period, these garments are ceremonially retired. We collect them respectfully from our temple partners — most prominently Khatushyam Delhi Dham — and from individual devotees, ensuring every fabric is treated with reverence throughout our process.",
  },
  {
    q: "Are your products truly handcrafted?",
    a: "Absolutely. Every Punarvsu product is 100% handcrafted by skilled artisans at our manufacturing unit in Rohini, Delhi, managed by Sampurna NGO — an organisation with over 35 years of dedication to social work. Under the expert guidance of our head artisans Kiran Mam and Samar Mam, each piece takes between 8–15 hours of dedicated work — from sanitisation and design cutting to stitching and quality checks. No two products are identical because each sacred textile is unique.",
  },
  {
    q: "How do you sanitise the temple fabrics?",
    a: "We follow a rigorous 3-step sanitisation process: UV sterilisation, eco-friendly fabric cleaning with plant-based solutions, and steam treatment. This ensures every product is hygienically perfect while preserving the sacred essence and vibrant colours of the original textiles.",
  },
  {
    q: "Can I request a custom bag from a specific temple's fabric?",
    a: "Yes! We offer bespoke services for special requests. If you have a specific temple or deity preference, or even your own sacred cloth you'd like transformed, reach out to us at namaste@punarvsu.in and we'll work with you to create something truly personal.",
  },
  {
    q: "Do you ship internationally?",
    a: "Currently we ship across India with free shipping on orders above ₹5,000. International shipping is coming soon — join our newsletter to be the first to know when we launch worldwide delivery. For urgent international requests, contact us directly.",
  },
  {
    q: "What is your return and exchange policy?",
    a: "Since each product is one-of-a-kind, we don't accept returns. However, if your product arrives damaged or significantly different from the description, we'll gladly exchange it within 7 days. We include detailed photos and descriptions so you know exactly what you're receiving.",
  },
  {
    q: "How does buying from Punarvsu help the environment?",
    a: "Every purchase diverts sacred textiles from landfills, supports our zero-waste mission, and funds artisan livelihoods through Sampurna NGO. We've already saved 3,200+ kg of temple cloth from disposal, and each bag reduces textile waste while honouring tradition — true circular fashion with purpose.",
  },
  {
    q: "Do you offer wholesale or bulk orders for gifting?",
    a: "Yes! We offer special wholesale pricing for corporate gifting, wedding favours, and festive bulk orders. Our team can customise packaging and add personalised messages. Contact us at namaste@punarvsu.in or call 09220464425 for wholesale inquiries.",
  },
];

const FAQSection = () => {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} id="faq" className="py-24 bg-card relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-72 h-72 rounded-full bg-primary/5 blur-[100px]" />
      <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-accent/5 blur-[120px]" />

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <span className="font-body text-xs tracking-[0.4em] uppercase text-primary/60 block mb-3">
            Questions & Answers
          </span>
          <h2 className="font-display text-4xl md:text-5xl text-foreground">
            Frequently Asked{" "}
            <span className="text-gradient-gold">Questions</span>
          </h2>
          <p className="font-body text-muted-foreground mt-3 max-w-md mx-auto text-sm">
            Everything you need to know about our sacred craft.
          </p>
        </motion.div>

        <motion.div
          className="max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          <Accordion type="single" collapsible className="space-y-3">
            {faqs.map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.1 * i }}
              >
                <AccordionItem
                  value={`item-${i}`}
                  className="border border-border/50 rounded-xl px-6 bg-background/50 backdrop-blur-sm hover:border-primary/30 transition-colors duration-300"
                >
                  <AccordionTrigger className="font-display text-base md:text-lg text-foreground hover:no-underline hover:text-primary transition-colors">
                    {faq.q}
                  </AccordionTrigger>
                  <AccordionContent className="font-body text-muted-foreground leading-relaxed">
                    {faq.a}
                  </AccordionContent>
                </AccordionItem>
              </motion.div>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
};

export default FAQSection;
