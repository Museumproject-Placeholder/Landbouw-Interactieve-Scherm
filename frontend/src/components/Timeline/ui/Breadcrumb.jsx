import React from 'react'
import { motion } from 'framer-motion'
import PropTypes from 'prop-types'
import { getTheme } from '../../../config/themes'

const Breadcrumb = ({ items, onNavigate }) => {
  const theme = getTheme()

  return (
    <motion.nav
      className="mb-4"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <ol className="flex items-center gap-2 text-xs lg:text-sm flex-wrap">
        {items.map((item, index) => {
          const isLast = index === items.length - 1
          const isClickable = !isLast && item.onClick

          return (
            <li key={index} className="flex items-center gap-2">
              {/* Breadcrumb Item */}
              {isClickable ? (
                <button
                  onClick={() => item.onClick && item.onClick()}
                  className={`${theme.text.darkSecondary || 'text-slate-400'} ${theme.text.dark ? 'hover:text-amber-700' : 'hover:text-white'} transition-colors hover:underline cursor-pointer flex items-center gap-1`}
                >
                  {item.icon && <span>{item.icon}</span>}
                  <span>{item.label}</span>
                </button>
              ) : (
                <span className={`flex items-center gap-1 ${isLast ? `${theme.text.dark || 'text-white'} font-medium` : `${theme.text.darkSecondary || 'text-slate-500'}`}`}>
                  {item.icon && <span>{item.icon}</span>}
                  <span>{item.label}</span>
                </span>
              )}

              {/* Separator */}
              {!isLast && (
                <span className={`${theme.text.darkSecondary || 'text-slate-600'} select-none opacity-40`}>/</span>
              )}
            </li>
          )
        })}
      </ol>
    </motion.nav>
  )
}

Breadcrumb.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      icon: PropTypes.string,
      onClick: PropTypes.func
    })
  ).isRequired,
  onNavigate: PropTypes.func
}

export default Breadcrumb
