
export const About = () => {
    const frontendSkills = [
        "React",
        "gsap",
        "JavaScript",
        "TailwindCSS",
        "SCSS",
    ];

    const backendSkills = ["Node.js", "Python", "AWS", "MongoDB", "SQL"];

    return (
        <section
            id="about"
            className="min-h-screen flex items-center justify-center py-20"
        >
            <div className="max-w-3xl mx-auto px-4">
                <h2 className="text-3xl font-bold mb-8 bg-gradient-to-r from-blue-500 to-cyan-400 bg-clip-text text-transparent text-center">
                    {" "}
                    About Me
                </h2>

                <div className="rounded-xl p-8 border-white/10 border hover:-translate-y-1 transition-all">
                    <p className="text-gray-300 mb-6">
                        Dedicated full-stack developer with experience in React, Flask, and the MERN stack. I enjoy creating smooth, user-friendly applications and finding smart solutions to technical challenges.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="rounded-xl p-6 hover:-translate-y-1 transition-all">
                            <h3 className="text-xl font-bold mb-4"> Frontend</h3>
                            <div className="flex flex-wrap gap-2">
                                {frontendSkills.map((tech, key) => (
                                    <span
                                        key={key}
                                        className="bg-blue-500/10 text-blue-500 py-1 px-3 rounded-full text-sm hover:bg-blue-500/20 
                                    hover:shadow-[0_2px_8px_rgba(59,130,246,0.2)] transition
                    "
                                    >
                                        {tech}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div className="rounded-xl p-6 hover:-translate-y-1 transition-all">
                            <h3 className="text-xl font-bold mb-4"> Backend</h3>
                            <div className="flex flex-wrap gap-2">
                                {backendSkills.map((tech, key) => (
                                    <span
                                        key={key}
                                        className="bg-blue-500/10 text-blue-500 py-1 px-3 rounded-full text-sm hover:bg-blue-500/20 
                                    hover:shadow-[0_2px_8px_rgba(59,130,2246,0.2)] transition
                    "
                                    >
                                        {tech}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                    <div className="p-6 rounded-xl border-white/10 border hover:-translate-y-1 transition-all">
                        <h3 className="text-xl font-bold mb-4"> 🏫 Education </h3>
                        <ul className="list-disc list-inside text-gray-300 space-y-2">
                            <li>
                                <strong> B.Tech. in Computer Science and Engineering </strong> - B.S.A. Crescent University
                                (2021-2025)
                            </li>
                            <li>
                                Relevant Coursework: Data Structures, Networking, Web Development, Cloud
                                Computing...
                            </li>
                        </ul>
                    </div>
                    <div className="p-6 rounded-xl border-white/10 border hover:-translate-y-1 transition-all">
                        <h3 className="text-xl font-bold mb-4"> 💼 Work Experience </h3>
                        <div className="space-y-4 text-gray-300">
                            <div>
                                <h4 className="font-semibold">
                                    {" "}
                                    Gen AI Intern (2024 Jul){" "}
                                </h4>
                                <p>
                                    Explored and implemented Retrieval-Augmented Generation (RAG) techniques to enhance AI-driven
                                    solutions, leveraging tools such as OpenAI APIs, LangChain, and advanced NLP frameworks.
                                </p>
                            </div>

                            <div>
                                <h4 className="font-semibold">
                                    {" "}
                                    Frontend Intern at AICTE (2024 Jun){" "}
                                </h4>
                                <p>
                                    Developed and maintained responsive web interfaces using React.js and Material-UI, ensuring accessi
                                    bility and performance across devices.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};