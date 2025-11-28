/**
 * Timeline Gallery Configuration
 *
 * This file contains metadata for all timeline event galleries.
 * Images should be placed in: frontend/src/assets/images/timeline/{eventId}/
 *
 * To add images to a gallery:
 * 1. Create a folder with the event ID if it doesn't exist
 * 2. Add your images to that folder
 * 3. Import them at the top of this file
 * 4. Add them to the gallery array for that event
 *
 * Note: You can use the same placeholder image multiple times during development
 */

// Import gallery images - museum-foundation
import eysingahuisImg from '../assets/images/timeline/museum-foundation/Eysingahuis.jpg'
import getContentImg from '../assets/images/timeline/museum-foundation/GetContent.jpg'
import idkImg from '../assets/images/timeline/museum-foundation/idk.jpg'
import skeletonImg from '../assets/images/timeline/museum-foundation/skeleton.jpg'

// Placeholder for when images are added
const placeholderImage = '' // Empty string shows placeholder text

export const timelineGalleries = {
  'museum-foundation': {
    mainImage: eysingahuisImg,
    gallery: [
      {
        id: 1,
        src: eysingahuisImg,
        caption: 'Eysingahuis aan de Turfmarkt',
        description: 'Het Eysingahuis in Leeuwarden, de eerste locatie van het Fries Landbouwmuseum'
      },
      {
        id: 2,
        src: getContentImg,
        caption: 'Historische collectie',
        description: 'Onderdeel van de museumcollectie uit de beginjaren'
      },
      {
        id: 3,
        src: idkImg,
        caption: 'Museum artefact',
        description: 'Historisch object uit de periode rond 1925'
      },
      {
        id: 4,
        src: skeletonImg,
        caption: 'Skelet uit de collectie',
        description: 'Anatomisch specimen uit de vroege museumcollectie'
      },
      {
        id: 5,
        src: placeholderImage,
        caption: 'Nanne Ottema met eerste collectie',
        description: 'Conservator Nanne Ottema tussen de eerste verzameling zuivelwerktuigen'
      },
      {
        id: 6,
        src: placeholderImage,
        caption: 'Eerste museumbezoekers',
        description: 'Bezoekers bestuderen de historische melkproductieapparatuur'
      }
    ],
    video: null, // Add video URL when available
    model3d: null // Add 3D model URL when available
  },

  'eysingahuis-expansion': {
    mainImage: placeholderImage,
    gallery: [
      {
        id: 1,
        src: placeholderImage,
        caption: 'Uitbreiding Eysingahuis',
        description: 'Groeiende collectie in het Eysingahuis'
      },
      {
        id: 2,
        src: placeholderImage,
        caption: 'Stania State in Oentsjerk',
        description: 'De nieuwe locatie biedt meer ruimte voor de collectie'
      },
      {
        id: 3,
        src: placeholderImage,
        caption: 'Landbouwgereedschap jaren 30',
        description: 'Verzameling werktuigen uit de jaren dertig'
      },
      {
        id: 4,
        src: placeholderImage,
        caption: 'Museumopstelling 1930',
        description: 'Impressie van de museumopstelling in 1930'
      }
    ],
    video: null,
    model3d: null
  },

  'postwar-growth': {
    mainImage: placeholderImage,
    gallery: [
      {
        id: 1,
        src: placeholderImage,
        caption: 'Naoorlogse uitbreiding',
        description: 'Het museum groeit snel na de Tweede Wereldoorlog'
      },
      {
        id: 2,
        src: placeholderImage,
        caption: 'Locatie Exmorra',
        description: 'Een van de tijdelijke locaties in Exmorra'
      },
      {
        id: 3,
        src: placeholderImage,
        caption: 'Locatie Achlum',
        description: 'Tijdelijke huisvesting in Achlum'
      },
      {
        id: 4,
        src: placeholderImage,
        caption: 'Educatieve programma\'s',
        description: 'Begin van educatieve activiteiten voor scholen'
      }
    ],
    video: null,
    model3d: null
  },

  'exmorra-restart': {
    mainImage: placeholderImage,
    gallery: [
      {
        id: 1,
        src: placeholderImage,
        caption: 'Heropening Exmorra 1987',
        description: 'Officiële heropening als Fries Landbouwmuseum'
      },
      {
        id: 2,
        src: placeholderImage,
        caption: 'Nieuwe museumopstelling',
        description: 'Professionele presentatie van de collectie'
      },
      {
        id: 3,
        src: placeholderImage,
        caption: 'Provinciale subsidie',
        description: 'Eerste provinciale erkenning en financiering'
      },
      {
        id: 4,
        src: placeholderImage,
        caption: 'Educatief programma',
        description: 'Uitgebreid educatief aanbod voor bezoekers'
      }
    ],
    video: null,
    model3d: null
  },

  'earnewald-professionalization': {
    mainImage: placeholderImage,
    gallery: [
      {
        id: 1,
        src: placeholderImage,
        caption: 'Verhuizing naar Earnewâld',
        description: 'Nieuwe locatie met aanzienlijk meer ruimte'
      },
      {
        id: 2,
        src: placeholderImage,
        caption: 'Samenwerking It Fryske Gea',
        description: 'Begin van vruchtbare samenwerking'
      },
      {
        id: 3,
        src: placeholderImage,
        caption: 'Objecten uit Wageningen',
        description: 'Waardevolle aanvulling op de collectie'
      },
      {
        id: 4,
        src: placeholderImage,
        caption: 'Ús Mem collectie',
        description: 'Integratie van de Ús Mem verzameling'
      }
    ],
    video: null,
    model3d: null
  },

  'leeuwarden-location': {
    mainImage: placeholderImage,
    gallery: [
      {
        id: 1,
        src: placeholderImage,
        caption: 'Monumentale boerderij Leeuwarden',
        description: 'De nieuwe locatie aan de zuidrand van Leeuwarden'
      },
      {
        id: 2,
        src: placeholderImage,
        caption: 'Moderne museumopstelling',
        description: 'Hedendaagse presentatie van het erfgoed'
      },
      {
        id: 3,
        src: placeholderImage,
        caption: 'Dairy Valley samenwerking',
        description: 'Partnerships met kennisinstellingen'
      },
      {
        id: 4,
        src: placeholderImage,
        caption: 'Uitbreiding expositieruimte',
        description: 'Meer ruimte voor permanente en tijdelijke exposities'
      }
    ],
    video: null,
    model3d: null
  },

  'collection-expansion': {
    mainImage: placeholderImage,
    gallery: [
      {
        id: 1,
        src: placeholderImage,
        caption: 'Fokstier Sunny Boy',
        description: 'Icoon van de Nederlandse veeteelt'
      },
      {
        id: 2,
        src: placeholderImage,
        caption: 'Ús Mem collectie integratie',
        description: 'Samenvoeging van waardevolle collecties'
      },
      {
        id: 3,
        src: placeholderImage,
        caption: 'Nationaal Veeteeltmuseum',
        description: 'Objecten uit het Veeteeltmuseum'
      },
      {
        id: 4,
        src: placeholderImage,
        caption: 'Moderne conservering',
        description: 'Professionele conservering en documentatie'
      }
    ],
    video: null,
    model3d: null
  },

  'renewal-jubilee': {
    mainImage: placeholderImage,
    gallery: [
      {
        id: 1,
        src: placeholderImage,
        caption: 'Museumvernieuwing 2023',
        description: 'Grondige modernisering van het museum'
      },
      {
        id: 2,
        src: placeholderImage,
        caption: 'Nieuwe educatieve ruimte',
        description: 'State-of-the-art faciliteiten voor educatie'
      },
      {
        id: 3,
        src: placeholderImage,
        caption: 'Bibliotheek',
        description: 'Nieuwe bibliotheek voor onderzoek en studie'
      },
      {
        id: 4,
        src: placeholderImage,
        caption: 'De Wereld van het Friese Paard',
        description: 'Nieuwe expositie over het Friese paardenras'
      },
      {
        id: 5,
        src: placeholderImage,
        caption: '100-jarig jubileum viering',
        description: 'Viering van een eeuw landbouwgeschiedenis'
      },
      {
        id: 6,
        src: placeholderImage,
        caption: 'Toekomstvisie 2025',
        description: 'Het museum kijkt vooruit naar de toekomst'
      }
    ],
    video: null,
    model3d: null
  },

  'future-exhibitions': {
    mainImage: placeholderImage,
    gallery: [
      {
        id: 1,
        src: placeholderImage,
        caption: 'Internationaal voedselsysteem',
        description: 'Nieuwe expositie over globale voedselproductie'
      },
      {
        id: 2,
        src: placeholderImage,
        caption: 'Universiteitssamenwerkingen',
        description: 'Partnerships met academische instellingen'
      },
      {
        id: 3,
        src: placeholderImage,
        caption: 'Duurzaamheid expositie',
        description: 'Focus op duurzame landbouw en innovatie'
      },
      {
        id: 4,
        src: placeholderImage,
        caption: 'Interactieve installaties',
        description: 'Moderne technologie in het museum'
      }
    ],
    video: null,
    model3d: null
  }
}

/**
 * Get gallery data for a specific timeline event
 * @param {string} eventId - The ID of the timeline event
 * @returns {object} Gallery data including images, video, and 3D model
 */
export const getGalleryData = (eventId) => {
  return timelineGalleries[eventId] || {
    mainImage: placeholderImage,
    gallery: [],
    video: null,
    model3d: null
  }
}

/**
 * Check if an event has gallery images
 * @param {string} eventId - The ID of the timeline event
 * @returns {boolean} True if the event has gallery images
 */
export const hasGallery = (eventId) => {
  const data = timelineGalleries[eventId]
  return data && data.gallery && data.gallery.length > 0
}

/**
 * Check if an event has a video
 * @param {string} eventId - The ID of the timeline event
 * @returns {boolean} True if the event has a video
 */
export const hasVideo = (eventId) => {
  const data = timelineGalleries[eventId]
  return data && data.video !== null
}

/**
 * Check if an event has a 3D model
 * @param {string} eventId - The ID of the timeline event
 * @returns {boolean} True if the event has a 3D model
 */
export const has3DModel = (eventId) => {
  const data = timelineGalleries[eventId]
  return data && data.model3d !== null
}
