import { ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";

const principleList = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const principle = {
  hidden: { opacity: 0, y: 36 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
};

export const AboutSection = () => {
  return (
    <section id="about" className="about section-frame section-pad">
      <motion.div
        className="section-kicker"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <span>01</span><p>About</p>
      </motion.div>

      <div className="about-grid">
        <motion.div
          className="about-statement"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2>I like turning hard problems into <em>clear systems.</em></h2>
        </motion.div>

        <motion.div
          className="about-copy"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <p>
            I&apos;m a software developer who enjoys understanding complex problems,
            finding the right abstractions, and building solutions that remain
            dependable as they grow.
          </p>
          <p>
            Since joining Zoho as an SDE in October 2025, I&apos;ve worked on
            instrumentation, explored JVM internals, and built multiple MCP servers.
            Those are recent parts of a broader journey that I continue alongside
            learning system design and building software across the stack.
          </p>
          <a
            href="https://www.linkedin.com/in/sirasudeen-p-4512b4221/"
            target="_blank"
            rel="noreferrer"
            className="text-link"
          >
            View LinkedIn <ArrowUpRight size={16} aria-hidden="true" />
          </a>
        </motion.div>
      </div>

      <motion.div
        className="principles"
        aria-label="Engineering principles"
        variants={principleList}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.25 }}
      >
        <motion.div variants={principle} whileHover={{ y: -8 }}><span>01</span><strong>Problem solving</strong><p>Understanding the real problem before choosing the solution.</p></motion.div>
        <motion.div variants={principle} whileHover={{ y: -8 }}><span>02</span><strong>Scalable design</strong><p>Building with growth, change, and clear boundaries in mind.</p></motion.div>
        <motion.div variants={principle} whileHover={{ y: -8 }}><span>03</span><strong>Reliable software</strong><p>Favoring predictable behavior and maintainable systems.</p></motion.div>
      </motion.div>
    </section>
  );
};