"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Code, Zap, Users, Award, TrendingUp, Cpu } from "lucide-react";

export default function About() {
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  const highlights = [
    {
      icon: TrendingUp,
      title: "Business Impact",
      description: "Delivered 15-20% increase in bookings and 12-16% boost in user satisfaction"
    },
    {
      icon: Code,
      title: "Modern Tech Stack",
      description: "Expert in React 18, TypeScript, Redux Toolkit, and cutting-edge development tools"
    },
    {
      icon: Zap,
      title: "Performance Leader",
      description: "Modernized legacy codebases and optimized application performance significantly"
    },
    {
      icon: Cpu,
      title: "AI-Assisted Development",
      description: "Leverages Cursor IDE and Claude Code AI for accelerated development workflows"
    },
    {
      icon: Users,
      title: "Team Collaboration",
      description: "Effective team communication using Slack, Zoho Email, and project management with ClickUp"
    },
    {
      icon: Award,
      title: "Enterprise Experience",
      description: "Led development for Hotel, Operations, and B2C Pods at scale"
    }
  ];

  return (
    <section id="about" className="py-20" ref={ref}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold mb-6">Professional Summary</h2>
          <div className="max-w-4xl mx-auto">
            <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed mb-8">
              Frontend Developer with <span className="font-semibold text-gradient">4 years of experience</span> building
              scalable, high-performance applications using <span className="font-semibold">React.js, JavaScript, and TypeScript</span>.
              Contributed to platforms like <span className="font-semibold">Travelplusapp.com, Fabhotels.com</span>, and
              <span className="font-semibold"> 8+ internal projects</span>, with expertise in UI development,
              performance optimization, and API integration.
            </p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/10 dark:to-purple-900/10 p-6 rounded-xl"
            >
              <p className="text-lg font-medium text-gray-700 dark:text-gray-300">
                🚀 <span className="font-semibold">Key Achievement:</span> Led modernization of legacy React 16 + Redux-Thunk codebase
                to React 18 with TypeScript, Redux Toolkit, and Redux-Saga, delivering measurable business impact
                through scalable architectures and responsive UI implementations.
              </p>
            </motion.div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {highlights.map((highlight, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
              whileHover={{ y: -5 }}
              className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 bg-gradient rounded-lg">
                  <highlight.icon size={24} className="text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">{highlight.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                    {highlight.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-12 text-center"
        >
          <div className="inline-flex items-center gap-2 px-8 py-4 bg-white dark:bg-gray-800 rounded-full shadow-lg">
            <Code size={20} className="text-blue-600" />
            <span className="font-semibold text-lg">
              Specialized in Enterprise React Applications & Performance Optimization
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}