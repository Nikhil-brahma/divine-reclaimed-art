import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft, Clock, Calendar, Sparkles } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";

import blogArtisanCraft from "@/assets/blog-artisan-craft.jpg";
import blogTempleTextiles from "@/assets/blog-temple-textiles.jpg";
import blogFestivalFashion from "@/assets/blog-festival-fashion.jpg";
import blogSustainability from "@/assets/blog-sustainability.jpg";
import blogStylingGuide from "@/assets/blog-styling-guide.jpg";
import blogArtisanStories from "@/assets/blog-artisan-stories.jpg";

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  image: string;
  date: string;
  readTime: string;
  category: string;
  content: string;
  isAiGenerated?: boolean;
}

// Static/hardcoded posts
export const staticBlogPosts: BlogPost[] = [
  {
    slug: "the-sacred-journey-of-temple-textiles",
    title: "The Sacred Journey of Temple Textiles: From Deity to Devotee",
    excerpt: "Discover how centuries-old sacred garments find new life as luxury accessories, carrying blessings from temple to your everyday.",
    image: blogTempleTextiles,
    date: "February 10, 2026",
    readTime: "6 min read",
    category: "Heritage",
    content: `Every morning across India, millions of deities are adorned with fresh garments — silks woven with gold thread, cottons dyed in sacred saffron, brocades embroidered with divine motifs. These clothes, known as "Bhagwan ki Poshak," carry the energy of thousands of prayers.

But what happens when these garments are ceremonially retired? Traditionally, they were immersed in rivers or buried, contributing to textile waste. At Punarvsu, we saw an opportunity to honour these sacred fabrics while addressing a growing environmental concern.

Our journey begins at the temple doors. Being Delhi-based, our strongest temple partnership is with the iconic Khatushyam Delhi Dham, along with several other revered temples across Delhi and North India. When fabrics are retired from deity service, our collection team carefully gathers them with full reverence — no fabric touches the ground, every piece is handled with the same devotion as when it draped the divine.

The transformation process is meticulous. At our manufacturing unit in Rohini, managed by Sampurna NGO — an organisation with deep roots in social work spanning over 35 years — each fabric undergoes UV sterilisation, eco-friendly cleaning, and steam treatment. Our head artisan, Kiran Mam, then studies the patterns, colours, and textures to determine the perfect product for each textile. A Krishna Leela fabric might become a peacock-motif clutch, while a Durga Mata cloth transforms into a bold statement bag.

The result? Accessories that don't just look beautiful — they carry centuries of spiritual energy. When you carry a Punarvsu bag, you carry blessings woven into every fibre.`,
  },
  {
    slug: "art-of-upcycled-luxury",
    title: "The Art of Upcycled Luxury: Why Conscious Fashion is the Future",
    excerpt: "Explore how upcycling sacred textiles creates fashion that's both environmentally responsible and spiritually meaningful.",
    image: blogSustainability,
    date: "February 5, 2026",
    readTime: "5 min read",
    category: "Sustainability",
    content: `The fashion industry produces 92 million tonnes of textile waste annually. Fast fashion has disconnected us from the stories behind our clothes. But a revolution is brewing — one stitch at a time.

Upcycled luxury isn't about compromise. It's about elevation. When we take a sacred temple textile and transform it into a handcrafted accessory, we're not making do with scraps. We're honouring a material that carries more significance than any designer fabric ever could.

Each Punarvsu piece represents our commitment to zero waste. We've collected over 3,200 kg of temple textiles that would otherwise end up in landfills. Every scrap finds purpose — larger pieces become bags and clutches, smaller fragments become lining, and even the tiniest remnants are woven into our packaging.

The circular economy isn't just a buzzword for us — it's our dharma. Our artisans, led by Kiran Mam and Samar Mam at our Rohini workshop managed by Sampurna NGO, earn sustainable livelihoods while preserving traditional craft techniques that are disappearing in the age of machine-made fashion. Sampurna NGO has been dedicated to social work for over 35 years, making them the perfect custodians of this sacred mission.

When you choose Punarvsu, you're voting for a world where luxury and responsibility aren't contradictions. You're choosing fashion that feeds souls, not landfills.`,
  },
  {
    slug: "behind-the-hands-artisan-stories",
    title: "Behind the Hands: Stories of Our Sacred Artisans",
    excerpt: "Meet the skilled artisans at our Rohini workshop whose hands transform blessed fabrics into works of wearable art.",
    image: blogArtisanStories,
    date: "January 28, 2026",
    readTime: "7 min read",
    category: "Artisans",
    content: `In our manufacturing unit tucked in Rohini, Delhi, a team of dedicated artisans gathers every morning with a prayer. Before their hands touch sacred cloth, they light an incense stick and offer a moment of gratitude. This is where Punarvsu products are born — under the guidance of Sampurna NGO, an organisation with over 35 years of impactful social work.

Kiran Mam, one of our two head artisans, has been working with textiles for decades. "When I hold temple cloth," she says, "I feel the energy of a thousand prayers. My stitches must honour that energy." Her precision is legendary — she can cut a pattern freehand with barely a millimetre of deviation.

Samar Mam, our other head artisan, brings a unique artistic vision to every piece. Together, Kiran Mam and Samar Mam lead a talented team of craftswomen, mentoring them in pattern-making, stitching techniques, and the art of working with sacred materials. Their combined expertise ensures that every Punarvsu product meets the highest standards of quality and reverence.

Our artisans undergo months of training under Kiran Mam and Samar Mam's watchful guidance. But the most important lesson? Reverence. Every artisan understands that the material they work with isn't ordinary fabric — it's cloth that has been blessed at temples like Khatushyam Delhi Dham.

We invest in our artisans' growth through Sampurna NGO's social welfare programmes. Regular skill workshops, health insurance, and children's education support are part of our commitment. Because when artisans thrive, the art thrives. And when the art thrives, tradition lives on.

850+ hours of handcraft go into our collection every month. Each hour is infused with devotion, skill, and the quiet satisfaction of creating something meaningful.`,
  },
  {
    slug: "styling-sacred-accessories",
    title: "How to Style Sacred Accessories: A Complete Guide",
    excerpt: "From boardrooms to temples, learn how to incorporate divine-inspired accessories into your everyday wardrobe.",
    image: blogStylingGuide,
    date: "January 20, 2026",
    readTime: "4 min read",
    category: "Style Guide",
    content: `Sacred fashion isn't just for pooja rooms. Our accessories are designed to blend seamlessly into modern life while carrying their spiritual essence. Here's how to style your Punarvsu pieces for every occasion.

**For the Office:** The Bhagwa Vastra Crossbody pairs beautifully with neutral-toned formal wear. Its structured silhouette commands respect while the saffron tones add a pop of cultural pride. Pair with a crisp white kurta or a tailored blazer.

**Festival Ready:** The Durga Mata Bag was born for celebrations. Its bold crimson and gold tones echo the energy of Navratri, Diwali, and Durga Puja. Style it with your finest ethnic wear — a silk saree or embroidered lehenga.

**Everyday Sacred:** The Radha-Rani Pouch is your daily companion. Slip it into a larger bag for sacred essentials — a small murti, prayer beads, or simply your everyday items. Its compact size makes it versatile enough for brunches, market runs, or temple visits.

**Statement Piece:** The Peacock Feather Clutch is your showstopper. Reserved for occasions where you want all eyes on your accessory. Wedding receptions, art gallery openings, or cultural events — let the Krishna-inspired motifs do the talking.

**Travel Companion:** The Janmashtami Tote is spacious, sturdy, and spiritual. Perfect for weekend getaways, book club meetings, or as a unique carry-on that sparks conversations at airports.

Remember: there's no wrong way to carry a blessing. Let your Punarvsu accessory be an extension of your devotion, wherever you go.`,
  },
  {
    slug: "festive-gifting-with-purpose",
    title: "Festive Gifting with Purpose: Sacred Accessories for Every Occasion",
    excerpt: "Why Punarvsu accessories make the most meaningful gifts for Diwali, weddings, and every celebration in between.",
    image: blogFestivalFashion,
    date: "January 12, 2026",
    readTime: "5 min read",
    category: "Gifting",
    content: `Gift-giving in Indian culture is an act of love, respect, and blessings. But in a world of mass-produced options, finding a gift that truly means something has become a challenge. Enter Punarvsu — where every gift carries the weight of a thousand prayers.

**Diwali:** The festival of lights deserves gifts that shine with purpose. Our Peacock Feather Clutch, wrapped in our signature marigold packaging, makes an unforgettable Diwali gift. It says: "I chose something made with devotion, not just bought in a mall."

**Weddings:** Forget generic gift hampers. A Punarvsu bag as a wedding gift carries a blessing for the couple's new journey together. Our Durga Mata Bag, symbolising feminine strength, is particularly meaningful for brides.

**Raksha Bandhan:** Gift your sister something she'll carry every day — a Radha-Rani Pouch that reminds her of your bond and the divine feminine.

**Corporate Gifting:** Companies are increasingly seeking purposeful gifts for clients and employees. Our wholesale programme offers customised packaging, personalised notes, and bulk pricing. It's CSR and gifting in one beautiful package.

**Just Because:** The best gifts need no occasion. Surprise someone with a Punarvsu accessory and give them a piece of Indian heritage they'll treasure forever.

We offer gift wrapping with sacred motifs, handwritten blessing cards, and the option to include a certificate of authenticity that tells the story of the specific temple textile used. Each piece crafted at our Rohini workshop carries the blessings of Khatushyam Delhi Dham and other revered temples.`,
  },
  {
    slug: "craft-of-sacred-stitching",
    title: "The Craft of Sacred Stitching: From Temple Cloth to Luxury Bag",
    excerpt: "A deep dive into the 5-step artisan process that transforms blessed temple fabrics into your favourite Punarvsu accessory.",
    image: blogArtisanCraft,
    date: "January 5, 2026",
    readTime: "6 min read",
    category: "Process",
    content: `Creating a Punarvsu accessory is a ritual in itself. Our 5-step process, carried out at our Rohini manufacturing unit managed by Sampurna NGO, ensures that every sacred textile is treated with the reverence it deserves while being transformed into a product of the highest quality.

**Step 1 — Collection:** Our team collects retired deity garments from our partner temples, with Khatushyam Delhi Dham being our most prominent source. Each fabric is catalogued with its temple of origin, the deity it served, and the approximate period of service. This provenance becomes part of your product's story.

**Step 2 — Sanitisation:** The collected fabrics undergo our proprietary 3-phase cleaning: UV-C light sterilisation kills 99.9% of bacteria, plant-based detergent washing removes surface impurities, and industrial steam treatment ensures deep hygiene. The process is gentle enough to preserve the fabric's original colours and patterns.

**Step 3 — Design & Cutting:** Our head artisans, Kiran Mam and Samar Mam, study each fabric's unique characteristics. A heavy brocade might become a structured tote, while a delicate silk transforms into a clutch. Patterns are hand-drawn on each fabric to maximise the most beautiful sections while minimising waste.

**Step 4 — Handcrafting:** This is where the magic happens. Under the expert guidance of Kiran Mam and Samar Mam, our artisans stitch each piece by hand, using techniques passed down through generations. Zari borders become decorative accents, temple motifs are centred for maximum impact, and hardware is carefully selected to complement each fabric's personality.

**Step 5 — Quality Check:** Every finished product passes through a 12-point quality inspection. We check stitching strength, hardware alignment, colour consistency, lining finish, and overall aesthetics. Only pieces that meet our exacting standards earn the Punarvsu tag.

The entire process takes 8–15 hours per product. It cannot be rushed, and it cannot be replicated by machines. That's what makes each Punarvsu piece truly one of a kind.`,
  },
];

