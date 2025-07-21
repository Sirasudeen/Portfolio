import { ArrowRight, ExternalLink, Github } from "lucide-react";
import { motion } from "framer-motion";

const projects = [
  {
    id: 1,
    title: "Siras Notes",
    description: "A simple, clean documentation and blog site. Built to learn in public, document progress, and hopefully help others along the way.",
    image: "/projects/project4.png",
    tags: ["React", "Docusaurus", "Blogging","Content Writingmake it"],
    demoUrl: "https://notes.siras.dev",
    githubUrl: "https://github.com/Sirasudeen/Siras-notes",
  },
  {
    id: 2,
    title: "Synq",
    description:
      "Synq is a real-time chat app that lets users connect instantly and exchange messages over WebSockets with a clean, minimal interface.",
    image: "/projects/project1.png",
    tags: ["WebSocket", "Nodejs", "React","MongoDB"],
    demoUrl: "https://synq.siras.dev",
    githubUrl: "https://github.com/Sirasudeen/Synq",
  },
  {
    id: 3,
    title: "ZapLink",
    description:
      "A fast, highly scalable URL shortening service powered by Node.js, PostgreSQL, Redis, and AWS.",
    image: "/projects/project3.png",
    tags: ["Nodejs", "Postgres","AWS","Microservices"],
    demoUrl: "https://zaplink.siras.dev",
    githubUrl: "https://github.com/Sirasudeen/zaplink",
  },
  {
    id: 4,
    title: "Zara AI",
    description:
      "An AI chatbot application enhanced with RAG to deliver personalized, context aware responses.",
    image: "/projects/project2.png",
    tags: ["Nodejs", "Python","MongoDB","OpenAI","Microservices"],
    demoUrl: "https://zara-ai.siras.dev",
    githubUrl: "https://github.com/Sirasudeen/zaplink",
  }, 
  {
    id: 5,
    title: "Derm AI",
    description:
      "A Dermatology focused chatbot that uses a hybrid search system and a domain-specific model to provide accurate responses",
    image: "/projects/project5.png",
    tags: ["Nodejs", "Postgres","AWS","Microservices"],
    demoUrl: "https://zaplink.siras.dev",
    githubUrl: "https://github.com/Sirasudeen/zaplink",
  },
  {
    id: 6,
    title: "RideShare",
    description:
      "An AI powered ride-booking platform built as team of 2 for a hackathon. Uses Microservices architecture with docker and AWS.",
    image: "/projects/project3.png",
    tags: ["Python", "React","AWS","Microservices","Google Maps API","Open AI"],
    demoUrl: "#",
    githubUrl: "https://github.com/Sirasudeen/Rideshare",
  },
];

export const ProjectsSection = () => {
  return (
    <section id="projects" className="py-24 px-4 relative">
      <div className="container mx-auto max-w-5xl">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center">
          Featured <span className="text-primary"> Projects </span>
        </h2>

        <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
          Here are some of my recent projects. Each project was carefully
          crafted with attention to detail, performance, and user experience.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, key) => (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: key * 0.1 }}
              viewport={{ once: true, amount: 0.2 }}
              className="group bg-card rounded-lg overflow-hidden shadow-xs card-hover"
            >
              <div className="h-48 overflow-hidden">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>

              <div className="p-6">
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 text-xs font-medium border rounded-full bg-secondary text-secondary-foreground"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <h3 className="text-xl font-semibold mb-1">{project.title}</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  {project.description}
                </p>
                <div className="flex justify-between items-center">
                  <div className="flex space-x-3">
                    <a
                      href={project.demoUrl}
                      target="_blank"
                      className="text-foreground/80 hover:text-primary transition-colors duration-300"
                    >
                      <ExternalLink size={20} />
                    </a>
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      className="text-foreground/80 hover:text-primary transition-colors duration-300"
                    >
                      <Github size={20} />
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-12">
          <a
            className="cosmic-button w-fit flex items-center mx-auto gap-2"
            target="_blank"
            href="https://github.com/sirasudeen"
          >
            Check My Github <ArrowRight size={16} />
          </a>
        </div>
      </div>
    </section>
  );
};
