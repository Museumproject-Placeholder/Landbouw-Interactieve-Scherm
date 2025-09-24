/**
 * TimelineModal Component
 *
 * Dit is een modal (pop-up venster) die verschijnt wanneer je op een timeline item klikt.
 * Het laat gedetailleerde informatie zien over een bepaalde periode uit de geschiedenis.
 *
 * Hoe het werkt:
 * - Krijgt 3 properties binnen: isOpen (true/false), onClose (functie om te sluiten), timelineItem (data van de periode)
 * - Als isOpen false is of timelineItem leeg is, toont het niets (return null)
 * - Gebruikt Framer Motion voor mooie animaties (fade in/out, scale effecten)
 * - Heeft twee kolommen: links informatie, rechts media content
 */

import React from "react"
import { motion } from "framer-motion"
import { X, Play, Image, Video, Box } from "lucide-react"

const TimelineModal = ({ isOpen, onClose, timelineItem }) => {
  // Controleer of modal open moet zijn en of er data is
  if (!isOpen || !timelineItem) return null

  return (
    // Achtergrond overlay - bedekt hele scherm met donkere laag
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      initial={{ opacity: 0 }} // Start onzichtbaar
      animate={{ opacity: 1 }} // Fade in naar zichtbaar
      exit={{ opacity: 0 }} // Fade uit naar onzichtbaar
      onClick={onClose} // Klik op achtergrond = sluit modal
    >
      {/* Hoofd modal venster */}
      <motion.div
        className="relative w-full max-w-6xl h-full max-h-[90vh] bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden"
        initial={{ scale: 0.8, opacity: 0 }} // Start klein en onzichtbaar
        animate={{ scale: 1, opacity: 1 }} // Groei naar volle grootte
        exit={{ scale: 0.8, opacity: 0 }} // Krimp terug bij sluiten
        onClick={e => e.stopPropagation()} // Voorkom sluiten bij klik op modal zelf
      >
        {/* Sluit knop - rode X rechts bovenin */}
        <motion.button
          className="absolute top-6 right-6 z-10 w-12 h-12 bg-red-500/90 hover:bg-red-600 rounded-full flex items-center justify-center text-white shadow-lg"
          whileHover={{ scale: 1.1 }} // Wordt groter bij hover
          whileTap={{ scale: 0.9 }} // Wordt kleiner bij klik
          onClick={onClose} // Sluit modal bij klik
        >
          <X size={24} />
        </motion.button>

        {/* Scrollbare content container */}
        <div className="h-full overflow-y-auto">
          {/* Grid layout: 1 kolom op mobiel, 2 kolommen op grote schermen */}
          <div className="p-8 grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
            {/* LINKER KOLOM: Informatie sectie */}
            <div className="flex flex-col space-y-6">
              <div className="bg-slate-700/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-600/30">
                {/* Sectie header met icoon */}
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-6 h-6 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-lg flex items-center justify-center">
                    <span className="text-white text-sm">📖</span>
                  </div>
                  <h2 className="text-2xl font-bold text-white">Information</h2>
                </div>

                {/* Content box met titel, beschrijving en knoppen */}
                <div className="bg-slate-800/60 rounded-xl p-6">
                  {/* Titel van de gekozen periode */}
                  <h3 className="text-xl font-semibold text-cyan-300 mb-4">
                    {timelineItem.title}
                  </h3>

                  {/* Beschrijving tekst - komt uit timelineItem data */}
                  <p className="text-gray-300 leading-relaxed mb-6">
                    {timelineItem.description ||
                      "Informative text about this period will be displayed here. This section provides detailed information about the historical context, significance, and key developments of this era."}
                  </p>

                  {/* Knop voor audio guide (nog geen functionaliteit) */}
                  <div className="flex space-x-4">
                    <motion.button
                      className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-cyan-600 transition-all duration-300"
                      whileHover={{ scale: 1.05 }} // Wordt groter bij hover
                      whileTap={{ scale: 0.95 }} // Wordt kleiner bij klik
                    >
                      <Play size={18} />
                      <span>Audio Guide</span>
                    </motion.button>
                  </div>
                </div>
              </div>
            </div>

            {/* RECHTER KOLOM: Media sectie */}
            <div className="flex flex-col space-y-6">
              <div className="bg-slate-700/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-600/30">
                {/* Media sectie header */}
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-6 h-6 bg-gradient-to-r from-purple-400 to-pink-400 rounded-lg flex items-center justify-center">
                    <span className="text-white text-sm">📱</span>
                  </div>
                  <h2 className="text-2xl font-bold text-white">Media</h2>
                </div>

                {/* Media weergave gebied - hier komen foto's, video's, 3D modellen */}
                <div className="bg-slate-800/60 rounded-xl p-6 mb-6">
                  {/* Placeholder voor media content - 16:9 aspect ratio */}
                  <div className="aspect-video bg-gradient-to-br from-slate-600 to-slate-700 rounded-lg flex items-center justify-center border-2 border-dashed border-slate-500">
                    <div className="text-center text-gray-400">
                      <div className="w-16 h-16 bg-slate-600 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Image size={32} />
                      </div>
                      <p className="font-medium">
                        Media content will be displayed here
                      </p>
                      <p className="text-sm">Image, Video, or 3D Model</p>
                    </div>
                  </div>
                </div>

                {/* Media knoppen - 3 knoppen in een rij */}
                <div className="grid grid-cols-3 gap-3">
                  {/* 3D Model knop (groen) */}
                  <motion.button
                    className="flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-semibold hover:from-green-600 hover:to-emerald-600 transition-all duration-300"
                    whileHover={{ scale: 1.05 }} // Groter bij hover
                    whileTap={{ scale: 0.95 }} // Kleiner bij klik
                  >
                    <Box size={18} />
                    <span className="hidden sm:inline">3D Model</span>
                  </motion.button>

                  {/* Gallery knop (oranje/rood) */}
                  <motion.button
                    className="flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-semibold hover:from-orange-600 hover:to-red-600 transition-all duration-300"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Image size={18} />
                    <span className="hidden sm:inline">Gallery</span>
                  </motion.button>

                  {/* Video knop (paars) */}
                  <motion.button
                    className="flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-xl font-semibold hover:from-purple-600 hover:to-indigo-600 transition-all duration-300"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Video size={18} />
                    <span className="hidden sm:inline">Video</span>
                  </motion.button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

/**
 * Hoe je deze component gebruikt:
 *
 * 1. Import: import TimelineModal from './TimelineModal'
 *
 * 2. State in parent component:
 *    const [isModalOpen, setIsModalOpen] = useState(false)
 *    const [selectedItem, setSelectedItem] = useState(null)
 *
 * 3. Open modal:
 *    setSelectedItem(timelineItemData)
 *    setIsModalOpen(true)
 *
 * 4. In JSX:
 *    <TimelineModal
 *      isOpen={isModalOpen}
 *      onClose={() => setIsModalOpen(false)}
 *      timelineItem={selectedItem}
 *    />
 *
 * LET OP: Alle knoppen hebben nog geen functionaliteit!
 * Deze moeten nog worden aangesloten op echte media content.
 */

export default TimelineModal
