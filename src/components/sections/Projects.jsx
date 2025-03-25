
export const Projects = () => {
    return (
        <section
            id="projects"
            className="min-h-screen flex items-center justify-center py-20"
        >
            <div className="max-w-5xl mx-auto px-4">
                <h2 className="text-3xl font-bold mb-8 bg-gradient-to-r from-blue-500 to-cyan-400 bg-clip-text text-transparent text-center">
                    {" "}
                    Featured Projects
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-6 rounded-xl border border-white/10 hover:-translate-y-1 hover:border-blue-500/30 hover:shadow-[0_2px_8px_rgba(59,130,246,0.2)] transition">
                        <h3 className="text-xl font-bold mb-2"> Zara AI</h3>
                        <p className="text-gray-400 mb-4">
                            An RAG-based chatbot for academic stress management.
                        </p>
                        <div className="flex flex-wrap gap-2 mb-4">
                            {["React", "Node.js", "python", "Docker"].map((tech, key) => (
                                <span
                                    key={key}
                                    className="bg-blue-500/10 text-blue-500 py-1 px-3 rounded-full text-sm hover:bg-blue-500/20 
                                    hover:shadow-[0_2px_8px_rgba(59,130,246,0.1)] transition-all
                    "
                                >
                                    {tech}
                                </span>
                            ))}
                        </div>

                        <div className="flex justify-between items-center">
                            <a
                                href="https://zara-ai.vercel.app/"
                                className="text-blue-400 hover:text-blue-300 transition-colors my-4"
                            >
                                View Project →
                            </a>
                        </div>
                    </div>
                    <div
                        className="
              glass p-6 rounded-xl border border-white/10 
              hover:-translate-y-1 hover:border-blue-500/30
              hover:shadow-[0_4px_20px_rgba(59,130,246,0.1)]
              transition-all
            "
                    >
                        <h3 className="text-xl font-bold mb-2">RideShare</h3>
                        <p className="text-gray-400 mb-4">
                            A ride-booking platform for the Hexaware Hackathon, enabling real-time tracking, ride management, and secure payments.
                        </p>
                        <div className="flex flex-wrap gap-2 mb-4">
                            {["Reactjs", "MUI", "MongoDB", "Flask"].map((tech, key) => (
                                <span
                                    key={key}
                                    className="
                      bg-blue-500/10 text-blue-500 py-1 px-3 
                      rounded-full text-sm
                      transition
                      hover:bg-blue-500/20 hover:-translate-y-0.5
                      hover:shadow-[0_2px_8px_rgba(59,130,246,0.2)]
                    "
                                >
                                    {tech}
                                </span>
                            ))}
                        </div>
                        <div className="flex justify-between items-center">
                            <a
                                href="https://github.com/Sirasudeen/Rideshare"
                                className="text-blue-400 hover:text-blue-300 transition-colors my-4"
                            >
                                View Project →
                            </a>
                        </div>
                    </div>

                    <div
                        className="
              glass p-6 rounded-xl border border-white/10 
              hover:-translate-y-1 hover:border-blue-500/30
              hover:shadow-[0_4px_20px_rgba(59,130,246,0.1)]
              transition-all
            "
                    >
                        <h3 className="text-xl font-bold mb-2">Worldine</h3>
                        <p className="text-gray-400 mb-4">
                            Simple yet engaging virtual tour app built with React, featuring smooth GSAP animations that bring photos of seven countries to life, allowing users to explore tourist pages with a click.
                        </p>
                        <div className="flex flex-wrap gap-2 mb-4">
                            {["Reactjs", "JavaScript", "Gsap", "CSS"].map(
                                (tech) => (
                                    <span
                                        key={tech}
                                        className="
                      bg-blue-500/10 text-blue-500 py-1 px-3 
                      rounded-full text-sm
                      transition
                      hover:bg-blue-500/20 hover:-translate-y-0.5
                      hover:shadow-[0_2px_8px_rgba(59,130,246,0.2)]
                    "
                                    >
                                        {tech}
                                    </span>
                                )
                            )}
                        </div>
                        <div className="flex justify-between items-center">
                            <a
                                href="https://worldine.vercel.app/"
                                className="text-blue-400 hover:text-blue-300 transition-colors my-4"
                            >
                                View Project →
                            </a>
                        </div>
                    </div>

                    <div
                        className="
              glass p-6 rounded-xl border border-white/10 
              hover:-translate-y-1 hover:border-blue-500/30
              hover:shadow-[0_4px_20px_rgba(59,130,246,0.1)]
              transition-all
            "
                    >
                        <h3 className="text-xl font-bold mb-2">Derm AI</h3>
                        <p className="text-gray-400 mb-4">
                            An AI-powered dermatology chatbot that combines BioBERT-based medical text embeddings with a hybrid retrieval system (FAISS + BM25) to provide accurate and context-aware responses to user queries.
                        </p>
                        <div className="flex flex-wrap gap-2 mb-4">
                            {["Python", "BioBERT", "React", "Python"].map((tech, key) => (
                                <span
                                    key={key}
                                    className="
                      bg-blue-500/10 text-blue-500 py-1 px-3 
                      rounded-full text-sm
                      transition
                      hover:bg-blue-500/20 hover:-translate-y-0.5
                      hover:shadow-[0_2px_8px_rgba(59,130,246,0.2)]
                    "
                                >
                                    {tech}
                                </span>
                            ))}
                        </div>
                        <div className="flex justify-between items-center ">
                            <a
                                href="https://github.com/Sirasudeen/DermAI"
                                className="text-blue-400 hover:text-blue-300 transition-colors my-4"
                            >
                                View Project →
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};