// For backward compat with BlogPost page
export const blogPosts = staticBlogPosts;

const Blog = () => {
  // Fetch AI-generated posts from database
  const { data: aiPosts } = useQuery({
    queryKey: ["auto-blog-posts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("auto_blog_posts")
        .select("*")
        .eq("published", true)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data || [];
    },
  });

  // Merge AI posts (newest first) with static posts
  const dynamicPosts: BlogPost[] = (aiPosts || []).map((p: any) => ({
    slug: `ai/${p.slug}`,
    title: p.title,
    excerpt: p.excerpt,
    image: blogTempleTextiles, // default image for AI posts
    date: new Date(p.created_at).toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" }),
    readTime: `${Math.ceil(p.content.length / 1200)} min read`,
    category: p.category,
    content: p.content,
    isAiGenerated: true,
  }));

  const allPosts = [...dynamicPosts, ...staticBlogPosts];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-20">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Link
              to="/"
              className="inline-flex items-center gap-2 font-body text-sm text-muted-foreground hover:text-primary transition-colors mb-8"
            >
              <ArrowLeft size={16} /> Back to Home
            </Link>

            <div className="text-center mb-16">
              <span className="font-body text-xs tracking-[0.4em] uppercase text-primary/60 block mb-3">
                Stories & Insights
              </span>
              <h1 className="font-display text-4xl md:text-6xl text-foreground">
                The Punarvsu <span className="text-gradient-gold">Journal</span>
              </h1>
              <p className="font-body text-muted-foreground mt-3 max-w-lg mx-auto">
                Exploring the intersection of sacred tradition, conscious fashion, and artisan craft.
              </p>
            </div>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {allPosts.map((post, i) => (
              <motion.div
                key={post.slug}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 * Math.min(i, 5) }}
              >
                <Link to={`/blog/${post.slug}`} className="group block">
                  <div className="relative overflow-hidden rounded-2xl mb-4 aspect-[3/2]">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      loading="lazy"
                    />
                    <div className="absolute top-3 left-3 flex gap-2">
                      <span className="bg-primary/90 text-primary-foreground font-body text-[10px] tracking-wider uppercase px-3 py-1 rounded-full">
                        {post.category}
                      </span>
                      {post.isAiGenerated && (
                        <span className="bg-accent/90 text-accent-foreground font-body text-[10px] tracking-wider uppercase px-2 py-1 rounded-full flex items-center gap-1">
                          <Sparkles size={10} /> AI
                        </span>
                      )}
                    </div>
                  </div>
                  <h3 className="font-display text-lg text-foreground group-hover:text-primary transition-colors line-clamp-2 mb-2">
                    {post.title}
                  </h3>
                  <p className="font-body text-sm text-muted-foreground line-clamp-2 mb-3">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center gap-4 font-body text-xs text-muted-foreground/60">
                    <span className="flex items-center gap-1">
                      <Calendar size={12} /> {post.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock size={12} /> {post.readTime}
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Blog;
