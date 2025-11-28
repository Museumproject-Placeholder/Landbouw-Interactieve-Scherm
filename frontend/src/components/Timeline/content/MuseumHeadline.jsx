import React from "react"
import { motion } from "framer-motion"
import { getTheme } from "../../../config/themes"

const MuseumHeadline = ({
  text = "100 jaar geschiedenis",
  subtext = "Fries Landbouwmuseum",
}) => {
  const theme = getTheme()

  return (
    <div className="relative mx-auto max-w-7xl px-4 pt-8 pb-3 sm:pt-10 sm:pb-4 md:pt-12 md:pb-5 overflow-visible">
      <div className="pointer-events-none absolute inset-x-0 -top-6 mx-auto h-32 w-[80%] rounded-full bg-gradient-to-r from-cyan-400/15 via-blue-500/15 to-purple-500/15 blur-2xl" />

      <motion.h1
        initial={{ opacity: 0, scale: 0.96, filter: "blur(8px)" }}
        animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
        transition={{
          duration: 0.9,
          ease: "easeOut",
          type: "spring",
          stiffness: 320,
        }}
        whileHover={{
          scale: 1.04,
          textShadow: "0 8px 32px #a5f3fc88",
          transition: { duration: 0.25 },
        }}
        className={[
          "text-center font-extrabold leading-tight tracking-tight select-none font-heading",
          `bg-gradient-to-r ${theme.text.gradient} bg-clip-text text-transparent`,
          "drop-shadow-[0_6px_24px_rgba(56,189,248,0.25)]",
          "pb-1",
        ].join(" ")}
        style={{ fontSize: "7.5rem" }}
      >
        {text}
      </motion.h1>

      {subtext && (
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6, ease: "easeOut" }}
          className={`mt-4 text-center text-sm sm:text-base font-medium font-body ${theme.text.secondary}`}
        >
          {subtext}
        </motion.p>
      )}
    </div>
  )
}

export default MuseumHeadline
