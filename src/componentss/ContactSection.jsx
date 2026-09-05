import { ArrowUpRight, Github, Linkedin, Mail, MapPin } from "lucide-react";
import { motion } from "framer-motion";

export const ContactSection = () => {
  return (
    <section id="contact" className="contact section-frame section-pad">
      <div className="section-kicker section-kicker--light"><span>04</span><p>Contact</p></div>
      <motion.div
        className="contact-grid"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={{ visible: { transition: { staggerChildren: 0.14 } } }}
      >
        <motion.div
          variants={{ hidden: { opacity: 0, x: -36 }, visible: { opacity: 1, x: 0 } }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="eyebrow eyebrow--light"><span /> Beyond the code</p>
          <h2>Something on<br /><em>your mind?</em></h2>
        </motion.div>
        <motion.div
          className="contact-copy"
          variants={{ hidden: { opacity: 0, y: 32 }, visible: { opacity: 1, y: 0 } }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <p>
            Interesting ideas rarely arrive fully formed. If you&apos;re thinking
            through a complex system or a problem without an obvious answer,
            I&apos;d be glad to hear about it.
          </p>
          <motion.a
            className="contact-email"
            href="mailto:Sirasudeenp@gmail.com"
            whileHover={{ x: 8 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
          >
            <Mail size={20} aria-hidden="true" />
            Sirasudeenp@gmail.com
            <ArrowUpRight size={20} aria-hidden="true" />
          </motion.a>
          <div className="contact-meta">
            <span><MapPin size={15} aria-hidden="true" /> Tirunelveli, Tamil Nadu</span>
            <div>
              <a href="https://www.linkedin.com/in/sirasudeen-p-4512b4221/" target="_blank" rel="noreferrer" aria-label="LinkedIn">
                <Linkedin size={19} />
              </a>
              <a href="https://github.com/sirasudeen" target="_blank" rel="noreferrer" aria-label="GitHub">
                <Github size={19} />
              </a>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};