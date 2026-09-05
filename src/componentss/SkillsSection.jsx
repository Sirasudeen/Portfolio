import { ArrowRight } from "lucide-react";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const recipes = [
  {
    id: "solve",
    label: "Solve",
    title: "Turn ambiguity into a clear path",
    description: "Start with the real constraint, model the problem, and iterate toward the simplest useful solution.",
    stack: ["Understand", "Model", "Build", "Iterate"],
    output: "Clear · practical · complete",
  },
  {
    id: "scale",
    label: "Scale",
    title: "Design for growth without guesswork",
    description: "Measure where pressure appears, separate responsibilities, and evolve the architecture deliberately.",
    stack: ["Measure", "Decouple", "Cache", "Distribute"],
    output: "Efficient · adaptable · scalable",
  },
  {
    id: "rely",
    label: "Rely",
    title: "Build confidence into the system",
    description: "Make behavior observable, contain failure, and use feedback to strengthen the software over time.",
    stack: ["Observe", "Isolate", "Recover", "Learn"],
    output: "Stable · resilient · maintainable",
  },
];

export const SkillsSection = () => {
  const [activeRecipe, setActiveRecipe] = useState(recipes[0]);

  return (
    <section id="skills" className="skills section-frame section-pad">
      <div className="section-kicker"><span>02</span><p>Capabilities</p></div>
      <motion.div
        className="skills-heading"
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
      >
        <h2>Understand the system.<br /><em>Then build it well.</em></h2>
        <p>Technology changes quickly. The ability to reason about behavior, tradeoffs, and failure modes compounds.</p>
      </motion.div>

      <div className="skills-marquee" aria-hidden="true">
        <motion.div
          className="skills-marquee-track"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 22, ease: "linear", repeat: Infinity }}
        >
          <span>Think clearly · Build deliberately · Learn continuously · </span>
          <span>Think clearly · Build deliberately · Learn continuously · </span>
        </motion.div>
      </div>

      <motion.div
        className="stack-composer"
        initial={{ opacity: 0, y: 42, rotateX: 8 }}
        whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="composer-topline">
          <span>Problem-solving lens</span>
          <span>Choose a principle</span>
        </div>
        <div className="composer-body">
          <div className="composer-modes" role="tablist" aria-label="Engineering principles">
            {recipes.map((recipe, index) => (
              <motion.button
                key={recipe.id}
                type="button"
                role="tab"
                aria-selected={activeRecipe.id === recipe.id}
                className={activeRecipe.id === recipe.id ? "composer-mode composer-mode--active" : "composer-mode"}
                onClick={() => setActiveRecipe(recipe)}
                whileHover={{ x: 5 }}
                whileTap={{ scale: 0.97 }}
              >
                <span>0{index + 1}</span>{recipe.label}
              </motion.button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              className="recipe-stage"
              key={activeRecipe.id}
              role="tabpanel"
              initial={{ opacity: 0, y: 18, filter: "blur(7px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -12, filter: "blur(5px)" }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            >
              <p className="recipe-label">How I approach it</p>
              <h3>{activeRecipe.title}</h3>
              <p className="recipe-description">{activeRecipe.description}</p>
              <motion.div
                className="recipe-track"
                initial="hidden"
                animate="visible"
                variants={{ visible: { transition: { staggerChildren: 0.07 } } }}
              >
                {activeRecipe.stack.map((tool, index) => (
                  <motion.div
                    className="recipe-step"
                    key={tool}
                    variants={{ hidden: { opacity: 0, x: -12 }, visible: { opacity: 1, x: 0 } }}
                  >
                    <span>{tool}</span>
                    {index < activeRecipe.stack.length - 1 && <ArrowRight size={16} aria-hidden="true" />}
                  </motion.div>
                ))}
              </motion.div>
              <div className="recipe-output"><span>Output</span><strong>{activeRecipe.output}</strong></div>
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>

    </section>
  );
};