import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, RotateCw } from "lucide-react";
import { Link } from "react-router-dom";
import { useStoreCart } from "@/stores/storeCart";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export interface GlassProduct {
  id: string;
  handle: string;
  title: string;
  description?: string | null;
  price: number;
  compare_at_price?: number | null;
  currency?: string;
  stock: number;
  category?: string | null;
  images?: string[] | null;
}

interface ProductMedia {
  hero_url: string | null;
  angle_urls: string[];
  spin_urls: string[];
}

const formatINR = (n: number) => `₹${n.toLocaleString("en-IN")}`;

const AURA_COLORS: Record<string, string> = {
  Devotion: "hsl(0 65% 35%)",
  "Temple Garden": "hsl(120 35% 28%)",
  default: "hsl(42 85% 55%)",
};

interface Props {
  product: GlassProduct;
  index?: number;
  media?: ProductMedia | null;
}

export const GlassProductCard = ({ product, index = 0, media: mediaProp }: Props) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const spinTimer = useRef<number | null>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [media, setMedia] = useState<ProductMedia | null>(mediaProp ?? null);
  const [spinFrame, setSpinFrame] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);
  const addItem = useStoreCart((s) => s.addItem);

  // Fetch enhanced media if not provided
  useEffect(() => {
    if (mediaProp !== undefined) return;
    let cancelled = false;
    (async () => {
      const { data } = await (supabase as any)
        .from("product_media")
        .select("hero_url, angle_urls, spin_urls")
        .eq("product_id", product.id)
        .maybeSingle();
      if (!cancelled && data) setMedia(data as ProductMedia);
    })();
    return () => { cancelled = true; };
  }, [product.id, mediaProp]);

  const heroImg = media?.hero_url || product.images?.[0] || "/placeholder.svg";
  const spinFrames = media?.spin_urls || [];
  const currentImg = spinning && spinFrames.length > 1 ? spinFrames[spinFrame % spinFrames.length] : heroImg;
  const soldOut = product.stock <= 0;
  const aura = AURA_COLORS[product.category || "default"] || AURA_COLORS.default;

  const startSpin = () => {
    if (spinFrames.length < 2) return;
    setSpinning(true);
    let i = 0;
    spinTimer.current = window.setInterval(() => {
      i = (i + 1) % spinFrames.length;
      setSpinFrame(i);
    }, 120);
  };
  const stopSpin = () => {
    if (spinTimer.current) window.clearInterval(spinTimer.current);
    spinTimer.current = null;
    setSpinning(false);
    setSpinFrame(0);
  };

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const r = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    setTilt({ x: -y * 6, y: x * 9 });
  };

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation();
    if (soldOut) { toast.error("Sold out"); return; }
    addItem({
      productId: product.id, handle: product.handle, title: product.title,
      image: heroImg, price: product.price, stock: product.stock,
    });
    toast.success(`${product.title} added to cart`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay: index * 0.06, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="group perspective-1000 relative"
    >
      {/* Blurred brand aura behind the glass */}
      <div
        className="pointer-events-none absolute -inset-6 rounded-[2rem] opacity-50 group-hover:opacity-80 transition-opacity duration-700 blur-3xl"
        style={{ background: `radial-gradient(circle at 30% 30%, ${aura} 0%, transparent 60%)` }}
        aria-hidden="true"
      />

      <div
        ref={cardRef}
        onMouseMove={handleMove}
        onMouseEnter={startSpin}
        onMouseLeave={() => { setTilt({ x: 0, y: 0 }); stopSpin(); }}
        style={{
          transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
          transition: "transform 0.25s ease-out",
          transformStyle: "preserve-3d",
        }}
        className="relative rounded-2xl overflow-hidden border border-white/60 bg-white/40 backdrop-blur-xl shadow-sm hover:shadow-sacred transition-shadow duration-500 ring-1 ring-transparent hover:ring-[#c9a84c]/40"
      >
        {/* Gold sheen sweep on hover */}
        <div
          className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 z-20"
          style={{ background: "linear-gradient(135deg, hsl(42 85% 55% / 0.18), transparent 35%, transparent 65%, hsl(30 80% 48% / 0.18))" }}
        />

        <Link to={`/product/${product.handle}`} className="block">
          <div className="aspect-[3/4] overflow-hidden bg-muted/40 relative">
            <img
              src={currentImg}
              alt={product.title}
              className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-temple-dark/30 via-transparent to-transparent opacity-60 group-hover:opacity-30 transition-opacity duration-500" />

            <div className="absolute top-3 right-3 inline-flex items-center gap-1 backdrop-blur-md bg-white/40 border border-white/60 text-foreground font-body text-[10px] tracking-[0.25em] uppercase px-3 py-1 rounded-full">
              <Sparkles size={10} className="text-primary" /> Sacred
            </div>

            {spinFrames.length > 1 && (
              <div className="absolute bottom-3 right-3 inline-flex items-center gap-1 backdrop-blur-md bg-[#c9a84c]/80 text-white font-body text-[9px] tracking-[0.2em] uppercase px-2.5 py-1 rounded-full">
                <RotateCw size={9} /> 360°
              </div>
            )}

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

          <div className="p-5 relative backdrop-blur-md bg-white/50 border-t border-white/50">
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

export default GlassProductCard;
