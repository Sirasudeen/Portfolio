import { Navbar } from "../componentss/Navbar";
import { ThemeToggle } from "../componentss/ThemeToggle";
import { StarBackground } from "../componentss/StarBackground";
import { HeroSection } from "../componentss/HeroSection";
import { AboutSection } from "../componentss/AboutSection";
import { SkillsSection } from "../componentss/SkillsSection";
import { ProjectsSection } from "../componentss/ProjectsSection";
import { ContactSection } from "../componentss/ContactSection";
import { Footer } from "../componentss/Footer";

export const Home = () => {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* Theme Toggle */}
      <ThemeToggle />
      {/* Background Effects */}
      <StarBackground />

      {/* Navbar */}
      <Navbar />
      {/* Main Content */}
      <main>
        <HeroSection />
        <AboutSection />
        <SkillsSection />
        <ProjectsSection />
        <ContactSection />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};
