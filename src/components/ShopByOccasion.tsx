import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import { Gem, Gift, Flame, Leaf } from "lucide-react";

const tiles = [
  {
    icon: Gem,
    title: "Bridal Potli Bags & Wedding Clutches",
    text: "Zari-embroidered, velvet and golden potli bags for the bride. Bulk orders available.",
    to: "/#collections",
  },
  {
    icon: Gift,
    title: "Shagun & Wedding Return Gift Bags",
    text: "Potli bags for shagun ceremonies, return gifts and wedding favours for your guests.",
    to: "/#collections",
  },
  {
    icon: Flame,
    title: "Pooja & Temple Bags",
    text: "Sacred pooja cloth bags and mandir bags crafted from Bhagwan Vastra — blessed from the first stitch.",
    to: "/#collections",
  },
  {
    icon: Leaf,
    title: "Eco-Friendly & Recycled Cotton Tote Bags",
    text: "Recycled cotton tote bags and sustainable wedding bags — temple cloth given a purposeful second life.",
    to: "/#collections",
  },
];

const ShopByOccasion = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const goToCollections = (e: React.MouseEvent) => {
    e.preventDefault();
    const scroll = () =>
      document.getElementById("collections")?.scrollIntoView({ behavior: "smooth" });
    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(scroll, 500);
    } else {
      scroll();
    }
  };

  return (
    <section id="shop-by-occasion" className="py-20 md:py-24 bg-background relative">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
          className="text-center mb-12"
        >
          <span className="font-body text-xs tracking-[0.4em] uppercase text-primary/70 block mb-3">
            Find Your Moment
          </span>
          <h2 className="font-display text-4xl md:text-6xl font-light text-foreground">
            Shop by <span className="italic text-gradient-gold">Occasion</span>
          </h2>
          <div className="ornament-line mx-auto mt-6 w-20" />
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {tiles.map((tile, i) => (
            <motion.div
              key={tile.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
            >
              <a
                href="/#collections"
                onClick={goToCollections}
                className="group block h-full rounded-2xl border border-border/60 bg-card/60 backdrop-blur-sm p-6 hover:border-primary/40 hover:shadow-sacred transition-all duration-300 cursor-pointer"
              >
                <span className="inline-flex w-11 h-11 items-center justify-center rounded-full border border-primary/25 text-primary mb-4 group-hover:bg-primary/10 transition-colors">
                  <tile.icon size={18} aria-hidden="true" />
                </span>
                <h3 className="font-display text-lg text-foreground mb-2 group-hover:text-primary transition-colors">
                  {tile.title}
                </h3>
                <p className="font-body text-sm text-muted-foreground leading-relaxed">{tile.text}</p>
                <span className="font-body text-[10px] tracking-[0.25em] uppercase text-primary mt-4 inline-block group-hover:translate-x-1 transition-transform">
                  Shop now →
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ShopByOccasion;
