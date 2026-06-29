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
    q: "What exactly is 'Bhagwan ki Poshak'?",
    a: "It's the sacred garment that dresses deities in temples. After a while, temples replace these clothes with new ones. Instead of letting them go to waste, we collect them — respectfully — from temple partners like Khatushyam Delhi Dham and from individual devotees.",
  },
  {
    q: "Is everything really handmade?",
    a: "Yes, 100%. Every single piece is made by hand at our workshop in Rohini, Delhi. It's managed by Sampurna NGO — they've been doing social work for over 35 years. Our head artisans Kiran Mam and Samar Mam lead a team of skilled women, and each bag takes 8–15 hours to complete. No machines, no shortcuts.",
  },
  {
    q: "How do you clean the temple fabrics?",
    a: "We use a three-step process: UV sterilisation, gentle washing with plant-based solutions, and steam treatment. It makes everything perfectly hygienic while keeping the fabric's colours and character intact.",
  },
  {
    q: "Can I send you my own sacred cloth to make into a bag?",
    a: "Absolutely! If you have a special piece of cloth — maybe from a temple visit, a family heirloom — we'd love to turn it into something you can carry every day. Just email us at punarvsu.com@gmail.com and we'll work out the details together.",
  },
  {
    q: "Do you deliver outside India?",
    a: "Not yet, but we're working on it. Right now we ship across India with free delivery on orders above ₹999. Join our newsletter and we'll let you know the moment international shipping goes live. For urgent requests, drop us a line directly.",
  },
  {
    q: "What if I'm not happy with my order?",
    a: "Since every piece is one-of-a-kind, we can't accept returns. But if something arrives damaged or looks very different from what was described, we'll exchange it within 7 days — no questions asked. We share detailed photos before shipping so you know exactly what you're getting.",
  },
  {
    q: "How does buying from Punarvsu actually help?",
    a: "In a few real ways: you're keeping beautiful fabric out of landfills (we've saved 3,200+ kg so far), supporting artisan livelihoods through Sampurna NGO, and helping preserve a tradition that might otherwise be forgotten. It's fashion that does something good — without making a big deal about it.",
  },
  {
    q: "Can I order in bulk — for gifts, weddings, or corporate events?",
    a: "Yes! Lots of people order Punarvsu pieces as Diwali gifts, wedding favours, or corporate presents. We can customise packaging and add personal messages too. Just reach out at punarvsu.com@gmail.com or call 09220464425 and we'll sort it out.",
  },
];

const FAQSection = () => {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} id="faq" className="py-24 bg-card relative overflow-hidden">
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
            Got Questions?
          </span>
          <h2 className="font-display text-4xl md:text-5xl text-foreground">
            We've Got{" "}
            <span className="text-gradient-gold">Answers</span>
          </h2>
          <p className="font-body text-muted-foreground mt-3 max-w-md mx-auto text-sm">
            Here's what people usually ask us. If you don't find your answer, just email us.
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
