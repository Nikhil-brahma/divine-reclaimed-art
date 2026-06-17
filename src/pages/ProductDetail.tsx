import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Loader2, ArrowLeft, ShoppingBag, ShieldCheck, Truck, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useStoreCart } from "@/stores/storeCart";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import StructuredData from "@/components/StructuredData";


interface Product {
  id: string; handle: string; title: string; description: string | null;
  price: number; compare_at_price: number | null; currency: string;
  stock: number; sku: string | null; category: string | null; tags: string[] | null;
  images: string[] | null; weight_grams: number | null;
  seo_title: string | null; seo_description: string | null;
}

const ProductDetail = () => {
  const { handle } = useParams<{ handle: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [qty, setQty] = useState(1);
  const addItem = useStoreCart((s) => s.addItem);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const { data } = await supabase.from("products").select("*").eq("handle", handle).eq("status", "active").maybeSingle();
      setProduct((data as Product) || null);
      setLoading(false);
      setSelectedImage(0);
      setQty(1);
    })();
  }, [handle]);

  // SEO handled via <SEOHead /> + <StructuredData /> in render



  if (loading) {
    return (
      <div className="min-h-screen bg-background"><Navbar />
        <div className="flex justify-center items-center h-[60vh]"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background"><Navbar />
        <div className="flex flex-col justify-center items-center h-[60vh] gap-3">
          <ShoppingBag className="w-16 h-16 text-muted-foreground" />
          <h2 className="font-display text-2xl">Product not found</h2>
          <Link to="/#collections" className="font-body text-primary hover:underline">← Back to collection</Link>
        </div>
      </div>
    );
  }

  const images = (product.images && product.images.length > 0) ? product.images : ["/placeholder.svg"];
  const soldOut = product.stock <= 0;

  const handleAdd = () => {
    if (soldOut) return;
    addItem({
      productId: product.id, handle: product.handle, title: product.title,
      image: images[0], price: product.price, stock: product.stock,
    }, qty);
    toast.success(`${product.title} added to cart`);
  };

  const productUrl = `https://punarvsu.com/products/${product.handle}`;
  const productImg = images[0]?.startsWith("http") ? images[0] : `https://punarvsu.com${images[0]}`;
  const seoTitle = product.seo_title || `${product.title} · Punarvsu`;
  const seoDesc = (product.seo_description || product.description || `${product.title} — handcrafted from sacred temple textiles by Punarvsu artisans in Delhi.`).slice(0, 160);

  return (
    <div className="min-h-screen bg-background">
      <SEOHead title={seoTitle} description={seoDesc} canonical={productUrl} type="product" image={productImg} />
      <StructuredData productData={{
        name: product.title,
        description: seoDesc,
        image: productImg,
        price: String(product.price),
        currency: product.currency || "INR",
        sku: product.sku || product.handle,
        available: !soldOut,
        url: productUrl,
      }} />
      <Navbar />
      <main className="pt-28 pb-20">

        <div className="container mx-auto px-6">
          <Link to="/#collections" className="inline-flex items-center gap-2 font-body text-sm text-muted-foreground hover:text-primary transition-colors mb-8">
            <ArrowLeft size={16} /> Back to Collection
          </Link>

          <div className="grid md:grid-cols-2 gap-12">
            {/* Images */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
              <div className="aspect-square rounded-2xl overflow-hidden glass-card mb-4">
                <img src={images[selectedImage]} alt={product.title} className="w-full h-full object-cover" />
              </div>
              {images.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-1">
                  {images.map((img, i) => (
                    <button key={i} onClick={() => setSelectedImage(i)}
                            className={`w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-colors ${i === selectedImage ? "border-primary" : "border-transparent hover:border-primary/40"}`}>
                      <img src={img} alt={`${product.title} — view ${i + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Info */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.15 }}>
              {product.category && (
                <p className="font-body text-[10px] tracking-[0.4em] uppercase text-primary mb-2">{product.category}</p>
              )}
              <h1 className="font-display text-3xl md:text-5xl text-foreground mb-4">{product.title}</h1>
              <div className="flex items-baseline gap-3 mb-6">
                <span className="font-display text-3xl text-foreground">₹{product.price.toLocaleString("en-IN")}</span>
                {product.compare_at_price && product.compare_at_price > product.price && (
                  <>
                    <span className="font-body text-base text-muted-foreground line-through">₹{product.compare_at_price.toLocaleString("en-IN")}</span>
                    <span className="text-[10px] uppercase tracking-wider bg-primary/10 text-primary px-2 py-0.5 rounded">
                      Save ₹{(product.compare_at_price - product.price).toLocaleString("en-IN")}
                    </span>
                  </>
                )}
              </div>

              <p className="font-body text-muted-foreground leading-relaxed mb-6 whitespace-pre-line">
                {product.description}
              </p>

              {product.tags && product.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {product.tags.map((t) => (
                    <span key={t} className="text-[10px] uppercase tracking-wider text-muted-foreground bg-muted/50 px-2.5 py-1 rounded-full">{t}</span>
                  ))}
                </div>
              )}

              {/* Quantity + CTA */}
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-2 border border-border/60 rounded-full px-2 py-1">
                  <button onClick={() => setQty(Math.max(1, qty - 1))} className="w-7 h-7 rounded-full hover:bg-muted">−</button>
                  <span className="w-8 text-center font-body text-sm">{qty}</span>
                  <button onClick={() => setQty(Math.min(product.stock || 99, qty + 1))} className="w-7 h-7 rounded-full hover:bg-muted">+</button>
                </div>
                <span className="font-body text-[11px] text-muted-foreground">
                  {soldOut ? "Sold out" : `${product.stock} in stock`}
                </span>
              </div>

              <button onClick={handleAdd} disabled={soldOut}
                      className="w-full bg-gradient-saffron text-primary-foreground px-8 py-4 rounded-full font-body text-sm tracking-[0.2em] uppercase hover:opacity-90 transition-opacity disabled:opacity-40 shadow-sacred">
                {soldOut ? "Sold Out" : "Add to Cart"}
              </button>

              <div className="grid grid-cols-3 gap-3 mt-6">
                {[
                  { icon: ShieldCheck, label: "Sacredly upcycled" },
                  { icon: Truck, label: "Free over ₹1,500" },
                  { icon: Sparkles, label: "Handcrafted" },
                ].map((b) => (
                  <div key={b.label} className="text-center p-3 rounded-xl glass-card">
                    <b.icon size={16} className="text-primary mx-auto mb-1" />
                    <p className="font-body text-[10px] text-muted-foreground">{b.label}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProductDetail;
