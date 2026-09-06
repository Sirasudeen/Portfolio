import { ArrowRight, ArrowUpRight, Github, Plus, Minus } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const projects = [
  {
    title: "Synq", type: "Real-time communication", tone: "sage",
    description: "Less waiting. More conversation.",
    idea: "A real-time chat application for instant conversations, with a focused interface that keeps the conversation at the center.",
    focus: "WebSockets connect the live experience to a Node.js backend, with React for the interface and MongoDB for persistence.",
    image: "/projects/project1.png", width: 1920, height: 930, tags: ["WebSocket", "Node.js", "React", "MongoDB"],
    demoUrl: "https://synq.siras.dev", githubUrl: "https://github.com/Sirasudeen/Synq",
  },
  {
    title: "ZapLink", type: "Distributed web service", tone: "lilac",
    description: "Small links. Bigger systems thinking.",
    idea: "A fast URL-shortening service. A small, familiar interaction with an interesting engineering problem behind it.",
    focus: "An exploration of scale, caching, and resilient cloud deployment using Node.js, PostgreSQL, Redis, and AWS.",
    image: "/projects/project3.png", width: 1893, height: 945, tags: ["Node.js", "PostgreSQL", "Redis", "AWS"],
    demoUrl: "https://zaplink.siras.dev", githubUrl: "https://github.com/Sirasudeen/zaplink",
  },
  {
    title: "Derm AI", type: "Domain-specific AI", tone: "peach",
    description: "Better context. More relevant answers.",
    idea: "A dermatology-focused AI assistant exploring what happens when retrieval and a language model are built around a specific domain.",
    focus: "Combines hybrid search with a domain model to make responses more relevant. An AI exploration, not a substitute for professional medical advice.",
    image: "/projects/project5.png", width: 1920, height: 948, tags: ["AI", "Hybrid search", "PostgreSQL", "Node.js"],
  },
  {
    title: "Zara AI", type: "Context-aware assistant", tone: "blue",
    description: "Answers with something to draw on.",
    idea: "An AI assistant enhanced with retrieval-augmented generation to provide personalized, context-aware answers.",
    focus: "Brings retrieval and generation together, using Python, Node.js, and MongoDB to connect an answer with its context.",
    image: "/projects/project2.png", width: 1893, height: 945, tags: ["Python", "Node.js", "MongoDB", "RAG"],
    demoUrl: "https://zara-ai.siras.dev",
  },
  {
    title: "Siras Notes", type: "Learning in public", tone: "sand",
    description: "A second brain, left open.",
    idea: "My living documentation and writing space for projects, system design, lessons learned, and useful experiments.",
    focus: "Built with React and Docusaurus. A place to turn what I am learning into something I can revisit and share.",
    image: "/projects/project4.png", width: 1896, height: 935, tags: ["React", "Docusaurus", "Writing"],
    demoUrl: "https://notes.siras.dev", githubUrl: "https://github.com/Sirasudeen/Siras-notes",
  },
];

const ProjectItem = ({ project, index }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.article
      className={`project-card project-card--${project.tone}${index === 2 ? " project-card--wide" : ""}`}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="project-artwork">
        <span className="project-art-index" aria-hidden="true">0{index + 1}</span>
        <img
          src={project.image}
          alt={`${project.title} application interface`}
          loading="lazy"
          decoding="async"
          width={project.width}
          height={project.height}
        />
        <span className="project-art-caption">{project.type}</span>
        <ArrowUpRight className="project-art-mark" size={24} aria-hidden="true" />
      </div>
      <div className="project-information">
        <div className="project-title-row">
          <h3>{project.title}</h3>
          <span className="project-sequence">0{index + 1} / 05</span>
        </div>
        <p className="project-description">{project.description}</p>
        <ul className="project-tags" aria-label={`${project.title} technologies`}>
          {project.tags.map(tag => <li key={tag}>{tag}</li>)}
        </ul>

        <div className="project-notes">
          <button
            type="button"
            className="project-notes-trigger"
            onClick={() => setIsOpen(!isOpen)}
            aria-expanded={isOpen}
          >
            <span>Inside the build</span>
            <span className="project-notes-icon">
              {isOpen ? <Minus size={16} aria-hidden="true" /> : <Plus size={16} aria-hidden="true" />}
            </span>
          </button>
          <AnimatePresence initial={false}>
            {isOpen && (
              <motion.div
                className="project-notes-content"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="project-notes-inner">
                  <span className="small-label">The idea</span>
                  <p>{project.idea}</p>
                  <span className="small-label">The engineering</span>
                  <p>{project.focus}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="project-links">
          {project.demoUrl && (
            <a href={project.demoUrl} target="_blank" rel="noreferrer" aria-label={`Visit ${project.title}`}>
              Visit project <ArrowUpRight size={16} aria-hidden="true" />
            </a>
          )}
          {project.githubUrl && (
            <a href={project.githubUrl} target="_blank" rel="noreferrer" aria-label={`${project.title} source code`}>
              <Github size={15} aria-hidden="true" /> Source code
            </a>
          )}
          {!project.demoUrl && !project.githubUrl && (
            <span className="project-private-note">An exploration in applied AI</span>
          )}
        </div>
      </div>
    </motion.article>
  );
};

export const ProjectsSection = () => (
  <section id="projects" className="projects section-frame section-pad">
    <div className="section-kicker"><span>01</span><p>Selected work</p><span className="kicker-aside">Ideas, made tangible</span></div>
    <div className="projects-heading">
      <h2>From &ldquo;what if&rdquo;<br /><em>to something real.</em></h2>
      <div><span className="small-label">A selection, not a collection</span><p>Different problems. Different tools.<br />The same instinct to figure it out.</p><a className="text-link" href="https://github.com/Sirasudeen" target="_blank" rel="noreferrer">Explore GitHub <ArrowUpRight size={15} aria-hidden="true" /></a></div>
    </div>
    <div className="project-grid">
      {projects.map((project, index) => (
        <ProjectItem key={project.title} project={project} index={index} />
      ))}
    </div>
    <a className="more-work" href="https://github.com/Sirasudeen/Rideshare" target="_blank" rel="noreferrer">
      <span className="small-label">One more experiment ↳</span><div><h3>RideShare</h3><p>Two builders. One hackathon. An AI-assisted ride-booking platform.</p></div><span className="more-work-arrow"><ArrowRight size={26} aria-hidden="true" /><span className="sr-only">View RideShare on GitHub</span></span>
    </a>
  </section>
);