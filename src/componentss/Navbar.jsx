import { cn } from "@/lib/utils";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { motion, useScroll, useSpring } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import "./Navigation.css";

const navItems = [
  { name: "Work", href: "#projects" },
  { name: "About", href: "#about" },
  { name: "Approach", href: "#skills" },
  { name: "Say hello", href: "#contact" },
];

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState(null);
  const navRef = useRef(null);
  const dialogRef = useRef(null);
  const openerRef = useRef(null);
  const homeRef = useRef(null);
  const unlockScrollRef = useRef(null);
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 24, mass: 0.25 });

  const releaseScroll = useCallback(() => {
    unlockScrollRef.current?.();
    unlockScrollRef.current = null;
  }, []);

  const restoreFocus = useCallback(() => {
    const target = window.matchMedia("(max-width: 760px)").matches
      ? openerRef.current
      : homeRef.current;
    if (target?.isConnected) target.focus({ preventScroll: true });
  }, []);

  const closeMenu = useCallback(() => {
    const wasOpen = dialogRef.current?.open;
    dialogRef.current?.close();
    // Unlock before the anchor's default navigation, not in a deferred effect.
    releaseScroll();
    setIsMenuOpen(false);
    if (wasOpen) restoreFocus();
  }, [releaseScroll, restoreFocus]);

  const openMenu = () => {
    const dialog = dialogRef.current;
    if (!dialog || dialog.open) return;
    dialog.showModal();
    const previous = [document.documentElement, document.body].map((element) => ({
      element,
      value: element.style.getPropertyValue("overflow"),
      priority: element.style.getPropertyPriority("overflow"),
    }));
    previous.forEach(({ element }) => element.style.setProperty("overflow", "hidden"));
    unlockScrollRef.current = () => {
      previous.forEach(({ element, value, priority }) => {
        if (value) element.style.setProperty("overflow", value, priority);
        else element.style.removeProperty("overflow");
      });
    };
    setIsMenuOpen(true);
  };

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      setIsScrolled(window.scrollY > 10);
      const activationLine = (navRef.current?.getBoundingClientRect().bottom ?? 80) + 32;
      const sections = navItems
        .map(({ href }) => document.getElementById(href.slice(1)))
        .filter(Boolean)
        // Link order need not match the sections' visual order on the page.
        .sort((first, second) => first.getBoundingClientRect().top - second.getBoundingClientRect().top);
      let current = null;
      sections.forEach((section) => {
        if (section.getBoundingClientRect().top <= activationLine) current = section.id;
      });
      // The last section may be too short to reach the activation line.
      if (window.scrollY > 0 && window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2) {
        current = sections.at(-1)?.id ?? current;
      }
      setActiveSection(current);
    };
    const scheduleUpdate = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);
    window.addEventListener("hashchange", scheduleUpdate);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
      window.removeEventListener("hashchange", scheduleUpdate);
    };
  }, []);

  useEffect(() => {
    const mobile = window.matchMedia("(max-width: 760px)");
    const handleResize = () => {
      if (!mobile.matches) closeMenu();
    };
    const dialog = dialogRef.current;
    mobile.addEventListener("change", handleResize);
    return () => {
      mobile.removeEventListener("change", handleResize);
      dialog?.close();
      releaseScroll();
    };
  }, [closeMenu, releaseScroll]);

  return (
    <>
      <a className="navigation-skip-link" href="#main-content">Skip to content</a>
      <nav ref={navRef} className={cn("site-nav", isScrolled && "site-nav--scrolled")} aria-label="Primary">
      <motion.div className="scroll-progress" style={{ scaleX: progress }} aria-hidden="true" />
      <div className="nav-inner">
        <a ref={homeRef} className="wordmark" href="#hero" aria-label="siras.cloud, home">
          siras<span>.cloud</span>
        </a>

        <div className="desktop-nav">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className={item.href === "#contact" ? "nav-cta" : undefined}
              aria-current={activeSection === item.href.slice(1) ? "location" : undefined}
            >
              {item.name}
              {item.href === "#contact" && <ArrowUpRight size={15} aria-hidden="true" />}
            </a>
          ))}
        </div>

        <button
          ref={openerRef}
          type="button"
          onClick={openMenu}
          className="menu-button"
          aria-label="Open navigation menu"
          aria-expanded={isMenuOpen}
          aria-haspopup="dialog"
          aria-controls="navigation-dialog"
        >
          <Menu size={22} aria-hidden="true" />
        </button>
      </div>
      </nav>
      <dialog
        ref={dialogRef}
        id="navigation-dialog"
        className="navigation-dialog"
        aria-labelledby="navigation-dialog-title"
        onKeyDown={(event) => {
          if (event.key === "Escape") {
            event.preventDefault();
            closeMenu();
          }
        }}
        onCancel={(event) => {
          event.preventDefault();
          closeMenu();
        }}
        onClose={() => {
          // Ignore a delayed close event if the dialog has already reopened.
          if (!dialogRef.current?.open) {
            releaseScroll();
            setIsMenuOpen(false);
          }
        }}
      >
        <div className="navigation-dialog-inner">
          <div className="navigation-dialog-header">
            <h2 id="navigation-dialog-title">Explore siras.cloud</h2>
            <button className="navigation-close" type="button" onClick={closeMenu} autoFocus>
              Close <X size={20} aria-hidden="true" />
            </button>
          </div>
          <nav className="navigation-dialog-links" aria-label="Mobile">
            {navItems.map((item, index) => (
              <a
                key={item.href}
                href={item.href}
                onClick={closeMenu}
                aria-current={activeSection === item.href.slice(1) ? "location" : undefined}
              >
                <span className="navigation-link-index" aria-hidden="true">0{index + 1}</span>
                <span>{item.name}</span>
                <ArrowUpRight className="navigation-link-arrow" size={26} aria-hidden="true" />
              </a>
            ))}
          </nav>
          <p className="navigation-dialog-note">A little curiosity goes a long way.</p>
        </div>
      </dialog>
    </>
  );
};
