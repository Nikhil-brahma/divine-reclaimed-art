import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Loader2, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";
import { storefrontApiRequest, PRODUCTS_QUERY, type ShopifyProduct } from "@/lib/shopify";
import { useCartStore } from "@/stores/cartStore";
import { toast } from "sonner";

const CollectionsSection = () => {
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const addItem = useCartStore((s) => s.addItem);
  const isCartLoading = useCartStore((s) => s.isLoading);

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
            {/* Featured product */}
            {products.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="grid md:grid-cols-2 gap-0 mb-8 rounded-sm overflow-hidden shadow-sacred bg-card"
              >
                <Link to={`/product/${products[0].node.handle}`} className="aspect-square md:aspect-auto overflow-hidden">
                  <img
                    src={products[0].node.images.edges[0]?.node.url || "/placeholder.svg"}
                    alt={products[0].node.images.edges[0]?.node.altText || products[0].node.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                  />
                </Link>
                <div className="flex flex-col justify-center p-8 md:p-16">
                  <h3 className="font-display text-3xl md:text-4xl text-foreground mb-4">
                    <Link to={`/product/${products[0].node.handle}`} className="hover:text-primary transition-colors">
                      {products[0].node.title}
                    </Link>
                  </h3>
                  <p className="font-body text-muted-foreground mb-6 leading-relaxed line-clamp-3">
                    {products[0].node.description}
                  </p>
                  <div className="flex items-center gap-6">
                    <span className="font-display text-2xl text-foreground">{formatPrice(products[0])}</span>
                    <button
                      onClick={(e) => handleAddToCart(products[0], e)}
                      disabled={isCartLoading}
                      className="bg-gradient-saffron text-primary-foreground px-6 py-3 rounded-sm font-body text-xs tracking-[0.2em] uppercase hover:opacity-90 transition-opacity disabled:opacity-50"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Product grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.slice(1).map((product, i) => (
                <motion.div
                  key={product.node.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                  className="group bg-card rounded-sm overflow-hidden shadow-sm hover:shadow-sacred transition-shadow duration-500"
                >
                  <Link to={`/product/${product.node.handle}`} className="block">
                    <div className="aspect-square overflow-hidden">
                      <img
                        src={product.node.images.edges[0]?.node.url || "/placeholder.svg"}
                        alt={product.node.images.edges[0]?.node.altText || product.node.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        loading="lazy"
                      />
                    </div>
                    <div className="p-5">
                      <h3 className="font-display text-xl text-foreground mt-1 mb-1">{product.node.title}</h3>
                      <p className="font-body text-xs text-muted-foreground mb-3 line-clamp-2">
                        {product.node.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="font-display text-lg text-foreground">{formatPrice(product)}</span>
                        <button
                          onClick={(e) => handleAddToCart(product, e)}
                          disabled={isCartLoading}
                          className="font-body text-[10px] tracking-[0.2em] uppercase text-primary hover:text-accent transition-colors disabled:opacity-50"
                        >
                          Add to Cart →
                        </button>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default CollectionsSection;
