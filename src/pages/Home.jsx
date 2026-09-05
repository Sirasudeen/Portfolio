import { Navbar } from "../componentss/Navbar";
import { HeroSection } from "../componentss/HeroSection";
import { AboutSection } from "../componentss/AboutSection";
import { SkillsSection } from "../componentss/SkillsSection";
import { ProjectsSection } from "../componentss/ProjectsSection";
import { ContactSection } from "../componentss/ContactSection";
import { Footer } from "../componentss/Footer";
import { MotionConfig } from "framer-motion";

export const Home = () => {
  return (
    <MotionConfig reducedMotion="user">
      <div className="site-shell">
        <Navbar />
        <main>
          <HeroSection />
          <AboutSection />
          <SkillsSection />
          <ProjectsSection />
          <ContactSection />
        </main>
        <Footer />
      </div>
    </MotionConfig>
  );
};
