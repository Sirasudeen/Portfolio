import { cn } from "@/lib/utils";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { motion, useScroll, useSpring } from "framer-motion";
import { useEffect, useState } from "react";

const navItems = [
  { name: "About", href: "#about" },
  { name: "Work", href: "#projects" },
  { name: "Approach", href: "#skills" },
];

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 24, mass: 0.25 });

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={cn("site-nav", isScrolled && "site-nav--scrolled")}>
      <motion.div className="scroll-progress" style={{ scaleX: progress }} />
      <div className="nav-inner">
        <a className="wordmark" href="#hero" aria-label="siras.cloud, home">
          siras<span>.cloud</span>
        </a>

        <div className="desktop-nav">
          {navItems.map((item) => (
            <a key={item.name} href={item.href}>{item.name}</a>
          ))}
          <a className="nav-cta" href="#contact">
            Say hello <ArrowUpRight size={15} aria-hidden="true" />
          </a>
        </div>

        <button
          onClick={() => setIsMenuOpen((open) => !open)}
          className="menu-button"
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={isMenuOpen}
        >
          {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>

        <div className={cn("mobile-nav", isMenuOpen && "mobile-nav--open")}>
          <div>
            {[...navItems, { name: "Contact", href: "#contact" }].map((item) => (
              <a key={item.name} href={item.href} onClick={() => setIsMenuOpen(false)}>
                {item.name}
              </a>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};
