import { useEffect, useRef, useState, lazy, Suspense } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Loader2, ShoppingBag, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useStoreCart } from "@/stores/storeCart";
import { toast } from "sonner";

const SacredParticles = lazy(() => import("@/components/SacredParticles"));

interface Product {
  id: string;
  handle: string;
  title: string;
  description: string | null;
  price: number;
  compare_at_price: number | null;
  currency: string;
  stock: number;
  category: string | null;
  tags: string[] | null;
  images: string[] | null;
  status: string;
}

const formatINR = (n: number) => `₹${n.toLocaleString("en-IN")}`;

const GlassProductCard = ({ product, index }: { product: Product; index: number }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const addItem = useStoreCart((s) => s.addItem);

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const r = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    setTilt({ x: -y * 8, y: x * 12 });
  };

  const img = product.images?.[0] || "/placeholder.svg";
  const soldOut = product.stock <= 0;

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation();
    if (soldOut) { toast.error("Sold out"); return; }
    addItem({ productId: product.id, handle: product.handle, title: product.title, image: img, price: product.price, stock: product.stock });
    toast.success(`${product.title} added to cart`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.7, delay: index * 0.08, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="group perspective-1000"
    >
      <div
        ref={cardRef}
        onMouseMove={handleMove}
        onMouseLeave={() => setTilt({ x: 0, y: 0 })}
        style={{
          transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
          transition: "transform 0.2s ease-out",
          transformStyle: "preserve-3d",
        }}
        className="relative rounded-2xl overflow-hidden glass-card shadow-sm hover:shadow-sacred transition-shadow duration-500"
      >
        {/* Gold sheen sweep */}
        <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 z-20"
             style={{ background: "linear-gradient(135deg, hsl(42 85% 55% / 0.18), transparent 35%, transparent 65%, hsl(30 80% 48% / 0.18))" }} />

        <Link to={`/product/${product.handle}`} className="block">
          <div className="aspect-[3/4] overflow-hidden bg-muted relative">
            <motion.img
              src={img}
              alt={product.title}
              className="w-full h-full object-cover object-center"
              loading="lazy"
              whileHover={{ scale: 1.06 }}
              transition={{ duration: 0.6 }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-temple-dark/40 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-500" />
            <div className="absolute top-3 right-3 inline-flex items-center gap-1 backdrop-blur-md bg-white/30 border border-white/40 text-foreground font-body text-[10px] tracking-[0.25em] uppercase px-3 py-1 rounded-full" style={{ transform: "translateZ(25px)" }}>
              <Sparkles size={10} className="text-primary" /> Sacred
            </div>
            {soldOut && (
              <div className="absolute top-3 left-3 bg-destructive/90 backdrop-blur text-destructive-foreground font-body text-[10px] tracking-[0.25em] uppercase px-3 py-1 rounded-full">
                Sold out
              </div>
            )}
            {product.compare_at_price && product.compare_at_price > product.price && !soldOut && (
              <div className="absolute top-3 left-3 bg-primary/90 backdrop-blur text-primary-foreground font-body text-[10px] tracking-[0.25em] uppercase px-3 py-1 rounded-full">
                Save ₹{(product.compare_at_price - product.price).toLocaleString("en-IN")}
              </div>
            )}
          </div>

          <div className="p-5 relative backdrop-blur-md bg-white/40 border-t border-white/40" style={{ transform: "translateZ(10px)" }}>
            {product.category && (
              <p className="font-body text-[9px] tracking-[0.3em] uppercase text-primary/80 mb-1">{product.category}</p>
            )}
            <h3 className="font-display text-xl text-foreground mb-1 group-hover:text-primary transition-colors line-clamp-1">
              {product.title}
            </h3>
            <p className="font-body text-xs text-muted-foreground mb-3 line-clamp-2 min-h-[2.5rem]">
              {product.description || "A blessing in physical form."}
            </p>
            <div className="flex items-end justify-between gap-2">
              <div>
                <span className="font-display text-lg text-foreground">{formatINR(product.price)}</span>
                {product.compare_at_price && product.compare_at_price > product.price && (
                  <span className="ml-2 font-body text-xs text-muted-foreground line-through">{formatINR(product.compare_at_price)}</span>
                )}
              </div>
              <button
                onClick={handleAdd}
                disabled={soldOut}
                className="font-body text-[10px] tracking-[0.2em] uppercase text-primary hover:text-accent transition-all disabled:opacity-40 group-hover:translate-x-1 duration-300"
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

const NativeCollections = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] });
  const bgY = useTransform(scrollYProgress, [0, 1], [50, -50]);

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from("products")
        .select("id, handle, title, description, price, compare_at_price, currency, stock, category, tags, images, status")
        .eq("status", "active")
        .order("updated_at", { ascending: false });
      if (error) console.error(error);
      setProducts((data || []) as Product[]);
      setLoading(false);
    })();
  }, []);

  return (
    <section ref={sectionRef} id="collections" className="relative py-32 bg-background overflow-hidden">
      <Suspense fallback={null}>
        <div className="absolute inset-0 opacity-30 pointer-events-none">
          <SacredParticles />
        </div>
      </Suspense>

      <motion.div className="container mx-auto px-6 relative z-10" style={{ y: bgY }}>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="text-center mb-20"
        >
          <span className="font-body text-xs tracking-[0.4em] uppercase text-primary mb-4 block">
            Made by Hand, Meant for You
          </span>
          <h2 className="font-display text-5xl md:text-7xl font-light text-foreground mb-4">
            The <span className="italic text-gradient-gold">Collection</span>
          </h2>
          <div className="ornament-line mx-auto mt-6 w-20" />
        </motion.div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20 max-w-md mx-auto rounded-2xl glass-card p-12">
            <ShoppingBag className="w-16 h-16 text-primary/60 mx-auto mb-4" />
            <h3 className="font-display text-2xl text-foreground mb-2">Your collection awaits</h3>
            <p className="font-body text-muted-foreground text-sm">
              Add your first product in the <Link to="/admin" className="text-primary underline">admin panel</Link> and it will appear here instantly.
            </p>
          </div>
        ) : (
          <>
            {/* Featured hero piece */}
            {products[0] && (
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1 }}
                className="grid md:grid-cols-2 gap-0 mb-14 rounded-3xl overflow-hidden glass-card shadow-sacred relative group"
              >
                <Link to={`/product/${products[0].handle}`} className="aspect-[4/5] md:aspect-auto overflow-hidden relative">
                  <motion.img
                    src={products[0].images?.[0] || "/placeholder.svg"}
                    alt={products[0].title}
                    className="w-full h-full object-cover"
                    whileHover={{ scale: 1.08 }}
                    transition={{ duration: 0.8 }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent to-background/30" />
                </Link>
                <div className="flex flex-col justify-center p-8 md:p-16 relative backdrop-blur-md bg-white/30">
                  <span className="font-body text-[10px] tracking-[0.4em] uppercase text-primary mb-3 block">Featured Piece</span>
                  <h3 className="font-display text-3xl md:text-5xl text-foreground mb-4 leading-tight">
                    <Link to={`/product/${products[0].handle}`} className="hover:text-primary transition-colors">
                      {products[0].title}
                    </Link>
                  </h3>
                  <p className="font-body text-muted-foreground mb-8 leading-relaxed line-clamp-3">
                    {products[0].description}
                  </p>
                  <div className="flex items-center gap-6 flex-wrap">
                    <span className="font-display text-3xl text-foreground">{formatINR(products[0].price)}</span>
                    <Link
                      to={`/product/${products[0].handle}`}
                      className="bg-gradient-saffron text-primary-foreground px-8 py-4 rounded-full font-body text-xs tracking-[0.2em] uppercase hover:opacity-90 transition-opacity shadow-sacred"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </motion.div>
            )}

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {products.slice(1).map((p, i) => (
                <GlassProductCard key={p.id} product={p} index={i} />
              ))}
            </div>
          </>
        )}
      </motion.div>
    </section>
  );
};

export default NativeCollections;
