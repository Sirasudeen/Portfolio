import { ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";

const explorations = [
  ["01", "System design", "Making complexity easier to reason about."],
  ["02", "JVM internals", "Following the machine beneath the API."],
  ["03", "MCP servers", "Giving useful tools a little more context."],
];

export const AboutSection = () => (
  <section id="about" className="about section-frame section-pad">
    <div className="section-kicker"><span>02</span><p>Notes from the making</p><span className="kicker-aside">Still under construction</span></div>
    <div className="about-grid">
      <motion.div className="about-statement" initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }}>
        <p className="eyebrow">Hello, I&apos;m Siras.</p>
        <h2>Curiosity first.<br /><em>Code second.</em></h2>
        <div className="about-signature" aria-hidden="true">
          <svg viewBox="0 0 180 85" fill="none"><path d="M15 51C37 9 85 10 63 34S20 81 71 64C96 56 106 20 87 44S119 68 129 39C117 72 140 62 164 45M52 76L157 65" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
          <span>Think clearly. Stay curious.</span>
        </div>
      </motion.div>
      <div className="about-copy">
        <p className="about-lede">Most problems get interesting right after the obvious answer stops working.</p>
        <p>I&apos;m a software developer who likes staying with the awkward bit. The constraints, the strange edge case, the abstraction that almost fits but not quite.</p>
        <p>Since joining Zoho as an SDE in October 2025, I&apos;ve been exploring JVM internals, system design, and MCP servers. Mostly, I&apos;m interested in what happens when the pieces have to work together in the real world.</p>
        <a href="https://www.linkedin.com/in/sirasudeen-p-4512b4221/" target="_blank" rel="noreferrer" className="text-link">More of the plot on LinkedIn <ArrowUpRight size={16} aria-hidden="true" /></a>
      </div>
    </div>
    <div className="about-notebook">
      <div className="notebook-caption"><span className="small-label">Currently under the hood</span><p>Less surface.<br /><em>More substance.</em></p><span className="about-role"><i /> SDE at Zoho · Oct 2025—present</span></div>
      <div className="notebook-entries">
        {explorations.map(([number, title, description]) => <div className="notebook-entry" key={number}><span>{number}</span><div><h3>{title}</h3><p>{description}</p></div><ArrowUpRight size={19} aria-hidden="true" /></div>)}
      </div>
    </div>
  </section>
);