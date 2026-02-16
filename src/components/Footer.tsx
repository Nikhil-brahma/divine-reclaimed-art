import { Mail, MapPin, Phone } from "lucide-react";

const Footer = () => {
  return (
    <footer id="contact" className="bg-gradient-sacred text-ivory py-20">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-3 gap-12 mb-16">
          {/* Brand */}
          <div>
            <img alt="Punarvsu — Handcrafted bags from sacred temple textiles" className="h-16 w-auto mb-4 brightness-0 invert opacity-80" src="/lovable-uploads/381c34da-f415-4980-aab3-d621d551f63a.png" />
            <p className="font-body text-sm text-ivory/50 leading-relaxed">
              We turn retired temple textiles into bags people actually love carrying.
              Handmade in Delhi. Rooted in faith.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display text-lg mb-4 text-gold">Explore</h4>
            <nav className="flex flex-col gap-3" aria-label="Footer navigation">
              {["Collections", "Our Story", "Process", "Blog", "FAQ"].map(link => {
                const href = link === "Blog" ? "/blog" : link === "FAQ" ? "#faq" : `#${link.toLowerCase().replace(" ", "-")}`;
                return (
                  <a key={link} href={href} className="font-body text-sm text-ivory/50 hover:text-gold transition-colors">
                    {link}
                  </a>
                );
              })}
            </nav>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display text-lg mb-4 text-gold">Get in Touch</h4>
            <address className="flex flex-col gap-3 not-italic">
              <a href="mailto:namaste@punarvsu.in" className="flex items-center gap-3 font-body text-sm text-ivory/50 hover:text-gold transition-colors">
                <Mail size={14} /> namaste@punarvsu.in
              </a>
              <a href="tel:09220464425" className="flex items-center gap-3 font-body text-sm text-ivory/50 hover:text-gold transition-colors">
                <Phone size={14} /> 09220464425
              </a>
              <span className="flex items-start gap-3 font-body text-sm text-ivory/50">
                <MapPin size={14} className="mt-0.5 shrink-0" /> Maharana Pratap Community Centre, Sector-9, Rohini, Delhi — 110085
              </span>
            </address>
          </div>
        </div>

        <div className="ornament-line w-full mb-8" />

        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="font-body text-xs text-ivory/30">
            © 2026 Punarvsu. All rights reserved. Made with care in Delhi.
          </p>
          <div className="flex gap-6">
            {["Privacy", "Terms", "Shipping"].map(link => (
              <a key={link} href="#" className="font-body text-xs text-ivory/30 hover:text-gold transition-colors">
                {link}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
