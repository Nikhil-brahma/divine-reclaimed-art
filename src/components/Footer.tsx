import { Mail, MapPin, Phone } from "lucide-react";
import logo from "@/assets/logo-punarvsu.png";
const Footer = () => {
  return <footer id="contact" className="bg-gradient-sacred text-ivory py-20">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-3 gap-12 mb-16">
          {/* Brand */}
          <div>
            <img alt="Punarvsu" className="h-16 w-auto mb-4 brightness-0 invert opacity-80" src="/lovable-uploads/381c34da-f415-4980-aab3-d621d551f63a.png" />
            <p className="font-body text-sm text-ivory/50 leading-relaxed">
              Transforming sacred temple textiles into extraordinary handcrafted luxury.
              Carry the divine with you.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display text-lg mb-4 text-gold">Explore</h4>
            <div className="flex flex-col gap-3">
              {["Collections", "Our Story", "Process", "Blog", "FAQ"].map(link => {
                const href = link === "Blog" ? "/blog" : link === "FAQ" ? "#faq" : `#${link.toLowerCase().replace(" ", "-")}`;
                const Tag = link === "Blog" ? "a" : "a";
                return <a key={link} href={href} className="font-body text-sm text-ivory/50 hover:text-gold transition-colors">
                  {link}
                </a>;
              })}
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display text-lg mb-4 text-gold">Connect</h4>
            <div className="flex flex-col gap-3">
              <a href="mailto:namaste@punarvsu.in" className="flex items-center gap-3 font-body text-sm text-ivory/50 hover:text-gold transition-colors">
                <Mail size={14} /> namaste@punarvsu.in
              </a>
              <a href="tel:09220464425" className="flex items-center gap-3 font-body text-sm text-ivory/50 hover:text-gold transition-colors">
                <Phone size={14} /> 09220464425
              </a>
              <span className="flex items-start gap-3 font-body text-sm text-ivory/50">
                <MapPin size={14} className="mt-0.5 shrink-0" /> Basement No. 35, Vinoba Kunj, Rajapur Market, Razapur, Sector 9, Rohini, Delhi — 110085
              </span>
            </div>
          </div>
        </div>

        <div className="ornament-line w-full mb-8" />

        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="font-body text-xs text-ivory/30">
            © 2026 Punarvsu. All rights reserved. Crafted with devotion.
          </p>
          <div className="flex gap-6">
            {["Privacy", "Terms", "Shipping"].map(link => <a key={link} href="#" className="font-body text-xs text-ivory/30 hover:text-gold transition-colors">
                {link}
              </a>)}
          </div>
        </div>
      </div>
    </footer>;
};
export default Footer;