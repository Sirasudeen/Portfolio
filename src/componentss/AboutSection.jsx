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
                href="https://sirasresume.s3.ap-south-1.amazonaws.com/Resume_2.pdf?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIATMY6LHK5C3H322ZS%2F20250916%2Fap-south-1%2Fs3%2Faws4_request&X-Amz-Date=20250916T010800Z&X-Amz-Expires=300&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEAkaCmFwLXNvdXRoLTEiSDBGAiEA1qK8AR961RQGBuUVKP7LsH5V5qrSAhEcgv79Z1VriEECIQC6MRLXfKwHB%2BpIRT5DKVQ9zV5il9wlb4WUOKEQoBtn3irjAgiC%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDIzMzYwMjQ5NzIxMCIM6wBAa685b2qkTT44KrcCUJrBjUyZv1fmQEN%2FDtRzG%2Fs%2B%2BXggS%2ByQw3c5po2QUIElMx7gDSsKBsbnF9BQdPEz5LMTLKarQUl67bpzK4gdTF5rA1tQq%2BhMGx7wJ5CUXvYQMnO0rrmOMYqsP2J%2FkugFBqrs31b0pc%2BOmOYKiOh%2F6dGEfYLYA9%2BQDgTXY0y2UymN%2BrGynZmjSPnt%2By5nuSUJBmvNl1MOrXc%2F5wjqyCZmaGtvAzNUK6nDzmSNcDwLVA5VTy0bamAaYkMqYepWykw5efy1%2B2qCjPbZ7MhVQ7jEe71QTqssv511oatN4nq3x5EopGBM4GsmDBxQJX1hv2RWMXcp52manjeG49hM%2F%2BGQgAX1FlYILmczqms%2FUakDJ5AeC6XGiQT%2FCialMQW6apc8sPiQeHVqM6FoyO3HrNhRS8%2B6UwiMMnww1u6ixgY6rALQ3H3f21bhnyxBgUb6EBHdaGVdAvAxRjxPqXoa0uWGXjtn%2FcVg7xKoKXaed4dAv%2FfgfHDGMOX9oywnE93YBUBlGIQNxo16YfHAOShilMsGtcKe9KeCScJQB8yYUccqN4jE7Ce3BBmOu5fZK1R9vDpFuO%2Fj%2FC1NxMdchLpqMYTYK7fFPVaf%2BB82DO4P1Gg01V6R3qbJkBcNcmWENSnQhu9KPul50dXeUxt9joZJYtHWQS8ECdb630EPkTD4KS%2B0j9ISRCHz5gRZrxlE3dmjzRQ8H0Q7U5NDwEZO2XEQU7ao8Bf3rx0h2P5olCKEdt1sVpBiELx%2FTgjOO%2BbaQ0bMfQ%2Bwxo3nNQcl30wJbTfVyDWkdYsfiZM2Lb40SrG%2FXXznDxueCHE7Uy3jimbKbpE%3D&X-Amz-Signature=9627d6c1dee748e0e0571661ee21a663b40939fcc9bbc5984a35ce8afcc93189&X-Amz-SignedHeaders=host&response-content-disposition=inline" // TODO: Add your CV link here
                className="px-6 py-2 rounded-full border border-primary text-primary hover:bg-primary/10 transition-colors duration-300 text-center"
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
