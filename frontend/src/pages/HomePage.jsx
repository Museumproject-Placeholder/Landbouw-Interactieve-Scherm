import React from 'react';
import { motion } from 'framer-motion';
import { Timeline } from '../components/Timeline';

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 relative overflow-hidden pt-20">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 right-20 w-96 h-96 bg-gradient-to-br from-cyan-400/10 to-blue-400/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            rotate: [0, 180, 360],
            x: [0, 50, 0],
            y: [0, -30, 0],
          }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute bottom-20 left-20 w-80 h-80 bg-gradient-to-tr from-purple-400/10 to-pink-400/10 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [360, 180, 0],
            x: [0, -30, 0],
            y: [0, 40, 0],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute top-1/2 left-1/3 w-64 h-64 bg-gradient-to-br from-emerald-400/8 to-teal-400/8 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.4, 1],
            rotate: [0, -90, -180],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        />
      </div>

      {/* Main content */}
      <div className="relative">

        {/* Timeline component */}
        <Timeline />

        {/* Bottom info section */}
        <motion.div
          className="container mx-auto px-6 py-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.5 }}
        >
          <div className="backdrop-blur-xl bg-white/10 rounded-3xl p-8 border border-white/20 shadow-2xl">
            <div className="text-center">
              <motion.h2
                className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400 mb-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 1.7 }}
              >
                Interactive Museum Experience
              </motion.h2>

              <motion.p
                className="text-gray-200 mb-8 text-lg max-w-3xl mx-auto"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 1.9 }}
              >
                Touch any period on the timeline to dive deep into that era. Experience immersive content,
                historical artifacts, and engaging multimedia presentations.
              </motion.p>

              <motion.div
                className="grid grid-cols-1 md:grid-cols-3 gap-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 2.1 }}
              >
                <div className="backdrop-blur-sm bg-white/5 rounded-2xl p-6 border border-white/10">
                  <div className="flex items-center justify-center mb-4">
                    <div className="w-4 h-4 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full mr-3 shadow-lg shadow-cyan-400/50"></div>
                    <span className="text-gray-200 font-semibold">Interactive Timeline</span>
                  </div>
                  <p className="text-gray-300 text-sm">Swipe and tap through history</p>
                </div>

                <div className="backdrop-blur-sm bg-white/5 rounded-2xl p-6 border border-white/10">
                  <div className="flex items-center justify-center mb-4">
                    <div className="w-4 h-4 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full mr-3 shadow-lg shadow-emerald-400/50"></div>
                    <span className="text-gray-200 font-semibold">Rich Media Content</span>
                  </div>
                  <p className="text-gray-300 text-sm">Images, videos, and artifacts</p>
                </div>

                <div className="backdrop-blur-sm bg-white/5 rounded-2xl p-6 border border-white/10">
                  <div className="flex items-center justify-center mb-4">
                    <div className="w-4 h-4 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full mr-3 shadow-lg shadow-purple-400/50"></div>
                    <span className="text-gray-200 font-semibold">Historical Context</span>
                  </div>
                  <p className="text-gray-300 text-sm">Deep dive into each era</p>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default HomePage;