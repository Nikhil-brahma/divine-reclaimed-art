import { useEffect, useState, useRef, lazy, Suspense } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Loader2, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";
import { storefrontApiRequest, PRODUCTS_QUERY, type ShopifyProduct } from "@/lib/shopify";
import { useCartStore } from "@/stores/cartStore";
import { toast } from "sonner";

const SacredParticles = lazy(() => import("@/components/SacredParticles"));

const ProductCard3D = ({ product, index, formatPrice, onAddToCart, isCartLoading }: {
  product: ShopifyProduct;
  index: number;
  formatPrice: (p: ShopifyProduct) => string;
  onAddToCart: (p: ShopifyProduct, e: React.MouseEvent) => void;
  isCartLoading: boolean;
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setRotateY(x * 15);
    setRotateX(-y * 10);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 60, rotateX: 10 }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.8, delay: index * 0.12, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="group perspective-1000"
    >
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
          transition: "transform 0.15s ease-out",
          transformStyle: "preserve-3d",
        }}
        className="bg-card rounded-sm overflow-hidden shadow-sm hover:shadow-sacred transition-shadow duration-500 relative"
      >
        {/* Gold shimmer border on hover */}
        <div className="absolute inset-0 rounded-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-20"
          style={{
            background: "linear-gradient(135deg, hsl(42 85% 55% / 0.15), transparent 40%, transparent 60%, hsl(42 85% 55% / 0.15))",
          }}
        />
        
        <Link to={`/product/${product.node.handle}`} className="block">
          <div className="aspect-[3/4] overflow-hidden bg-muted relative">
            <motion.img
              src={product.node.images.edges[0]?.node.url || "/placeholder.svg"}
              alt={product.node.images.edges[0]?.node.altText || product.node.title}
              className="w-full h-full object-cover object-center"
              loading="lazy"
              style={{ transform: `scale(${1 + Math.abs(rotateX + rotateY) * 0.005})` }}
            />
            {/* Depth overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-temple-dark/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            {/* Floating badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 + index * 0.1 }}
              className="absolute top-4 right-4 bg-temple-dark/80 backdrop-blur-sm text-ivory font-body text-[9px] tracking-[0.3em] uppercase px-3 py-1.5 rounded-sm"
              style={{ transform: "translateZ(20px)" }}
            >
              Sacred
            </motion.div>
          </div>
          <div className="p-5 relative" style={{ transform: "translateZ(10px)" }}>
            <h3 className="font-display text-xl text-foreground mt-1 mb-1 group-hover:text-primary transition-colors">
              {product.node.title}
            </h3>
            <p className="font-body text-xs text-muted-foreground mb-3 line-clamp-2">
              {product.node.description}
            </p>
            <div className="flex items-center justify-between">
              <span className="font-display text-lg text-foreground">{formatPrice(product)}</span>
              <button
                onClick={(e) => onAddToCart(product, e)}
                disabled={isCartLoading}
                className="font-body text-[10px] tracking-[0.2em] uppercase text-primary hover:text-accent transition-colors disabled:opacity-50 group-hover:translate-x-1 duration-300"
              >
                Add to Cart →
              </button>
            </div>
          </div>
        </Link>
      </div>
    </motion.div>
  );
};

const CollectionsSection = () => {
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const addItem = useCartStore((s) => s.addItem);
  const isCartLoading = useCartStore((s) => s.isLoading);
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const bgY = useTransform(scrollYProgress, [0, 1], [50, -50]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await storefrontApiRequest(PRODUCTS_QUERY, { first: 20 });
        setProducts(data?.data?.products?.edges || []);
      } catch (err) {
        console.error("Failed to fetch products:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleAddToCart = async (product: ShopifyProduct, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const variant = product.node.variants.edges[0]?.node;
    if (!variant || !variant.availableForSale) return;
    await addItem({
      product,
      variantId: variant.id,
      variantTitle: variant.title,
      price: variant.price,
      quantity: 1,
      selectedOptions: variant.selectedOptions || [],
    });
    toast.success(`${product.node.title} added to cart`);
  };

  const formatPrice = (product: ShopifyProduct) => {
    const p = product.node.priceRange.minVariantPrice;
    return `${p.currencyCode === 'INR' ? '₹' : p.currencyCode} ${parseFloat(p.amount).toFixed(2)}`;
  };

  return (
    <section ref={sectionRef} id="collections" className="relative py-32 bg-background overflow-hidden">
      {/* Subtle particles in background */}
      <Suspense fallback={null}>
        <div className="absolute inset-0 opacity-30">
          <SacredParticles />
        </div>
      </Suspense>

      <motion.div className="container mx-auto px-6 relative z-10" style={{ y: bgY }}>
        {/* Section header with cinematic reveal */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="text-center mb-20"
        >
          <motion.span
            initial={{ opacity: 0, letterSpacing: "0.2em" }}
            whileInView={{ opacity: 1, letterSpacing: "0.4em" }}
            viewport={{ once: true }}
            transition={{ duration: 1.2 }}
            className="font-body text-xs uppercase text-primary mb-4 block"
          >
            Made by Hand, Meant for You
          </motion.span>
          <h2 className="font-display text-5xl md:text-7xl font-light text-foreground mb-4">
            The <span className="italic text-gradient-gold">Collection</span>
          </h2>
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: 80 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.3 }}
            className="ornament-line mx-auto mt-6"
          />
        </motion.div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20">
            <ShoppingBag className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-display text-2xl text-foreground mb-2">No products yet</h3>
            <p className="font-body text-muted-foreground">
              Products added to your Shopify store will appear here automatically.
            </p>
          </div>
        ) : (
          <>
            {/* Featured product — cinematic reveal */}
            {products.length > 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="grid md:grid-cols-2 gap-0 mb-12 rounded-sm overflow-hidden shadow-sacred bg-card relative group"
              >
                {/* Animated border glow */}
                <div className="absolute inset-0 rounded-sm opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none z-10"
                  style={{
                    boxShadow: "inset 0 0 30px hsl(42 85% 55% / 0.1), 0 0 60px hsl(30 80% 48% / 0.15)",
                  }}
                />
                
                <Link to={`/product/${products[0].node.handle}`} className="aspect-[4/5] md:aspect-auto overflow-hidden relative">
                  <motion.img
                    src={products[0].node.images.edges[0]?.node.url || "/placeholder.svg"}
                    alt={products[0].node.images.edges[0]?.node.altText || products[0].node.title}
                    className="w-full h-full object-cover object-center"
                    whileHover={{ scale: 1.08 }}
                    transition={{ duration: 0.7 }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent to-card/20" />
                </Link>
                <div className="flex flex-col justify-center p-8 md:p-16 relative">
                  <motion.div
                    initial={{ opacity: 0, x: 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                  >
                    <span className="font-body text-[10px] tracking-[0.4em] uppercase text-primary mb-3 block">
                      Featured Piece
                    </span>
                    <h3 className="font-display text-3xl md:text-5xl text-foreground mb-4 leading-tight">
                      <Link to={`/product/${products[0].node.handle}`} className="hover:text-primary transition-colors">
                        {products[0].node.title}
                      </Link>
                    </h3>
                    <p className="font-body text-muted-foreground mb-8 leading-relaxed line-clamp-3">
                      {products[0].node.description}
                    </p>
                    <div className="flex items-center gap-6">
                      <span className="font-display text-3xl text-foreground">{formatPrice(products[0])}</span>
                      <motion.button
                        onClick={(e) => handleAddToCart(products[0], e)}
                        disabled={isCartLoading}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.98 }}
                        className="bg-gradient-saffron text-primary-foreground px-8 py-4 rounded-sm font-body text-xs tracking-[0.2em] uppercase hover:opacity-90 transition-opacity disabled:opacity-50 shadow-sacred relative overflow-hidden"
                      >
                        <span className="relative z-10">Add to Cart</span>
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-transparent via-ivory/10 to-transparent"
                          animate={{ x: ["-100%", "200%"] }}
                          transition={{ duration: 3, repeat: Infinity, repeatDelay: 3 }}
                        />
                      </motion.button>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            )}

            {/* 3D Product grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {products.slice(1).map((product, i) => (
                <ProductCard3D
                  key={product.node.id}
                  product={product}
                  index={i}
                  formatPrice={formatPrice}
                  onAddToCart={handleAddToCart}
                  isCartLoading={isCartLoading}
                />
              ))}
            </div>
          </>
        )}
      </motion.div>
    </section>
  );
};

export default CollectionsSection;
