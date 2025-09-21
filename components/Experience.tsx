"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Calendar, Building, Award } from "lucide-react";
import { experience } from "@/lib/data";

export default function Experience() {
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  return (
    <section id="experience" className="py-20 bg-gray-50 dark:bg-gray-900" ref={ref}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold mb-4">Professional Experience</h2>
          <p className="text-gray-600 dark:text-gray-400">
            My journey as a Frontend Developer
          </p>
        </motion.div>

        <div className="relative">
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-600 to-purple-600" />

          {experience.map((exp, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className={`relative flex items-center mb-12 ${
                index % 2 === 0 ? "md:justify-start" : "md:justify-end"
              }`}
            >
              <div
                className={`w-full md:w-1/2 ${
                  index % 2 === 0 ? "md:pr-8" : "md:pl-8"
                }`}
              >
                <div
                  className={`bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow ${
                    index % 2 === 0 ? "ml-16 md:ml-0" : "ml-16 md:mr-0"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <Calendar size={16} className="text-gray-500" />
                    <span className="text-sm text-gray-500">{exp.period}</span>
                  </div>

                  <h3 className="text-xl font-bold mb-1 text-gradient">{exp.title}</h3>

                  <div className="flex items-center gap-2 mb-3">
                    <Building size={16} className="text-gray-500" />
                    <span className="text-gray-600 dark:text-gray-400">{exp.company}</span>
                  </div>

                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    {exp.description}
                  </p>

                  <div className="space-y-2">
                    {exp.achievements.map((achievement, i) => (
                      <div
                        key={i}
                        className="flex items-start gap-2"
                      >
                        <Award size={16} className="text-blue-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {achievement}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <motion.div
                initial={{ scale: 0 }}
                animate={inView ? { scale: 1 } : {}}
                transition={{ duration: 0.3, delay: 0.3 + index * 0.2 }}
                className={`absolute w-4 h-4 bg-gradient rounded-full ring-4 ring-white dark:ring-gray-900 ${
                  index % 2 === 0
                    ? "left-8 md:left-[49%] transform md:-translate-x-1/2"
                    : "left-8 md:left-[50%] transform md:-translate-x-1/2"
                }`}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}