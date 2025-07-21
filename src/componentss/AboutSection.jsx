import { Server, Layout, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
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
              Software Developer & DevOps Enthusiast
            </h3>
            <p className="text-lg text-muted-foreground leading-relaxed">
            I’m a software engineer with a growing passion for DevOps and cloud infrastructure. While I enjoy writing scalable backend code in NodeJs 
            and building full-stack apps with React, I also love deploying, automating, and monitoring systems using Docker, AWS, and GitHub Actions.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Currently exploring CI/CD pipelines, Kubernetes, and Terraform, aiming to bridge the gap between development and operations by owning both code and delivery.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4 justify-center">
              <a href="#contact" className="cosmic-button">
                {" "}
                Get In Touch
              </a>

              <a
                href=""
                className="px-6 py-2 rounded-full border border-primary text-primary hover:bg-primary/10 transition-colors duration-300"
              >
                Download CV
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
                title: "Backend Architecture",
                description:
                  "Designing robust, scalable backend systems that power real-world applications.",
              },
              {
                icon: <Layout className="h-7 w-7 text-primary" />,
                title: "Full Stack Development",
                description:
                  "Building complete web applications from database to frontend with clean, maintainable code.",
              },
              {
                icon: <Settings className="h-7 w-7 text-primary" />,
                title: "DevOps and Deployment",
                description:
                  "Automating workflows, setting up CI/CD pipelines, and deploying production-ready apps with confidence.",
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
