import { ArrowRight, ArrowUpRight, Github } from "lucide-react";
import { motion } from "framer-motion";

const projects = [
  {
    title: "Synq",
    type: "Real-time communication",
    description: "A real-time chat application for instant, reliable conversations over WebSockets, wrapped in a focused interface.",
    image: "/projects/project1.png",
    tags: ["WebSocket", "Node.js", "React", "MongoDB"],
    demoUrl: "https://synq.siras.dev",
    githubUrl: "https://github.com/Sirasudeen/Synq",
  },
  {
    title: "ZapLink",
    type: "Distributed web service",
    description: "A fast URL-shortening service designed around scale, caching, and resilient cloud deployment.",
    image: "/projects/project3.png",
    tags: ["Node.js", "PostgreSQL", "Redis", "AWS"],
    demoUrl: "https://zaplink.siras.dev",
    githubUrl: "https://github.com/Sirasudeen/zaplink",
  },
  {
    title: "Derm AI",
    type: "Domain-specific AI",
    description: "A dermatology-focused assistant combining hybrid search with a domain model for more relevant responses.",
    image: "/projects/project5.png",
    tags: ["AI", "Hybrid search", "PostgreSQL", "Node.js"],
  },
  {
    title: "Zara AI",
    type: "Context-aware assistant",
    description: "An AI assistant enhanced with retrieval-augmented generation to provide personalized, context-aware answers.",
    image: "/projects/project2.png",
    tags: ["Python", "Node.js", "MongoDB", "RAG"],
    demoUrl: "https://zara-ai.siras.dev",
  },
  {
    title: "Siras Notes",
    type: "Learning in public",
    description: "My living documentation and writing space for projects, system design, lessons learned, and useful experiments.",
    image: "/projects/project4.png",
    tags: ["React", "Docusaurus", "Technical writing"],
    demoUrl: "https://notes.siras.dev",
    githubUrl: "https://github.com/Sirasudeen/Siras-notes",
  },
];

export const ProjectsSection = () => {
  return (
    <section id="projects" className="projects section-frame section-pad">
      <div className="section-kicker"><span>03</span><p>Selected work</p></div>
      <div className="projects-heading">
        <h2>Built to solve.<br /><em>Designed to last.</em></h2>
        <p>A selection of products where backend thinking meets a usable, considered interface.</p>
      </div>

      <div className="project-list">
        {projects.map((project, index) => (
          <motion.article
            className="project-row"
            key={project.title}
            initial="hidden"
            whileInView="visible"
            whileHover="hover"
            variants={{
              hidden: { opacity: 0, y: 36 },
              visible: { opacity: 1, y: 0 },
            }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            viewport={{ once: true, amount: 0.15 }}
          >
            <motion.div className="project-index" variants={{ hover: { x: 6, color: "#171816" } }}>0{index + 1}</motion.div>
            <motion.div className="project-visual">
              <motion.img
                src={project.image}
                alt={`${project.title} interface`}
                loading="lazy"
                variants={{ hover: { scale: 1.055 } }}
                transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
              />
            </motion.div>
            <div className="project-info">
              <p className="project-type">{project.type}</p>
              <h3>{project.title}</h3>
              <p className="project-description">{project.description}</p>
              <ul>{project.tags.map((tag) => <li key={tag}>{tag}</li>)}</ul>
              <div className="project-links">
                {project.demoUrl && (
                  <a href={project.demoUrl} target="_blank" rel="noreferrer">
                    Visit project <ArrowUpRight size={15} aria-hidden="true" />
                  </a>
                )}
                {project.githubUrl && (
                  <a href={project.githubUrl} target="_blank" rel="noreferrer" aria-label={`${project.title} source code`}>
                    <Github size={17} aria-hidden="true" /> Source
                  </a>
                )}
              </div>
            </div>
          </motion.article>
        ))}
      </div>

      <motion.div
        className="more-work"
        initial={{ opacity: 0, scale: 0.97 }}
        whileInView={{ opacity: 1, scale: 1 }}
        whileHover={{ y: -5, boxShadow: "9px 9px 0 #171816" }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
      >
        <div><span>Also built</span><strong>RideShare</strong><p>An AI-assisted ride-booking platform built by a team of two for a hackathon.</p></div>
        <a href="https://github.com/Sirasudeen/Rideshare" target="_blank" rel="noreferrer">
          View on GitHub <ArrowRight size={16} aria-hidden="true" />
        </a>
      </motion.div>
    </section>
  );
};