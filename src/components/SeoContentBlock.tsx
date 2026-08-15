import { Link } from "react-router-dom";

const SeoContentBlock = () => (
  <section aria-label="About Punarvsu potli bags" className="py-16 bg-card/40 border-t border-border/50">
    <div className="container mx-auto px-6 max-w-4xl">
      <h2 className="font-display text-2xl md:text-3xl text-foreground mb-6">
        Potli Bags for Every Sacred Occasion
      </h2>
      <div className="space-y-4 font-body text-sm text-muted-foreground leading-relaxed">
        <p>
          Punarvsu is India's only brand crafting potli bags from Bhagwan Vastra — the sacred
          cloth used to drape deities in temples. When the fabric completes its spiritual
          service, we reclaim it, wash it with care, and give it a second life as beautifully
          embroidered potli bags for women that carry meaning far beyond their form.
        </p>
        <p>
          <strong className="text-foreground">For Weddings &amp; Shagun</strong> — Our shagun
          potli bags and wedding gift bags are designed for moments that matter. Perfect return
          gift bags for wedding guests, bridal clutches, and shagun pouches, available in bulk.
        </p>
        <p>
          <strong className="text-foreground">Eco-Friendly &amp; Recycled</strong> — Our recycled
          cotton tote bags give temple cloth a sustainable afterlife. Each bag reduces textile
          waste while honouring its divine origin.
        </p>
        <p>
          <strong className="text-foreground">Pooja &amp; Temple Bags</strong> — Sacred pooja bags
          and mandir bags from Bhagwan Vastra, designed to hold sacred items with reverence.
        </p>
        <p>
          Shop potli bags for women — delivered across India. Free shipping above ₹999.
        </p>
        <p className="pt-2">
          Explore{" "}
          <Link to="/#shop-by-occasion" className="text-primary hover:underline">bridal, shagun, pooja and eco collections</Link>,
          read the{" "}
          <Link to="/#bhagwan-vastra" className="text-primary hover:underline">Bhagwan Vastra story</Link>, browse our{" "}
          <Link to="/sacred-knowledge" className="text-primary hover:underline">sacred knowledge guide</Link>, the{" "}
          <Link to="/blog" className="text-primary hover:underline">journal</Link>, or learn{" "}
          <Link to="/about" className="text-primary hover:underline">about Punarvsu</Link>.
        </p>
      </div>
    </div>
  </section>
);

export default SeoContentBlock;
