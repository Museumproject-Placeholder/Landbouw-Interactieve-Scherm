import React from 'react'
import { motion } from 'framer-motion'
import PropTypes from 'prop-types'

const FunFact = ({ fact }) => {
  return (
    <motion.div
      className="mt-6 mb-4 p-4 bg-slate-700/50 rounded-lg border-l-4 border-orange-500 flex gap-3"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.5, duration: 0.4 }}
    >
      {/* Icon */}
      <div className="text-2xl flex-shrink-0">💡</div>

      {/* Content */}
      <div className="flex-1">
        <h4 className="text-sm font-bold text-orange-400 mb-1">Wist je dat?</h4>
        <p className="text-xs lg:text-sm text-slate-300 leading-relaxed">
          {fact}
        </p>
      </div>
    </motion.div>
  )
}

FunFact.propTypes = {
  fact: PropTypes.string.isRequired
}

export default FunFact
