import { Mail, MapPin, Phone } from "lucide-react";
import { Link } from "react-router-dom";
import FooterMandala from "@/components/FooterMandala";

const SacredGeoIcon = ({ children, href }: { children: React.ReactNode; href: string }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="w-10 h-10 rounded-full border border-gold/20 flex items-center justify-center text-ivory/50 hover:text-gold hover:border-gold/50 hover:shadow-[0_0_15px_hsla(42,85%,55%,0.2)] transition-all duration-300"
  >
    {children}
  </a>
);

const Footer = () => {
  return (
    <footer id="contact" className="bg-gradient-sacred text-ivory py-20 relative overflow-hidden">
      {/* Mandala animation */}
      <FooterMandala />

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid md:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div>
            <img alt="Punarvsu — Handcrafted bags from sacred temple textiles" className="h-16 w-auto mb-4 brightness-0 invert opacity-80" src="/lovable-uploads/381c34da-f415-4980-aab3-d621d551f63a.png" />
            <p className="font-body text-sm text-ivory/50 leading-relaxed mb-6">
              We turn retired temple textiles into bags people actually love carrying.
              Handmade in Delhi. Rooted in faith.
            </p>
            {/* Sacred geometry social icons */}
            <div className="flex gap-3">
              <SacredGeoIcon href="https://instagram.com">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4">
                  <rect x="2" y="2" width="20" height="20" rx="5" />
                  <circle cx="12" cy="12" r="5" />
                  <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" />
                </svg>
              </SacredGeoIcon>
              <SacredGeoIcon href="https://facebook.com">
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                  <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
                </svg>
              </SacredGeoIcon>
              <SacredGeoIcon href="https://twitter.com">
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </SacredGeoIcon>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display text-lg mb-4 text-gold">Explore</h4>
            <nav className="flex flex-col gap-3" aria-label="Footer navigation">
              {[
                { label: "Collections", href: "/#collections" },
                { label: "Our Story", href: "/about" },
                { label: "Process", href: "/#process" },
                { label: "Blog", href: "/blog" },
                { label: "FAQ", href: "/#faq" },
              ].map(link => (
                <Link key={link.label} to={link.href} className="font-body text-sm text-ivory/50 hover:text-gold transition-colors">
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Pages */}
          <div>
            <h4 className="font-display text-lg mb-4 text-gold">Company</h4>
            <nav className="flex flex-col gap-3">
              {[
                { label: "About Us", href: "/about" },
                { label: "Contact", href: "/contact" },
                { label: "Privacy", href: "/privacy" },
                { label: "Terms", href: "#" },
                { label: "Shipping", href: "#" },
              ].map(link => (
                <Link key={link.label} to={link.href} className="font-body text-sm text-ivory/50 hover:text-gold transition-colors">
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display text-lg mb-4 text-gold">Get in Touch</h4>
            <address className="flex flex-col gap-3 not-italic">
              <a href="mailto:punarvsu.com@gmail.com" className="flex items-center gap-3 font-body text-sm text-ivory/50 hover:text-gold transition-colors">
                <Mail size={14} /> punarvsu.com@gmail.com
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
            © 2026 Punarvsu. All rights reserved. Founded by Nikhil. Made with care in Delhi.
          </p>
          <p className="font-body text-[10px] tracking-[0.2em] uppercase text-ivory/20">
            From Temple to Timeless Luxury
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
