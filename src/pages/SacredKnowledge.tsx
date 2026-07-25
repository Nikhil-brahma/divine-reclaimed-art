import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import SectionDivider from "@/components/SectionDivider";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

type CategoryKey =
  | "understanding"
  | "ethics"
  | "shopping"
  | "gifting"
  | "care"
  | "impact";

const categories: { key: CategoryKey; label: string }[] = [
  { key: "understanding", label: "Understanding Sacred Upcycling" },
  { key: "ethics", label: "Ethics & Purity" },
  { key: "shopping", label: "Shopping & Products" },
  { key: "gifting", label: "Gifting & Occasions" },
  { key: "care", label: "Custom, Care & Storage" },
  { key: "impact", label: "Impact, Shipping & Trust" },
];

type FAQ = { id: number; category: CategoryKey; q: string; a: string };

const faqs: FAQ[] = [
  {
    id: 1,
    category: "understanding",
    q: "What are upcycled temple fabrics and how are they repurposed?",
    a: "Upcycled temple fabrics are the sacred garments — known as Bhagwan ki Poshak — that once dressed deities in Hindu temples. When temples change these clothes, Punarvsu collects them respectfully from partners like Khatushyam Delhi Dham, cleans them through a three-phase UV, wash and steam process, and re-cuts them into handcrafted potli bags, totes and clutches at our Rohini workshop. Nothing sacred is discarded; every thread continues its purpose in a new form.",
  },
  {
    id: 2,
    category: "shopping",
    q: "Where can I buy luxury potli bags made from deity clothes?",
    a: "Punarvsu is India's first brand dedicated to luxury bags made from retired deity garments. You can explore our current editions on the Collections section of our home page. Every piece is one-of-a-kind, hand-stitched in Delhi and shipped across India with free delivery above ₹999.",
  },
  {
    id: 3,
    category: "ethics",
    q: "Is it disrespectful to wear clothes made from old temple offerings?",
    a: "No — quite the opposite when it is done with intention. Temple textiles that have completed their service on the deity are traditionally distributed as prasad or respectfully released. Reworking them into a keepsake, rather than allowing them to decay in a landfill, extends the reverence. Our process is guided by temple priests and every piece carries a Certificate of Sanctity so devotees can carry the blessing with dignity.",
  },
  {
    id: 4,
    category: "understanding",
    q: "What is sustainable spiritual fashion?",
    a: "Sustainable spiritual fashion is clothing and accessories that honour both the planet and the sacred. Instead of producing new fabric, brands like Punarvsu reclaim textiles that already carry devotional history — temple poshak, heirloom saris, pilgrimage cloth — and rework them into wearable pieces. It is slow, small-batch and rooted in ritual, not trend cycles.",
  },
  {
    id: 5,
    category: "care",
    q: "How can I turn an old silk sari offered to a goddess into a keepsake?",
    a: "We accept personal sacred cloth from devotees for custom pieces. Write to us at punarvsu.com@gmail.com with photos of the sari and what you would like made — a potli, a mandir bag, a framed panel. Our artisans handle the cloth reverently, sanitise it using our three-phase process and hand-stitch it into a keepsake you can carry every day. Typical turnaround is three to five weeks.",
  },
  {
    id: 6,
    category: "care",
    q: "Can temple flowers and cloths be recycled into accessories?",
    a: "Temple cloths, yes — that is our craft. Temple flowers are usually composted or floated in flowing water as tradition dictates; they cannot be turned into accessories. But garlands with metallic zari, silk borders and cloth backings can sometimes be reclaimed. Send us photos at punarvsu.com@gmail.com and we will tell you honestly what is possible.",
  },
  {
    id: 7,
    category: "understanding",
    q: "What happens to the clothes worn by deities in Hindu temples?",
    a: "Deity garments are changed regularly — daily in some temples, seasonally in others. Traditionally the retired poshak was distributed to devotees as prasad, released into rivers, or, sadly, sent to landfills as urban temples scaled up. Punarvsu partners with temples such as Khatushyam Delhi Dham to intercept these textiles before they are wasted and give them a second life as heirloom accessories.",
  },
  {
    id: 8,
    category: "ethics",
    q: "Are upcycled religious fabrics considered pure or shuddha?",
    a: "Yes. Purity in Hindu tradition is defined by intention (bhaav) and by cleansing (shuddhi), not by whether cloth has been used before. Our three-phase sanitisation — UV sterilisation, plant-based washing and steam treatment — restores shuddhi, and the sacred history of the fabric only deepens its meaning. Many customers use their Punarvsu potlis to carry pooja items precisely because of this lineage.",
  },
  {
    id: 9,
    category: "gifting",
    q: "Unique religious gift ideas for a housewarming ceremony.",
    a: "A Punarvsu potli filled with rock salt, rice and a small idol is a beloved griha pravesh gift — the bag itself carries temple blessings, and the contents represent prosperity. Our Shagun Gift Set and Classic Potli are our most-gifted pieces for housewarmings. Add a handwritten note at checkout and we will include it with the Certificate of Sanctity.",
  },
  {
    id: 10,
    category: "shopping",
    q: "Where to find eco-friendly festive wear made from reclaimed temple silk.",
    a: "Punarvsu's festive editions — the Crimson Velvet Bridal Potli, Saffron Teal Festive Potli and Mustard Silk Floral Potli — are hand-stitched from reclaimed temple silk with zari and pearl work. They pair beautifully with sarees and lehengas for Diwali, weddings and pooja ceremonies. Browse them on our Collections section.",
  },
  {
    id: 11,
    category: "care",
    q: "How to clean and maintain delicate gold-thread temple fabrics.",
    a: "Never machine-wash zari or gold-thread pieces. Spot-clean with a barely-damp muslin cloth, then air-dry away from direct sunlight. Store in a breathable cotton pouch (we ship every bag in one) with a small silica sachet to absorb moisture. Every six months, unfold and refold along different lines to prevent creasing. Avoid perfume and hairspray contact — they tarnish zari.",
  },
  {
    id: 12,
    category: "care",
    q: "Can I customize a potli bag using cloth from a specific pilgrimage site?",
    a: "Yes. If you have brought back cloth from a pilgrimage — Vrindavan, Tirupati, Puri, a Devi shrine — we can turn it into a custom potli. Email photos and dimensions to punarvsu.com@gmail.com and our artisans will design a piece that preserves the most meaningful sections of the fabric. Custom pieces take three to five weeks.",
  },
  {
    id: 13,
    category: "impact",
    q: "Why is sustainable fashion important in religious practices?",
    a: "Religious traditions have always taught reverence for materials — no grain, no cloth, no offering was ever meant to be wasted. Modern fast fashion has severed that link. By choosing sustainably-made devotional objects, you close a loop that feels natural to a devotee: cloth that dressed the divine continues its service in your hands, not in a landfill.",
  },
  {
    id: 14,
    category: "gifting",
    q: "What are the best spiritual keepsakes for a wedding return gift?",
    a: "Our Lite Potli and Shagun Gift Set are the most popular wedding return gifts — small enough to gift at scale, meaningful enough that guests actually keep them. Every potli arrives with a Certificate of Sanctity naming the temple source, which makes it a story guests carry home. Bulk orders (25+ pieces) get personalised packaging and a message card.",
  },
  {
    id: 15,
    category: "understanding",
    q: "How are deity clothes sourced for upcycling?",
    a: "We source directly from temple partners under written agreement — most notably Khatushyam Delhi Dham and several other Delhi and North India shrines. Priests hand over retired poshak to us in person, never through intermediaries. We also accept donations from individual devotees who wish to give their family's sacred cloth a second life.",
  },
  {
    id: 16,
    category: "ethics",
    q: "Are products made from temple waste ethically produced?",
    a: "Ours are. Every Punarvsu piece is handmade at our Rohini workshop, which is managed by Sampurna NGO — a 35-plus-year-old organisation focused on livelihoods for underprivileged women. Head artisan Kiran Mam leads a team paid fair wages, working reasonable hours, in a well-lit space. No child labour, no sweatshops, no subcontracting.",
  },
  {
    id: 17,
    category: "impact",
    q: "How to tell if a temple fabric keepsake is authentic?",
    a: "Look for three markers: a physical Certificate of Sanctity naming the temple and date of retirement, visible signs of hand-stitching (slight variations, not machine-perfect seams), and provenance documentation — photos or video of the sourcing. Punarvsu provides all three with every order. If a seller cannot show them, treat the claim with caution.",
  },
  {
    id: 18,
    category: "shopping",
    q: "Can I buy a prayer mat made from recycled temple vestments?",
    a: "Prayer mats are on our roadmap for late 2026. Right now our core range is potli bags, totes, mandir bags and clutches. If you would like to be notified when the prayer mat drops, email punarvsu.com@gmail.com and we will add you to the first-access list.",
  },
  {
    id: 19,
    category: "shopping",
    q: "What is the price range for handmade upcycled deity cloth bags?",
    a: "Punarvsu pieces range from ₹999 for the Lite Potli to around ₹8,000 for the Grand Heritage Potli with hand-painted base art. Most everyday editions sit between ₹1,500 and ₹4,000. Pricing reflects the eight to fifteen hours of hand-stitching each piece receives, plus fair wages for our artisans.",
  },
  {
    id: 20,
    category: "impact",
    q: "Does upcycling temple cloth support local artisans?",
    a: "Directly. Every rupee spent at Punarvsu flows to the Sampurna NGO workshop in Rohini, where a team of women artisans led by Kiran Mam earn a stable livelihood. Since we launched, we have logged 850+ artisan hours and diverted 3,200+ kg of sacred textile from landfills — measurable impact per bag.",
  },
  {
    id: 21,
    category: "care",
    q: "How to store a sacred fabric keepsake to prevent damage.",
    a: "Store your Punarvsu piece in the cotton pouch it arrived in, inside a wooden or fabric-lined drawer away from direct sunlight and humidity. Add a silica gel sachet and a few cloves — traditional protection against insects. Every six months, air the piece for a few hours and refold it along different lines. Never store in plastic; zari needs to breathe.",
  },
  {
    id: 22,
    category: "impact",
    q: "Are there brands that donate proceeds from temple fashion to charity?",
    a: "Punarvsu's model is charity-integrated rather than percentage-donation. Our workshop is operated by Sampurna NGO, which means the artisan wages, workshop overheads and training programmes are the primary beneficiaries of every sale. Your purchase does not fund a separate donation — it directly sustains the artisan livelihood programme.",
  },
  {
    id: 23,
    category: "impact",
    q: "Can I ship religious fabric products internationally from India?",
    a: "International shipping is on our roadmap and not yet live. Right now we ship free across India on orders above ₹999. If you are abroad and want a Punarvsu piece urgently — for a wedding, a diksha, a housewarming — email punarvsu.com@gmail.com and we can arrange a one-off courier at cost.",
  },
  {
    id: 24,
    category: "gifting",
    q: "What are the best spiritual gifts for devotees living abroad?",
    a: "For NRI devotees who miss the tangible feel of home temples, a Punarvsu potli is meaningful precisely because the cloth was recently in a Delhi shrine. The Sita Potli and Classic Potli travel well in a carry-on, and the Certificate of Sanctity makes the story easy to share. Contact us for one-off international shipping.",
  },
  {
    id: 25,
    category: "ethics",
    q: "Is it okay to use temple-sourced fabric for everyday fashion?",
    a: "Yes, and we would argue it is the highest form of respect. Cloth that once dressed a deity was never meant to sit sealed in a temple cupboard forever. Wearing it into your everyday life — to work, to a friend's wedding, to your child's school — keeps that sanctity present in the world. Handle it with the same care you would any heirloom.",
  },
  {
    id: 26,
    category: "understanding",
    q: "How are temple fabrics sanitized before being turned into bags?",
    a: "Our three-phase process: UV sterilisation under medical-grade lamps to neutralise microbes; a gentle wash with plant-based, pH-neutral solutions that preserve zari and dye; and a final steam treatment. No harsh chemicals, no bleach. The fabric emerges hygienically safe while retaining its original colours, texture and character.",
  },
  {
    id: 27,
    category: "gifting",
    q: "Gifts for Krishna devotees made from Pichwai or deity clothing.",
    a: "Krishna devotees especially resonate with our pieces sourced from Vaishnava temples — the saffron, peacock-blue and gold palettes echo Pichwai art. The Sita Potli and our seasonal Krishna Janmashtami editions are hand-stitched from these textiles. Contact us for current availability, since these pieces are limited by what the temples release.",
  },
  {
    id: 28,
    category: "shopping",
    q: "Are upcycled temple silk bags more expensive than regular silk?",
    a: "Sometimes yes, sometimes no. A machine-made silk bag can be cheaper because the labour is mechanised. A Punarvsu piece takes eight to fifteen hours of hand-stitching by fairly-paid artisans and carries documented provenance — that is what you pay for. Compared to designer silk bags of similar craftsmanship, upcycled temple silk is often more affordable.",
  },
  {
    id: 29,
    category: "care",
    q: "How to repurpose Vastra offered to deities into home decor.",
    a: "Vastra can become framed textile panels for your pooja room, cushion covers for a meditation seat, altar cloths, or hanging toran door decorations. Punarvsu offers a custom home-decor service — email photos of the vastra to punarvsu.com@gmail.com and we will suggest options. Turnaround is three to five weeks.",
  },
  {
    id: 30,
    category: "shopping",
    q: "Online stores for slow fashion inspired by Indian temple traditions.",
    a: "Punarvsu is the pioneering online store dedicated specifically to luxury accessories from upcycled temple textiles. A handful of Indian slow-fashion labels use temple-inspired motifs or handloom, but reclaimed deity poshak as the source material is our category. Shop directly at punarvsu.com — every piece ships with provenance documentation.",
  },
];

