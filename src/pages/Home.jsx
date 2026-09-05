import { useEffect } from "react";
import Lenis from "lenis";
import { Navbar } from "../componentss/Navbar";
import { HeroSection } from "../componentss/HeroSection";
import { AboutSection } from "../componentss/AboutSection";
import { SkillsSection } from "../componentss/SkillsSection";
import { ProjectsSection } from "../componentss/ProjectsSection";
import { ContactSection } from "../componentss/ContactSection";
import { Footer } from "../componentss/Footer";
import { MotionConfig } from "framer-motion";

export const Home = () => {
  useEffect(() => {
    // Respect prefers-reduced-motion
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // smooth exponential out
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.5,
    });

    const onScrollRequest = (event) => {
      const { target, offset = 0 } = event.detail || {};
      if (!target) return;
      event.detail.handled = true;
      lenis.scrollTo(target, { offset, duration: 1.2 });
    };
    window.addEventListener("portfolio:scroll-to", onScrollRequest);

    let rafId;
    function raf(time) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("portfolio:scroll-to", onScrollRequest);
      lenis.destroy();
    };
  }, []);

  return (
    <MotionConfig reducedMotion="user">
      <div className="site-shell">
        <Navbar />
        <main id="main-content" tabIndex={-1}>
          <HeroSection />
          <ProjectsSection />
          <AboutSection />
          <SkillsSection />
          <ContactSection />
        </main>
        <Footer />
      </div>
    </MotionConfig>
  );
};
