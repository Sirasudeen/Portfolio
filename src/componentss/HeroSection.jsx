import { ArrowDown, ArrowUpRight, Circle } from "lucide-react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";

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
  const shouldReduceMotion = useReducedMotion();
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const rotateX = useSpring(useTransform(pointerY, [-0.5, 0.5], [5, -5]), {
    stiffness: 140,
    damping: 18,
  });
  const rotateY = useSpring(useTransform(pointerX, [-0.5, 0.5], [-7, 7]), {
    stiffness: 140,
    damping: 18,
  });

  const handlePointerMove = (event) => {
    if (shouldReduceMotion) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    pointerX.set((event.clientX - bounds.left) / bounds.width - 0.5);
    pointerY.set((event.clientY - bounds.top) / bounds.height - 0.5);
  };

  const resetPointer = () => {
    pointerX.set(0);
    pointerY.set(0);
  };

  return (
    <section id="hero" className="hero section-frame">
      <motion.div
        className="hero-orbit"
        aria-hidden="true"
        animate={shouldReduceMotion ? undefined : { rotate: 360 }}
        transition={{ duration: 18, ease: "linear", repeat: Infinity }}
      >
        <span />
      </motion.div>

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

        <motion.div
          className="hero-console"
          aria-label="Engineering focus"
          initial={{ opacity: 0, y: 44, rotateZ: 4 }}
          animate={{ opacity: 1, y: 0, rotateZ: 1.5 }}
          transition={{ duration: 1, delay: 0.3, ease }}
          style={{ rotateX, rotateY, transformPerspective: 900 }}
          onPointerMove={handlePointerMove}
          onPointerLeave={resetPointer}
        >
          <div className="console-top">
            <div className="console-dots"><i /><i /><i /></div>
            <span>focus.json</span>
            <span>01</span>
          </div>
          <motion.div
            className="console-body"
            initial="hidden"
            animate="visible"
            variants={{ visible: { transition: { delayChildren: 0.72, staggerChildren: 0.07 } } }}
          >
            {[
              ["01", "{"],
              ["02", '\u00a0\u00a0"craft": "software engineering",'],
              ["03", '\u00a0\u00a0"approach": "systems thinking",'],
              ["04", '\u00a0\u00a0"values": ['],
              ["05", '\u00a0\u00a0\u00a0\u00a0"clarity", "scale", "reliability"'],
              ["06", "\u00a0\u00a0]"],
              ["07", "}"],
            ].map(([number, content]) => (
              <motion.p
                key={number}
                className={number === "05" ? "console-accent" : undefined}
                variants={{ hidden: { opacity: 0, x: -10 }, visible: { opacity: 1, x: 0 } }}
                transition={{ duration: 0.35 }}
              >
                <b>{number}</b><span>{content}</span>
              </motion.p>
            ))}
          </motion.div>
          <div className="console-status">
            <span><Circle size={8} fill="currentColor" /> Building at Zoho</span>
            <span>Since Oct 2025</span>
          </div>
        </motion.div>
      </div>

      <motion.div
        className="hero-footer"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.9 }}
      >
        <span>Scroll to explore</span>
        <span>Problem solving · Scale · Reliability</span>
      </motion.div>
    </section>
  );
};