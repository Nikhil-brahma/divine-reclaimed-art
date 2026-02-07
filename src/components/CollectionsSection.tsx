import { motion } from "framer-motion";
import krishnaClutch from "@/assets/product-krishna-clutch.jpg";
import templeTote from "@/assets/product-temple-tote.jpg";
import saffronCrossbody from "@/assets/product-saffron-crossbody.jpg";
import durgaBag from "@/assets/product-durga-bag.jpg";
import radhaPouch from "@/assets/product-radha-pouch.jpg";

const products = [
  {
    name: "Peacock Feather Clutch",
    collection: "Krishna Collection",
    price: "₹4,999",
    image: krishnaClutch,
    description: "Adorned with peacock feather motifs from Lord Krishna's poshak",
  },
  {
    name: "Janmashtami Tote",
    collection: "Krishna Collection",
    price: "₹6,499",
    image: templeTote,
    description: "Grand festival-wear brocade with heavy embroidery",
  },
  {
    name: "Bhagwa Vastra Crossbody",
    collection: "Temple Collection",
    price: "₹5,299",
    image: saffronCrossbody,
    description: "Sacred saffron fabric symbolizing purity and sacrifice",
  },
  {
    name: "Durga Mata Bag",
    collection: "Devi Collection",
    price: "₹7,999",
    image: durgaBag,
    description: "Powerful reds and golds from Devi Durga's divine sarees",
  },
  {
    name: "Radha-Rani Pouch",
    collection: "Krishna Collection",
    price: "₹2,499",
    image: radhaPouch,
    description: "Delicate floral patterns in soft pastels of Radha-Rani",
  },
];

const CollectionsSection = () => {
  return (
    <section id="collections" className="py-24 bg-background">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <span className="font-body text-xs tracking-[0.4em] uppercase text-primary mb-4 block">
            Handcrafted with Devotion
          </span>
          <h2 className="font-display text-4xl md:text-6xl font-light text-foreground mb-4">
            Our <span className="italic text-gradient-gold">Collections</span>
          </h2>
          <div className="ornament-line w-20 mx-auto mt-6" />
        </motion.div>

        {/* Featured product - large */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="grid md:grid-cols-2 gap-0 mb-8 rounded-sm overflow-hidden shadow-sacred bg-card"
        >
          <div className="aspect-square md:aspect-auto overflow-hidden">
            <img
              src={products[0].image}
              alt={products[0].name}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
            />
          </div>
          <div className="flex flex-col justify-center p-8 md:p-16">
            <span className="font-body text-xs tracking-[0.3em] uppercase text-primary mb-3">
              {products[0].collection}
            </span>
            <h3 className="font-display text-3xl md:text-4xl text-foreground mb-4">
              {products[0].name}
            </h3>
            <p className="font-body text-muted-foreground mb-6 leading-relaxed">
              {products[0].description}. Made from a Krishna Bhagwan Poshak, this clutch is perfect
              for special occasions — a stylish way to carry the playful energy of Kanha.
            </p>
            <div className="flex items-center gap-6">
              <span className="font-display text-2xl text-foreground">{products[0].price}</span>
              <button className="bg-gradient-saffron text-primary-foreground px-6 py-3 rounded-sm font-body text-xs tracking-[0.2em] uppercase hover:opacity-90 transition-opacity">
                View Details
              </button>
            </div>
          </div>
        </motion.div>

        {/* Product grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.slice(1).map((product, i) => (
            <motion.div
              key={product.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="group bg-card rounded-sm overflow-hidden shadow-sm hover:shadow-sacred transition-shadow duration-500"
            >
              <div className="aspect-square overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  loading="lazy"
                />
              </div>
              <div className="p-5">
                <span className="font-body text-[10px] tracking-[0.3em] uppercase text-primary">
                  {product.collection}
                </span>
                <h3 className="font-display text-xl text-foreground mt-1 mb-1">{product.name}</h3>
                <p className="font-body text-xs text-muted-foreground mb-3 line-clamp-2">
                  {product.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="font-display text-lg text-foreground">{product.price}</span>
                  <button className="font-body text-[10px] tracking-[0.2em] uppercase text-primary hover:text-saffron transition-colors">
                    Shop →
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CollectionsSection;
