import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { CartDrawer } from "@/components/CartDrawer";

const navLinks = [
  { label: "Shop", href: "#collections" },
  { label: "About Us", href: "/about" },
  { label: "Blog", href: "/blog" },
  { label: "Contact & Bulk Orders", href: "/contact" },
];

const MagneticLink = ({ children, className, ...props }: any) => {
  const ref = useRef<HTMLAnchorElement>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) * 0.3;
    const y = (e.clientY - rect.top - rect.height / 2) * 0.3;
    setOffset({ x, y });
  };

  const handleMouseLeave = () => setOffset({ x: 0, y: 0 });

  const El = props.to ? Link : "a";

  return (
    <El
      {...props}
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={className}
      style={{
        transform: `translate(${offset.x}px, ${offset.y}px)`,
        transition: "transform 0.2s ease-out",
        display: "inline-block",
      }}
    >
      {children}
    </El>
  );
};

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleAnchorClick = (e: React.MouseEvent, href: string) => {
    e.preventDefault();
    const sectionId = href.replace("#", "");
    const wasMobileOpen = isOpen;
    setIsOpen(false);

    const scrollToSection = () => {
      const el = document.getElementById(sectionId);
      el?.scrollIntoView({ behavior: "smooth" });
    };

    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(scrollToSection, 500);
    } else if (wasMobileOpen) {
      setTimeout(scrollToSection, 350);
    } else {
      scrollToSection();
    }
  };

  const linkClass = "font-body text-sm tracking-wider uppercase text-muted-foreground hover:text-primary transition-colors duration-300 relative group";

  const renderLink = (link: typeof navLinks[0]) => {
    if (link.href.startsWith("/")) {
      return (
        <MagneticLink key={link.label} to={link.href} onClick={() => setIsOpen(false)} className={linkClass}>
          {link.label}
          <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-gradient-to-r from-primary to-accent group-hover:w-full transition-all duration-500" />
        </MagneticLink>
      );
    }
    return (
      <MagneticLink key={link.label} href={link.href} onClick={(e: React.MouseEvent) => handleAnchorClick(e, link.href)} className={linkClass}>
        {link.label}
        <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-gradient-to-r from-primary to-accent group-hover:w-full transition-all duration-500" />
      </MagneticLink>
    );
  };

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
      style={{
        background: scrolled ? "transparent" : "#E6D8CD",
        backdropFilter: "none",
        WebkitBackdropFilter: "none",
        borderBottom: "1px solid transparent",
      }}
    >
      <div className="container mx-auto px-6 py-2 flex items-center justify-between">
        <Link to="/" className="flex items-center mx-0 group -my-2">
          <motion.img
            alt="Punarvasu — Sacred Threads, Sustainable Art"
            className="h-20 md:h-28 w-auto object-contain"
            src="/lovable-uploads/punarvasu-logo-new.png"
            style={{ background: "transparent", filter: scrolled ? "drop-shadow(0 2px 8px rgba(0,0,0,0.15))" : "none" }}
            whileHover={{ scale: 1.05, filter: "brightness(1.1)" }}
            transition={{ duration: 0.3 }}
          />
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map(renderLink)}
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
            className="md:hidden overflow-hidden"
            style={{
              background: "hsla(36, 33%, 97%, 0.95)",
              backdropFilter: "blur(20px)",
              borderBottom: "1px solid hsla(42, 85%, 55%, 0.1)",
            }}
          >
            <div className="px-6 py-6 flex flex-col gap-4">
              {navLinks.map((link) => {
                if (link.href.startsWith("/")) {
                  return (
                    <Link key={link.label} to={link.href} onClick={() => setIsOpen(false)}
                      className="font-body text-base tracking-wider uppercase text-muted-foreground hover:text-primary transition-colors">
                      {link.label}
                    </Link>
                  );
                }
                return (
                  <a key={link.label} href={link.href} onClick={(e) => handleAnchorClick(e, link.href)}
                    className="font-body text-base tracking-wider uppercase text-muted-foreground hover:text-primary transition-colors">
                    {link.label}
                  </a>
                );
              })}
              <div className="mt-2"><CartDrawer /></div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
