import React from 'react';
import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';

const Header = () => {
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith('/admin');

  return (
    <motion.header
      className="backdrop-blur-xl bg-white/10 border-b border-white/20 fixed top-0 left-0 right-0 z-50 shadow-2xl"
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="container mx-auto px-8">
        <div className="flex items-center justify-between h-24">
          <motion.div
            className="flex items-center"
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Link to="/" className="flex items-center space-x-5">
              <motion.div
                className="w-16 h-16 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-3xl flex items-center justify-center shadow-lg shadow-cyan-400/30"
                whileHover={{
                  scale: 1.1,
                  rotate: 5,
                  boxShadow: "0 0 30px rgba(34, 211, 238, 0.4)"
                }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                <span className="text-white font-bold text-2xl">🌾</span>
              </motion.div>
              <div>
                <motion.h1
                  className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-300"
                  whileHover={{ scale: 1.02 }}
                >
                  Museum Interactive
                </motion.h1>
                <motion.p
                  className="text-sm text-gray-300 font-medium"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  Touch Screen Experience
                </motion.p>
              </div>
            </Link>
          </motion.div>

          <motion.nav
            className="hidden md:flex items-center space-x-4"
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                to="/"
                className={`px-8 py-4 rounded-3xl text-base font-semibold transition-all duration-300 backdrop-blur-sm border-2 min-w-[140px] text-center ${
                  location.pathname === '/'
                    ? 'bg-gradient-to-r from-cyan-400/20 to-blue-400/20 text-cyan-300 border-cyan-400/30 shadow-lg shadow-cyan-400/20'
                    : 'bg-white/5 text-gray-300 hover:text-white hover:bg-white/10 border-white/10 hover:border-white/20'
                }`}
              >
                Timeline
              </Link>
            </motion.div>

            {!isAdminPage && (
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  to="/admin"
                  className="px-8 py-4 bg-white/5 text-gray-300 rounded-3xl text-base font-semibold hover:bg-white/10 hover:text-white transition-all duration-300 backdrop-blur-sm border-2 border-white/10 hover:border-white/20 min-w-[140px] text-center"
                >
                  Admin
                </Link>
              </motion.div>
            )}

            {isAdminPage && (
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  to="/"
                  className="px-8 py-4 bg-gradient-to-r from-purple-400 to-pink-400 text-white rounded-3xl text-base font-semibold hover:from-purple-500 hover:to-pink-500 transition-all duration-300 shadow-lg shadow-purple-400/30 min-w-[140px] text-center"
                >
                  Display
                </Link>
              </motion.div>
            )}
          </motion.nav>

          <motion.div
            className="flex items-center space-x-6"
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="backdrop-blur-sm bg-white/5 px-6 py-3 rounded-2xl border border-white/10">
              <div className="text-base text-gray-300 font-semibold">
                {new Date().toLocaleDateString('en-US', {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric'
                })}
              </div>
            </div>

            <motion.div
              className="flex items-center space-x-3 backdrop-blur-sm bg-white/5 px-4 py-3 rounded-2xl border border-white/10"
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <div className="w-4 h-4 bg-gradient-to-r from-emerald-400 to-green-400 rounded-full shadow-lg shadow-emerald-400/50"></div>
              <span className="text-sm text-gray-300 font-semibold">LIVE</span>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Mobile Navigation - Touch optimized */}
      <motion.div
        className="md:hidden border-t border-white/10 backdrop-blur-sm"
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: "auto" }}
        transition={{ duration: 0.4, delay: 0.6 }}
      >
        <div className="px-8 py-6 space-y-4">
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Link
              to="/"
              className={`block px-6 py-4 rounded-2xl text-base font-semibold transition-all duration-300 text-center ${
                location.pathname === '/'
                  ? 'bg-gradient-to-r from-cyan-400/20 to-blue-400/20 text-cyan-300 border border-cyan-400/30'
                  : 'bg-white/5 text-gray-300 hover:text-white hover:bg-white/10 border border-white/10'
              }`}
            >
              Timeline
            </Link>
          </motion.div>

          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Link
              to="/admin"
              className={`block px-6 py-4 rounded-2xl text-base font-semibold transition-all duration-300 text-center border ${
                isAdminPage
                  ? 'bg-white/10 text-white border-white/20'
                  : 'bg-white/5 text-gray-300 hover:text-white hover:bg-white/10 border-white/10'
              }`}
            >
              Admin Panel
            </Link>
          </motion.div>
        </div>
      </motion.div>
    </motion.header>
  );
};

export default Header;