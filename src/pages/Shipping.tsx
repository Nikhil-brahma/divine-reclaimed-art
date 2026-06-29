import SEOHead from "@/components/SEOHead";
import StructuredData from "@/components/StructuredData";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";
import { Package, Truck, Globe, Clock } from "lucide-react";

const ShippingCard = ({ icon: Icon, title, children }: { icon: React.ComponentType<{ className?: string }>; title: string; children: React.ReactNode }) => (
  <div className="border border-gold/10 rounded-xl p-6 bg-card/30 backdrop-blur-sm hover:border-gold/30 transition-colors">
    <div className="flex items-center gap-3 mb-4">
      <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center">
        <Icon className="w-5 h-5 text-gold" />
      </div>
      <h3 className="font-display text-lg text-gold">{title}</h3>
    </div>
    <div className="font-body text-sm text-foreground/70 leading-relaxed space-y-2">
      {children}
    </div>
  </div>
);

const Shipping = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEOHead
        title="Shipping Policy — India & worldwide delivery"
        description="Punarvsu ships pan-India in 3–7 days (free above ₹999) and worldwide via tracked courier. Read delivery timelines, charges, and packaging notes."
      />
      <StructuredData />
      <Navbar />


      <main className="pt-32 pb-20">
        <div className="container mx-auto px-6 max-w-3xl">
          <h1 className="font-display text-4xl md:text-5xl text-gold mb-4">Shipping Policy</h1>
          <p className="text-muted-foreground text-sm mb-12">Last updated: April 8, 2026</p>

          <div className="space-y-8 font-body text-foreground/80 leading-relaxed text-sm">
            <p>
              At Punarvsu, every product is handcrafted with care from sacred temple textiles. We ensure each piece is carefully packaged and shipped to you with the reverence it deserves.
            </p>

            {/* Shipping cards */}
            <div className="grid gap-6 md:grid-cols-2">
              <ShippingCard icon={Package} title="Free Shipping (India)">
                <p>Orders above <strong className="text-foreground">₹999</strong> qualify for <strong className="text-foreground">free standard shipping</strong> anywhere in India.</p>
                <p>For orders below ₹999, a flat shipping fee of ₹99 applies.</p>
              </ShippingCard>

              <ShippingCard icon={Clock} title="Delivery Timeline (India)">
                <p><strong className="text-foreground">Metro cities:</strong> 3–5 business days</p>
                <p><strong className="text-foreground">Other cities:</strong> 5–7 business days</p>
                <p><strong className="text-foreground">Remote areas:</strong> 7–10 business days</p>
              </ShippingCard>

              <ShippingCard icon={Globe} title="International Shipping">
                <p>We ship worldwide! International shipping rates are calculated at checkout based on destination and package weight.</p>
                <p><strong className="text-foreground">Estimated delivery:</strong> 10–21 business days depending on the destination country.</p>
              </ShippingCard>

              <ShippingCard icon={Truck} title="Tracking & Updates">
                <p>You will receive a tracking number via email once your order is dispatched. You can track your shipment in real time.</p>
              </ShippingCard>
            </div>

            <section>
              <h2 className="font-display text-2xl text-gold mb-4">Order Processing</h2>
              <p>
                All orders are processed within <strong className="text-foreground">1–3 business days</strong> (Monday–Saturday, excluding public holidays). Since each product is handcrafted, please allow a little extra time during festive seasons or high-demand periods.
              </p>
            </section>

            <section>
              <h2 className="font-display text-2xl text-gold mb-4">International Customs & Duties</h2>
              <p>
                International orders may be subject to import duties, taxes, and customs fees imposed by the destination country. These charges are the buyer's responsibility and are not included in the product price or shipping cost. We recommend checking with your local customs office for more information.
              </p>
            </section>

            <section>
              <h2 className="font-display text-2xl text-gold mb-4">Shipping Partners</h2>
              <p>
                We work with trusted logistics partners including India Post, BlueDart, Delhivery, and international couriers to ensure your order arrives safely. The specific courier is chosen based on your location for the fastest and most reliable delivery.
              </p>
            </section>

            <section>
              <h2 className="font-display text-2xl text-gold mb-4">Damaged in Transit</h2>
              <p>
                While we package every product with the utmost care, if your order arrives damaged during transit, please{" "}
                <Link to="/contact" className="text-gold hover:underline">contact us</Link>{" "}
                within <strong className="text-foreground">48 hours</strong> of delivery with photographs of the damage. We will work with our shipping partner to resolve the issue.
              </p>
              <p className="mt-4">
                Please note: as all sales are final, transit damage claims are handled on a case-by-case basis and are separate from our no-return policy.
              </p>
            </section>

            <section>
              <h2 className="font-display text-2xl text-gold mb-4">Contact</h2>
              <p className="mb-2">For any shipping-related queries, reach out to us:</p>
              <p>
                <strong className="text-foreground">Email:</strong>{" "}
                <a href="mailto:nikhilrawat508@gmail.com" className="text-gold hover:underline">nikhilrawat508@gmail.com</a>
              </p>
              <p>
                <strong className="text-foreground">Address:</strong> Maharana Pratap Community Centre, Sector-9, Rohini, Delhi Kender Rajapur Sec-9, New Delhi, DL, 110085, IN
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Shipping;
