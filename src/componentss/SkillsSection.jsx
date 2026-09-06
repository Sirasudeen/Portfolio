import { ArrowRight, ArrowUpRight } from "lucide-react";
import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const principles = [
  { id: "solve", label: "Read the room.", keyword: "Signal", title: "Begin where the noise ends.", description: "Every brief arrives dressed as a solution. I look for the constraint underneath it, then make the smallest useful move.", steps: ["Notice", "Question", "Shape", "Repeat"], note: "The good question is usually hiding in plain sight." },
  { id: "scale", label: "Make it breathe.", keyword: "Headroom", title: "Give the future somewhere to go.", description: "Pressure is information. Leave space between responsibilities, let the system reveal its shape, and make complexity earn its keep.", steps: ["Watch", "Separate", "Buffer", "Stretch"], note: "Leave a little room for the version you cannot see yet." },
  { id: "rely", label: "Keep a way out.", keyword: "Escape route", title: "Design the way back.", description: "The happy path is only half the story. Make the edges visible, contain the strange parts, and give the system a graceful next move.", steps: ["Notice", "Contain", "Recover", "Learn"], note: "A good system knows how to find its way home." },
];

const PrincipleDiagram = ({ mode }) => (
  <svg className="principle-diagram" viewBox="0 0 460 270" fill="none" aria-hidden="true">
    {Array.from({length: 28}, (_, i) => <circle key={i} cx={35 + i % 7 * 65} cy={35 + Math.floor(i / 7) * 65} r="1" fill="currentColor" opacity="0.16" />)}
    {mode === "solve" && <g><circle cx="230" cy="135" r="85" className="diagram-guide" /><circle cx="230" cy="135" r="110" className="diagram-guide" strokeDasharray="2 8" />{[45,100,170,240,305].map((angle, i) => <g key={angle} transform={`rotate(${angle} 230 135)`}><path d="M230 29L230 105" className="diagram-line" /><circle cx="230" cy="29" r={i % 2 ? 7 : 4} fill="var(--paper)" /></g>)}<circle cx="230" cy="135" r="23" className="diagram-core" /><path d="M220 135L227 142L241 127" stroke="var(--ink)" strokeWidth="2" /></g>}
    {mode === "scale" && <g><path d="M90 135H175M175 65V205M175 65H300M175 135H300M175 205H300" className="diagram-line" />{[65,135,205].map(y => <g key={y}><path d={`M325 ${y}H400`} className="diagram-guide" /><rect x="292" y={y-16} width="32" height="32" rx="2" fill="var(--paper)" /><circle cx="400" cy={y} r="7" className="diagram-core" /></g>)}<circle cx="90" cy="135" r="24" className="diagram-core" /><path d="M83 135H97M90 128V142" stroke="var(--ink)" strokeWidth="2" /></g>}
    {mode === "rely" && <g><path d="M80 135Q230 -50 380 135" stroke="var(--accent)" strokeDasharray="5 7" opacity="0.5" /><path d="M80 135Q230 320 380 135" className="diagram-line" /><path d="M221 50L239 68M239 50L221 68" stroke="var(--accent)" strokeWidth="2" /><circle cx="80" cy="135" r="20" fill="var(--paper)" /><circle cx="380" cy="135" r="24" className="diagram-core" /><circle cx="230" cy="227" r="10" fill="var(--paper)" /><path d="M370 135L377 142L390 128" stroke="var(--ink)" strokeWidth="2" /></g>}
  </svg>
);

export const SkillsSection = () => {
  const [active, setActive] = useState(0);
  const tabs = useRef([]);
  const principle = principles[active];
  const handleKey = (event, index) => {
    let next;
    if (event.key === "ArrowDown" || event.key === "ArrowRight") next = (index + 1) % principles.length;
    if (event.key === "ArrowUp" || event.key === "ArrowLeft") next = (index + principles.length - 1) % principles.length;
    if (event.key === "Home") next = 0;
    if (event.key === "End") next = principles.length - 1;
    if (next === undefined) return;
    event.preventDefault();
    setActive(next);
    tabs.current[next]?.focus();
  };
  return (
    <section id="skills" className="skills section-pad">
      <div className="section-frame">
        <div className="section-kicker section-kicker--light"><span>03</span><p>The operating system</p><span className="kicker-aside">Field notes from the edge</span></div>
        <div className="skills-heading"><h2>The stack is temporary.<br /><em>The instinct isn&apos;t.</em></h2><p>The tools are just the surface.<br />The interesting part happens underneath.</p></div>
        <div className="approach-layout">
          <div className="approach-tabs" role="tablist" aria-label="Engineering principles" aria-orientation="vertical">
            {principles.map((item, index) => (
              <button
                key={item.id}
                ref={el => { tabs.current[index] = el; }}
                id={`principle-${item.id}`}
                role="tab"
                aria-selected={active === index}
                aria-controls="principle-panel"
                tabIndex={active === index ? 0 : -1}
                onClick={() => setActive(index)}
                onKeyDown={event => handleKey(event, index)}
                className={`approach-tab${active === index ? " approach-tab--active" : ""}`}
              >
                <span className="approach-number">0{index + 1}</span>
                <span>{item.label}</span>
                <ArrowUpRight size={23} aria-hidden="true" />
              </button>
            ))}
            <p className="approach-footnote">Pick a lens. Watch the shape of the answer change.</p>
          </div>
          <div className="approach-panel" id="principle-panel" role="tabpanel" aria-labelledby={`principle-${principle.id}`} tabIndex={0}>
            <AnimatePresence mode="wait">
              <motion.div
                key={principle.id}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="approach-panel-content"
              >
                <div className="approach-illustration">
                  <span className="small-label">Fig. 0{active + 1} / {principle.keyword}</span>
                  <PrincipleDiagram mode={principle.id} />
                  <p>{principle.note}</p>
                </div>
                <div className="approach-explanation">
                  <h3>{principle.title}</h3>
                  <p>{principle.description}</p>
                  <ol>
                    {principle.steps.map(step => <li key={step}><ArrowRight size={12} aria-hidden="true" />{step}</li>)}
                  </ol>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
};