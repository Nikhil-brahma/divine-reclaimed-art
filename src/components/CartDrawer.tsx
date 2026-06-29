import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ShoppingCart, Minus, Plus, Trash2, ArrowRight } from "lucide-react";
import { useStoreCart } from "@/stores/storeCart";
import CheckoutDialog from "@/components/CheckoutDialog";
import { Link } from "react-router-dom";

export const CartDrawer = () => {
  const [open, setOpen] = useState(false);
  const [checkout, setCheckout] = useState(false);
  const items = useStoreCart((s) => s.items);
  const updateQty = useStoreCart((s) => s.updateQty);
  const removeItem = useStoreCart((s) => s.removeItem);
  const subtotal = useStoreCart((s) => s.subtotal());
  const totalItems = useStoreCart((s) => s.totalItems());

  return (
    <>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <button className="relative text-foreground hover:text-primary transition-colors" aria-label="Cart">
            <ShoppingCart size={20} />
            {totalItems > 0 && (
              <Badge className="absolute -top-2 -right-2 h-4 w-4 rounded-full p-0 flex items-center justify-center text-[10px] bg-primary text-primary-foreground">
                {totalItems}
              </Badge>
            )}
          </button>
        </SheetTrigger>
        <SheetContent className="w-full sm:max-w-lg flex flex-col h-full bg-background/95 backdrop-blur-xl">
          <SheetHeader className="flex-shrink-0">
            <SheetTitle className="font-display text-2xl">Your Sacred Basket</SheetTitle>
            <SheetDescription className="font-body text-xs">
              {totalItems === 0 ? "Your cart awaits a blessing" : `${totalItems} item${totalItems !== 1 ? "s" : ""}`}
            </SheetDescription>
          </SheetHeader>

          <div className="flex flex-col flex-1 pt-6 min-h-0">
            {items.length === 0 ? (
              <div className="flex-1 flex items-center justify-center text-center">
                <div>
                  <ShoppingCart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground font-body text-sm mb-4">Your cart is empty</p>
                  <Link to="/#collections" onClick={() => setOpen(false)}
                        className="inline-block font-body text-xs tracking-[0.2em] uppercase text-primary border border-primary/40 rounded-full px-5 py-2 hover:bg-primary/10">
                    Browse Collection
                  </Link>
                </div>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto pr-2 min-h-0 space-y-3">
                  {items.map((it) => (
                    <div key={it.productId} className="flex gap-3 p-3 rounded-xl glass-card">
                      <Link to={`/product/${it.handle}`} onClick={() => setOpen(false)} className="w-20 h-20 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                        <img src={it.image} alt={it.title} className="w-full h-full object-cover" />
                      </Link>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-display text-sm truncate">{it.title}</h4>
                        <p className="font-display text-sm mt-1">₹{(it.price * it.quantity).toLocaleString("en-IN")}</p>
                        <div className="flex items-center gap-1 mt-2">
                          <button aria-label="Decrease quantity" onClick={() => updateQty(it.productId, it.quantity - 1)} className="w-6 h-6 rounded-md border border-border/60 inline-flex items-center justify-center hover:bg-muted">
                            <Minus size={10} />
                          </button>
                          <span className="w-8 text-center text-xs font-body">{it.quantity}</span>
                          <button aria-label="Increase quantity" onClick={() => updateQty(it.productId, it.quantity + 1)} className="w-6 h-6 rounded-md border border-border/60 inline-flex items-center justify-center hover:bg-muted">
                            <Plus size={10} />
                          </button>
                          <button aria-label="Remove item" onClick={() => removeItem(it.productId)} className="ml-auto text-muted-foreground hover:text-destructive p-1">
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex-shrink-0 space-y-3 pt-4 border-t border-border/40 bg-background/60 backdrop-blur">
                  <div className="flex justify-between items-baseline">
                    <span className="font-body text-xs uppercase tracking-wider text-muted-foreground">Subtotal</span>
                    <span className="font-display text-xl">₹{subtotal.toLocaleString("en-IN")}</span>
                  </div>
                  <button onClick={() => { setOpen(false); setCheckout(true); }}
                          className="w-full bg-gradient-saffron text-primary-foreground font-body text-xs tracking-[0.2em] uppercase py-3.5 rounded-full hover:opacity-90 transition-opacity inline-flex items-center justify-center gap-2 shadow-sacred">
                    Checkout <ArrowRight size={14} />
                  </button>
                  <p className="text-center text-[10px] text-muted-foreground">Shipping calculated at checkout</p>
                </div>
              </>
            )}
          </div>
        </SheetContent>
      </Sheet>

      <CheckoutDialog open={checkout} onClose={() => setCheckout(false)} />
    </>
  );
};

export default CartDrawer;