const escapeJsonLd = (json: string) => json.replace(/</g, "\\u003c");

const SacredKnowledge = () => {
  const [active, setActive] = useState<CategoryKey | "all">("all");

  const visible = useMemo(
    () => (active === "all" ? faqs : faqs.filter((f) => f.category === active)),
    [active],
  );

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://punarvsu.com/" },
      {
        "@type": "ListItem",
        position: 2,
        name: "Sacred Knowledge",
        item: "https://punarvsu.com/sacred-knowledge",
      },
    ],
  };

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <SEOHead
        title="Sacred Knowledge: Upcycled Temple Textile FAQs"
        description="Answers on upcycled temple textiles, sustainable spiritual fashion, sourcing, care and gifting — from Punarvsu, India's pioneer in sacred textile upcycling."
        canonical="https://punarvsu.com/sacred-knowledge"
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: escapeJsonLd(JSON.stringify(faqSchema)) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: escapeJsonLd(JSON.stringify(breadcrumbSchema)) }}
      />

      <Navbar />

      <main>
        {/* Hero */}
        <section className="relative pt-32 pb-16 bg-gradient-to-b from-background to-card overflow-hidden">
          <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full bg-primary/5 blur-[120px]" />
          <div className="container mx-auto px-6 relative z-10 text-center max-w-3xl">
            <nav aria-label="Breadcrumb" className="mb-6">
              <ol className="flex items-center justify-center gap-2 text-xs tracking-[0.3em] uppercase text-muted-foreground">
                <li><Link to="/" className="hover:text-primary transition-colors">Home</Link></li>
                <li aria-hidden="true">/</li>
                <li className="text-primary">Sacred Knowledge</li>
              </ol>
            </nav>
            <motion.span
              className="font-body text-xs tracking-[0.4em] uppercase text-primary/70 block mb-4"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              The Punarvsu Almanac
            </motion.span>
            <motion.h1
              className="font-display text-4xl md:text-6xl text-foreground mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
            >
              Sacred <span className="text-gradient-gold">Knowledge</span>
            </motion.h1>
            <motion.p
              className="font-body text-muted-foreground text-base md:text-lg leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              Everything devotees, gifters and slow-fashion seekers ask us about upcycled temple textiles —
              from what happens to Bhagwan ki Poshak, to how we sanitise sacred cloth, to how to turn your own
              heirloom sari into a keepsake. Punarvsu is India's pioneer in this category, and this is the
              knowledge we have gathered along the way.
            </motion.p>
          </div>
        </section>

        <SectionDivider variant="gold" />

        {/* Filter + Accordion */}
        <section className="py-16 md:py-24 bg-card">
          <div className="container mx-auto px-6">
            {/* Category chips */}
            <div className="flex flex-wrap justify-center gap-2 md:gap-3 mb-12 max-w-4xl mx-auto">
              <button
                onClick={() => setActive("all")}
                className={`px-4 py-2 rounded-full font-body text-xs md:text-sm tracking-wide border transition-all ${
                  active === "all"
                    ? "bg-primary text-primary-foreground border-primary"
                    : "border-border/60 text-muted-foreground hover:border-primary/50 hover:text-primary"
                }`}
              >
                All ({faqs.length})
              </button>
              {categories.map((c) => {
                const count = faqs.filter((f) => f.category === c.key).length;
                const isActive = active === c.key;
                return (
                  <button
                    key={c.key}
                    onClick={() => setActive(c.key)}
                    className={`px-4 py-2 rounded-full font-body text-xs md:text-sm tracking-wide border transition-all ${
                      isActive
                        ? "bg-primary text-primary-foreground border-primary"
                        : "border-border/60 text-muted-foreground hover:border-primary/50 hover:text-primary"
                    }`}
                  >
                    {c.label} ({count})
                  </button>
                );
              })}
            </div>

            {/* Accordion */}
            <div className="max-w-3xl mx-auto">
              <Accordion type="single" collapsible className="space-y-3">
                {visible.map((f) => (
                  <AccordionItem
                    key={f.id}
                    value={`q-${f.id}`}
                    id={`q-${f.id}`}
                    className="border border-border/50 rounded-xl px-5 md:px-6 bg-background/60 backdrop-blur-sm hover:border-primary/30 transition-colors duration-300 scroll-mt-24"
                  >
                    <AccordionTrigger className="font-display text-left text-base md:text-lg text-foreground hover:no-underline hover:text-primary transition-colors">
                      <h2 className="font-display text-base md:text-lg m-0 leading-snug">
                        {f.q}
                      </h2>
                    </AccordionTrigger>
                    <AccordionContent className="font-body text-muted-foreground leading-relaxed text-sm md:text-base">
                      {f.a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </section>

        <SectionDivider variant="sacred" />

        {/* CTA */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-6 text-center max-w-2xl">
            <h2 className="font-display text-3xl md:text-4xl text-foreground mb-4">
              Still have a question?
            </h2>
            <p className="font-body text-muted-foreground mb-8">
              Write to us — we answer every message ourselves, usually within a day.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                to="/contact"
                className="px-8 py-3 rounded-full bg-primary text-primary-foreground font-body text-sm tracking-wide hover:opacity-90 transition-opacity"
              >
                Contact Punarvsu
              </Link>
              <Link
                to="/#collections"
                className="px-8 py-3 rounded-full border border-primary/40 text-primary font-body text-sm tracking-wide hover:bg-primary/5 transition-colors"
              >
                Explore the Collection
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default SacredKnowledge;
