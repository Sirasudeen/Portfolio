import { ArrowDown, ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";
import { SystemsPlayground } from "./SystemsPlayground";

const ease = [0.16, 1, 0.3, 1];

const reveal = {
  hidden: { opacity: 0, y: 24 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, delay, ease },
  }),
};

export const HeroSection = () => {
  return (
    <section id="hero" className="hero section-frame">
      <div className="hero-grid">
        <motion.div className="hero-copy" initial="hidden" animate="visible">
          <motion.p className="eyebrow" variants={reveal} custom={0.05}>
            <span /> Software Development Engineer · Zoho
          </motion.p>
          <h1>
            <span className="hero-line">
              <motion.span variants={reveal} custom={0.12}>Siras loves</motion.span>
            </span>
            <span className="hero-line">
              <motion.em variants={reveal} custom={0.2}>to build systems.</motion.em>
            </span>
          </h1>
          <motion.p className="hero-intro" variants={reveal} custom={0.32}>
            I&apos;m a software developer who enjoys solving complex problems and
            building software that is scalable, reliable, and made to last.
          </motion.p>
          <motion.div className="hero-actions" variants={reveal} custom={0.4}>
            <a className="button button--primary" href="#projects">
              Explore my work <ArrowDown size={17} aria-hidden="true" />
            </a>
            <a
              className="text-link"
              href="https://www.linkedin.com/in/sirasudeen-p-4512b4221/"
              target="_blank"
              rel="noreferrer"
            >
              LinkedIn <ArrowUpRight size={16} aria-hidden="true" />
            </a>
          </motion.div>
        </motion.div>

        <SystemsPlayground />
      </div>
    </section>
  );
};