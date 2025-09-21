"use client";

import { motion } from "framer-motion";
import { TypeAnimation } from "react-type-animation";
import { Github, Linkedin, Mail, Download, ChevronDown } from "lucide-react";
import { personalInfo } from "@/lib/data";

export default function Hero() {
  return (
    <section id="home" className="min-h-screen flex items-center justify-center relative">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, type: "spring" }}
            className="w-32 h-32 mx-auto mb-8 relative"
          >
            <div className="w-full h-full rounded-full bg-gradient p-1">
              <div className="w-full h-full rounded-full bg-white dark:bg-gray-900 flex items-center justify-center">
                <span className="text-4xl font-bold text-gradient">
                  {personalInfo.name.split(' ').map(n => n[0]).join('')}
                </span>
              </div>
            </div>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 rounded-full border-2 border-dashed border-blue-300 dark:border-blue-700"
            />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-4"
          >
            Hi, I&apos;m{" "}
            <span className="text-gradient">{personalInfo.name}</span>
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-2xl sm:text-3xl lg:text-4xl text-gray-600 dark:text-gray-400 mb-8"
          >
            <TypeAnimation
              sequence={[
                "Senior Software Engineer (Frontend)",
                2000,
                "React.js & TypeScript Expert",
                2000,
                "Performance Optimization Specialist",
                2000,
                "15-20% Booking Increase Achiever",
                2000,
                "Modern Development Stack Leader",
                2000,
              ]}
              wrapper="span"
              speed={50}
              repeat={Infinity}
            />
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="text-lg text-gray-600 dark:text-gray-400 mb-12 max-w-2xl mx-auto"
          >
            {personalInfo.bio}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="flex flex-wrap justify-center gap-4 mb-12"
          >
            <a
              href={personalInfo.github}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-xl transition-all hover:-translate-y-1"
            >
              <Github size={24} />
            </a>
            <a
              href={personalInfo.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-xl transition-all hover:-translate-y-1"
            >
              <Linkedin size={24} />
            </a>
            <a
              href={`mailto:${personalInfo.email}`}
              className="p-3 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-xl transition-all hover:-translate-y-1"
            >
              <Mail size={24} />
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 max-w-4xl mx-auto"
          >
            <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-xl shadow-md">
              <div className="text-3xl font-bold text-gradient mb-1">4+</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Years Experience</div>
            </div>
            <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-xl shadow-md">
              <div className="text-3xl font-bold text-gradient mb-1">15-20%</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Booking Increase</div>
            </div>
            <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-xl shadow-md">
              <div className="text-3xl font-bold text-gradient mb-1">8+</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Projects Delivered</div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="flex flex-wrap justify-center gap-4"
          >
            <a
              href="#contact"
              className="px-8 py-3 bg-gradient text-white rounded-full font-semibold hover:shadow-xl transition-all hover:-translate-y-1"
            >
              Get In Touch
            </a>
            <a
              href={personalInfo.resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-3 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full font-semibold shadow-md hover:shadow-xl transition-all hover:-translate-y-1 flex items-center gap-2"
            >
              <Download size={20} />
              Download Resume
            </a>
          </motion.div>
        </div>
      </div>

      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <ChevronDown size={32} className="text-gray-400" />
      </motion.div>
    </section>
  );
}