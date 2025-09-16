import { Server, Layout, BrainCircuit } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";

export const AboutSection = () => {
  return (
    <section
      id="about"
      className="min-h-screen py-32 px-4 bg-background flex items-center"
    >
      <div className="container mx-auto max-w-6xl">
        <motion.h2
          className="text-5xl md:text-6xl font-extrabold text-left mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          About <span className="text-primary">Me</span>
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
          {/* Left Column */}
          <motion.div
            className="space-y-8 text-left"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="text-3xl font-semibold text-foreground">
              Software Engineer with a Passion for Backend & System Design
            </h3>
            <p className="text-lg text-muted-foreground leading-relaxed">
              I'm a software engineer who enjoys building complete, scalable applications. My experience is in creating full-stack solutions with <strong>Node.js and React</strong>, but my passion lies in crafting robust backend architecture. I've recently been focusing heavily on <strong>Core Java</strong>, applying object-oriented design principles to solve complex system design problems.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              My goal is to bridge the gap between development and operations. I am actively learning about deployment pipelines and cloud infrastructure to complement my development skills.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <a href="#contact" className="px-6 py-2 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors duration-300 text-center">
                Get In Touch
              </a>
              <a
              href="https://sirasresume.s3.ap-south-1.amazonaws.com/Resume_2.pdf"
                className="px-6 py-2 rounded-full border border-primary text-primary hover:bg-primary/10 transition-colors duration-300 text-center"
              >
                Download Resume
              </a>
            </div>
          </motion.div>

          {/* Right Column - Feature Cards */}
          <motion.div
            className="grid gap-6"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {[
              {
                icon: <Server className="h-7 w-7 text-primary" />,
                title: "Backend Development",
                description:
                  "Building robust, scalable backend systems in Java and Node.js, focusing on clean architecture and performance.",
              },
              {
                icon: <Layout className="h-7 w-7 text-primary" />,
                title: "Full Stack Implementation",
                description:
                  "Bringing designs to life by developing complete web applications from the database to the user interface.",
              },
              {
                icon: <BrainCircuit className="h-7 w-7 text-primary" />,
                title: "System Design & LLD",
                description:
                  "Applying object-oriented principles and design patterns to create modular, maintainable, and efficient software.",
              },
            ].map((item, index) => (
              <Card
                key={index}
                className="p-6 hover:shadow-xl transition-shadow bg-background/80 backdrop-blur-sm border border-primary/20"
              >
                <CardContent className="flex items-start gap-5 p-0">
                  <div className="p-3 rounded-full bg-primary/10">
                    {item.icon}
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold">{item.title}</h4>
                    <p className="text-muted-foreground text-base mt-1">
                      {item.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};
