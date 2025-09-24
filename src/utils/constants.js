// Time periods for the museum timeline
export const TIME_PERIODS = {
  ANCIENT: {
    id: 'ancient',
    name: 'Ancient Times',
    dateRange: '10,000 - 500 BCE',
    color: '#8B4513'
  },
  CLASSICAL: {
    id: 'classical',
    name: 'Classical Period',
    dateRange: '500 BCE - 500 CE',
    color: '#DAA520'
  },
  MEDIEVAL: {
    id: 'medieval',
    name: 'Medieval Period',
    dateRange: '500 - 1500 CE',
    color: '#228B22'
  },
  RENAISSANCE: {
    id: 'renaissance',
    name: 'Renaissance',
    dateRange: '1300 - 1600 CE',
    color: '#4682B4'
  },
  INDUSTRIAL: {
    id: 'industrial',
    name: 'Industrial Revolution',
    dateRange: '1760 - 1840',
    color: '#DC143C'
  },
  MODERN: {
    id: 'modern',
    name: 'Modern Era',
    dateRange: '1900 - Present',
    color: '#9932CC'
  }
};

// Content block types for the content editor
export const CONTENT_BLOCK_TYPES = {
  TEXT: 'text',
  IMAGE: 'image',
  QUOTE: 'quote',
  LIST: 'list',
  TIMELINE: 'timeline',
  COMPARISON: 'comparison'
};

// Common agricultural themes and tags
export const AGRICULTURAL_THEMES = [
  'tools',
  'crops',
  'livestock',
  'irrigation',
  'mechanization',
  'sustainability',
  'innovation',
  'tradition',
  'harvest',
  'cultivation',
  'breeding',
  'fertilization',
  'pest control',
  'food production',
  'rural life'
];

// Museum display settings
export const DISPLAY_CONFIG = {
  TIMEOUT_DURATION: 300000, // 5 minutes in milliseconds
  TOUCH_SENSITIVITY: 'high',
  ANIMATION_SPEED: 'medium',
  FONT_SIZE: 'large',
  CONTRAST: 'high'
};

// API endpoints
export const API_ENDPOINTS = {
  TIMELINE: '/timeline',
  CONTENT: '/content',
  ADMIN: '/admin',
  UPLOAD: '/upload',
  STATS: '/admin/stats'
};

// Error messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Unable to connect to the server. Please check your connection.',
  NOT_FOUND: 'The requested content could not be found.',
  SERVER_ERROR: 'A server error occurred. Please try again later.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  TIMEOUT_ERROR: 'The request timed out. Please try again.'
};

// Success messages
export const SUCCESS_MESSAGES = {
  CONTENT_SAVED: 'Content has been saved successfully.',
  CONTENT_DELETED: 'Content has been deleted successfully.',
  CONTENT_UPDATED: 'Content has been updated successfully.',
  IMAGE_UPLOADED: 'Image has been uploaded successfully.'
};

// Date formatting options
export const DATE_FORMAT_OPTIONS = {
  LONG: {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  },
  SHORT: {
    year: '2-digit',
    month: 'short',
    day: 'numeric'
  },
  TIME_ONLY: {
    hour: '2-digit',
    minute: '2-digit'
  }
};

// Image size constraints
export const IMAGE_CONFIG = {
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  THUMBNAIL_SIZE: { width: 300, height: 200 },
  HERO_SIZE: { width: 1200, height: 600 }
};

// Responsive breakpoints (matching Tailwind CSS)
export const BREAKPOINTS = {
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
  '2XL': 1536
};

// Color palette for the museum theme
export const COLORS = {
  MUSEUM: {
    BROWN: '#8B4513',
    GOLD: '#FFD700',
    CREAM: '#F5F5DC',
    GREEN: '#228B22'
  },
  PRIMARY: {
    50: '#f0f9ff',
    100: '#e0f2fe',
    200: '#bae6fd',
    300: '#7dd3fc',
    400: '#38bdf8',
    500: '#0ea5e9',
    600: '#0284c7',
    700: '#0369a1',
    800: '#075985',
    900: '#0c4a6e'
  }
};

// Animation configurations
export const ANIMATIONS = {
  FADE_IN: {
    duration: 500,
    easing: 'ease-in-out'
  },
  SLIDE_UP: {
    duration: 600,
    easing: 'ease-out'
  },
  SCALE: {
    duration: 300,
    easing: 'ease-in-out'
  }
};

// Default content structure for new timeline items
export const DEFAULT_CONTENT_STRUCTURE = {
  title: '',
  era: '',
  dateRange: '',
  subtitle: '',
  description: '',
  image: '',
  tags: [],
  blocks: [],
  gallery: []
};