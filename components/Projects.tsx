"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { ExternalLink, ChevronRight, X } from "lucide-react";
import { projects } from "@/lib/data";

export default function Projects() {
  const [filter, setFilter] = useState("all");
  const [selectedProject, setSelectedProject] = useState<typeof projects[0] | null>(null);
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  const filteredProjects = projects.filter((project) => {
    if (filter === "all") return true;
    return project.category === filter;
  });

  return (
    <section id="projects" className="py-20" ref={ref}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold mb-4">Projects Portfolio</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Showcasing my work and contributions
          </p>

          <div className="overflow-x-auto pb-2">
            <div className="flex gap-4 min-w-max px-4 md:justify-center md:px-0">
              {["all", "own", "contribution"].map((category) => (
                <button
                  key={category}
                  onClick={() => setFilter(category)}
                  className={`px-6 py-2 rounded-full font-medium transition-all ${filter === category
                      ? "bg-gradient text-white"
                      : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                    }`}
                >
                  {category === "all"
                    ? "All Projects"
                    : category === "own"
                      ? "My Projects"
                      : "Contributions"}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          <motion.div
            key={filter}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 50 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -10 }}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden cursor-pointer group"
                onClick={() => setSelectedProject(project)}
              >
                <div className="h-48 bg-gradient-to-br from-blue-400 to-purple-600 relative overflow-hidden">
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-white text-6xl font-bold opacity-20">
                      {project.id}
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">{project.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                    {project.description}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.technologies.slice(0, 3).map((tech) => (
                      <span
                        key={tech}
                        className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-xs"
                      >
                        {tech}
                      </span>
                    ))}
                    {project.technologies.length > 3 && (
                      <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-xs">
                        +{project.technologies.length - 3}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex gap-3">
                      {project.liveUrl && (
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2 text-sm font-medium"
                        >
                          <ExternalLink size={16} />
                          Live Site
                        </a>
                      )}
                    </div>
                    <ChevronRight
                      size={20}
                      className="text-gray-400 group-hover:text-blue-500 transition-colors"
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        <AnimatePresence>
          {selectedProject && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 z-50 md:flex md:items-center md:justify-center md:p-4"
                onClick={() => setSelectedProject(null)}
              >
                {/* Modal content */}
                <motion.div
                  initial={{ y: "100%", opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: "100%", opacity: 0 }}
                  transition={{
                    duration: 0.3,
                    ease: "easeOut"
                  }}
                  className="fixed inset-x-0 bottom-0 z-50 bg-white dark:bg-gray-800
                            rounded-t-2xl max-h-[70vh] overflow-hidden flex flex-col
                            md:relative md:inset-auto md:rounded-xl md:max-w-3xl md:max-h-[90vh] md:w-full"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Mobile drag handle */}
                  <div
                    className="md:hidden flex justify-center py-3 cursor-pointer"
                    onClick={() => setSelectedProject(null)}
                  >
                    <div className="w-12 h-1 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
                  </div>

                  {/* Close button */}
                  <div className="absolute top-4 right-4 z-10">
                    <button
                      onClick={() => setSelectedProject(null)}
                      className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                    >
                      <X size={20} className="text-gray-600 dark:text-gray-400" />
                    </button>
                  </div>

                  <div className="flex-1 overflow-y-auto">
                    <div className="p-6 md:p-8">
                      <h3 className="text-3xl font-bold mb-4">{selectedProject.title}</h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-6">
                        {selectedProject.longDescription}
                      </p>

                      <h4 className="font-semibold mb-3">Key Features:</h4>
                      <ul className="list-disc list-inside mb-6 space-y-1 text-gray-600 dark:text-gray-400">
                        {selectedProject.features.map((feature) => (
                          <li key={feature}>{feature}</li>
                        ))}
                      </ul>

                      <h4 className="font-semibold mb-3">Technologies Used:</h4>
                      <div className="flex flex-wrap gap-2 mb-6">
                        {selectedProject.technologies.map((tech) => (
                          <span
                            key={tech}
                            className="px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-full"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>

                      <div className="flex gap-4">
                        {selectedProject.liveUrl && (
                          <a
                            href={selectedProject.liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-6 py-3 bg-gradient text-white rounded-lg hover:shadow-lg transition-shadow"
                          >
                            <ExternalLink size={20} />
                            Visit Live Website
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}