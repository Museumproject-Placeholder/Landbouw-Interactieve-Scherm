import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import SlidePuzzle from '../components/PuzzleGame/SlidePuzzle';

const PuzzleGamePage = () => {
  const handleBackToTimeline = () => {
    window.location.href = '/#/';
  };

  return (
    <div className="relative min-h-screen">
      {/* Back Button */}
      <motion.button
        className="fixed top-6 left-6 z-50 flex items-center space-x-2 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white px-4 py-2 rounded-xl border border-white/20 shadow-lg"
        onClick={handleBackToTimeline}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
      >
        <ArrowLeft size={18} />
        <span className="font-medium">Terug naar Timeline</span>
      </motion.button>

      {/* Puzzle Game Component */}
      <SlidePuzzle />
    </div>
  );
};

export default PuzzleGamePage;