import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Loader2, ArrowLeft, ShoppingBag } from "lucide-react";
import { storefrontApiRequest, PRODUCT_BY_HANDLE_QUERY, type ShopifyProduct } from "@/lib/shopify";
import { useCartStore } from "@/stores/cartStore";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const ProductDetail = () => {
  const { handle } = useParams<{ handle: string }>();
  const [product, setProduct] = useState<ShopifyProduct["node"] | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedVariantIdx, setSelectedVariantIdx] = useState(0);
  const [selectedImage, setSelectedImage] = useState(0);
  const addItem = useCartStore((s) => s.addItem);
  const isCartLoading = useCartStore((s) => s.isLoading);

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await storefrontApiRequest(PRODUCT_BY_HANDLE_QUERY, { handle });
        setProduct(data?.data?.productByHandle || null);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [handle]);

  const selectedVariant = product?.variants.edges[selectedVariantIdx]?.node;

  const handleAddToCart = async () => {
    if (!product || !selectedVariant || !selectedVariant.availableForSale) return;
    const shopifyProduct: ShopifyProduct = { node: product };
    await addItem({
      product: shopifyProduct,
      variantId: selectedVariant.id,
      variantTitle: selectedVariant.title,
      price: selectedVariant.price,
      quantity: 1,
      selectedOptions: selectedVariant.selectedOptions || [],
    });
    toast.success(`${product.title} added to cart`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex justify-center items-center h-[60vh]">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex flex-col justify-center items-center h-[60vh]">
          <ShoppingBag className="w-16 h-16 text-muted-foreground mb-4" />
          <h2 className="font-display text-2xl text-foreground mb-2">Product not found</h2>
          <Link to="/" className="font-body text-primary hover:underline">← Back to collections</Link>
        </div>
      </div>
    );
  }

  const images = product.images.edges;
  const price = selectedVariant?.price;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-28 pb-20">
        <div className="container mx-auto px-6">
          <Link to="/#collections" className="inline-flex items-center gap-2 font-body text-sm text-muted-foreground hover:text-primary transition-colors mb-8">
            <ArrowLeft size={16} /> Back to Collections
          </Link>

          <div className="grid md:grid-cols-2 gap-12">
            {/* Images */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
              <div className="aspect-square rounded-sm overflow-hidden bg-card mb-4">
                <img
                  src={images[selectedImage]?.node.url || "/placeholder.svg"}
                  alt={images[selectedImage]?.node.altText || product.title}
                  className="w-full h-full object-cover"
                />
              </div>
              {images.length > 1 && (
                <div className="flex gap-3 overflow-x-auto">
                  {images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedImage(i)}
                      className={`w-20 h-20 rounded-sm overflow-hidden flex-shrink-0 border-2 transition-colors ${i === selectedImage ? 'border-primary' : 'border-transparent'}`}
                    >
                      <img src={img.node.url} alt={img.node.altText || ""} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Info */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>
              <h1 className="font-display text-3xl md:text-5xl text-foreground mb-4">{product.title}</h1>
              {price && (
                <p className="font-display text-2xl text-foreground mb-6">
                  {price.currencyCode === 'INR' ? '₹' : price.currencyCode} {parseFloat(price.amount).toFixed(2)}
                </p>
              )}
              <p className="font-body text-muted-foreground leading-relaxed mb-8">{product.description}</p>

              {/* Variant selection */}
              {product.options.map((option) => (
                option.values.length > 1 && (
                  <div key={option.name} className="mb-6">
                    <label className="font-body text-xs tracking-[0.3em] uppercase text-muted-foreground mb-3 block">{option.name}</label>
                    <div className="flex flex-wrap gap-2">
                      {product.variants.edges.map((v, idx) => {
                        const optVal = v.node.selectedOptions.find(o => o.name === option.name)?.value;
                        // Deduplicate
                        const already = product.variants.edges.findIndex(vv => vv.node.selectedOptions.find(o => o.name === option.name)?.value === optVal);
                        if (already !== idx) return null;
                        return (
                          <button
                            key={idx}
                            onClick={() => setSelectedVariantIdx(idx)}
                            className={`px-4 py-2 rounded-sm font-body text-sm border transition-colors ${idx === selectedVariantIdx ? 'border-primary bg-primary/10 text-foreground' : 'border-border text-muted-foreground hover:border-primary'}`}
                          >
                            {optVal}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )
              ))}

              <button
                onClick={handleAddToCart}
                disabled={isCartLoading || !selectedVariant?.availableForSale}
                className="w-full bg-gradient-saffron text-primary-foreground px-8 py-4 rounded-sm font-body text-sm tracking-[0.2em] uppercase hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {!selectedVariant?.availableForSale ? "Sold Out" : isCartLoading ? "Adding..." : "Add to Cart"}
              </button>
            </motion.div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProductDetail;
