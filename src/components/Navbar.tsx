import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { CartDrawer } from "@/components/CartDrawer";

const navLinks = [
  { label: "Collections", href: "#collections" },
  { label: "Our Story", href: "#story" },
  { label: "Blog", href: "/blog" },
  { label: "FAQ", href: "#faq" },
  { label: "Contact", href: "#contact" },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleAnchorClick = (e: React.MouseEvent, href: string) => {
    e.preventDefault();
    const sectionId = href.replace("#", "");
    if (location.pathname !== "/") {
      navigate("/");
      // Wait for homepage to render then scroll
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        el?.scrollIntoView({ behavior: "smooth" });
      }, 300);
    } else {
      const el = document.getElementById(sectionId);
      el?.scrollIntoView({ behavior: "smooth" });
    }
    setIsOpen(false);
  };

  const renderLink = (link: typeof navLinks[0], className: string) => {
    if (link.href.startsWith("/")) {
      return (
        <Link key={link.label} to={link.href} onClick={() => setIsOpen(false)} className={className}>
          {link.label}
        </Link>
      );
    }
    return (
      <a key={link.label} href={link.href} onClick={(e) => handleAnchorClick(e, link.href)} className={className}>
        {link.label}
      </a>
    );
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center mx-0">
          <img alt="Punarvsu" className="h-12 md:h-14 w-auto" src="/lovable-uploads/552a4819-fe43-46cc-876c-80489ab608d6.png" />
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) =>
            renderLink(link, "font-body text-sm tracking-wider uppercase text-muted-foreground hover:text-primary transition-colors duration-300")
          )}
          <CartDrawer />
        </div>

        {/* Mobile Toggle */}
        <button onClick={() => setIsOpen(!isOpen)} className="md:hidden text-foreground" aria-label="Toggle menu">
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-background border-b border-border overflow-hidden"
          >
            <div className="px-6 py-6 flex flex-col gap-4">
              {navLinks.map((link) =>
                renderLink(link, "font-body text-base tracking-wider uppercase text-muted-foreground hover:text-primary transition-colors")
              )}
              <div className="mt-2">
                <CartDrawer />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
