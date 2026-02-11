import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { CartDrawer } from "@/components/CartDrawer";
import logo from "@/assets/logo-punarvsu.png";
const navLinks = [{
  label: "Collections",
  href: "#collections"
}, {
  label: "Our Story",
  href: "#story"
}, {
  label: "Process",
  href: "#process"
}, {
  label: "Contact",
  href: "#contact"
}];
const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  return <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        <a href="#" className="flex items-center">
          <img alt="Punarvsu" className="h-12 md:h-14 w-auto" src="/lovable-uploads/552a4819-fe43-46cc-876c-80489ab608d6.png" />
        </a>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map(link => <a key={link.label} href={link.href} className="font-body text-sm tracking-wider uppercase text-muted-foreground hover:text-primary transition-colors duration-300">
              {link.label}
            </a>)}
          <CartDrawer />
        </div>

        {/* Mobile Toggle */}
        <button onClick={() => setIsOpen(!isOpen)} className="md:hidden text-foreground" aria-label="Toggle menu">
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && <motion.div initial={{
        opacity: 0,
        height: 0
      }} animate={{
        opacity: 1,
        height: "auto"
      }} exit={{
        opacity: 0,
        height: 0
      }} className="md:hidden bg-background border-b border-border overflow-hidden">
            <div className="px-6 py-6 flex flex-col gap-4">
              {navLinks.map(link => <a key={link.label} href={link.href} onClick={() => setIsOpen(false)} className="font-body text-base tracking-wider uppercase text-muted-foreground hover:text-primary transition-colors">
                  {link.label}
                </a>)}
              <div className="mt-2">
                <CartDrawer />
              </div>
            </div>
          </motion.div>}
      </AnimatePresence>
    </nav>;
};
export default Navbar;