# Timeline Component Structure

This directory contains all components related to the Timeline feature of the Fries Landbouwmuseum application.

## Directory Structure

```
Timeline/
├── Timeline.jsx              # Main timeline component
├── index.js                  # Export file
├── ui/                       # Basic UI components
│   ├── TimelineCard.jsx      # Individual timeline event card
│   ├── ScrollIndicator.jsx   # Scroll indicator for navigation
│   ├── Breadcrumb.jsx        # Breadcrumb navigation
│   └── MiniTimeline.jsx      # Compact timeline view
├── modals/                   # Modal components
│   ├── TimelineModal.jsx     # Legacy modal for timeline events
│   ├── TimelineDetailModal.jsx  # Enhanced modal with rich content
│   └── SlidingDetailPanel.jsx   # Sliding panel for details
├── content/                  # Content display components
│   ├── FunFact.jsx          # Fun fact display
│   ├── LeeuwardenMap.jsx    # Interactive map of Leeuwarden
│   ├── MuseumHeadline.jsx   # Museum headline component
│   └── VirtualGuide.jsx     # Virtual guide mascot
└── examples/                 # Example/demo components
    └── TimelineAnimationExample.jsx  # Animation examples
```

## Component Categories

### Main Component
- **Timeline.jsx** - The main timeline component that orchestrates all child components

### UI Components (`ui/`)
Basic UI building blocks used throughout the timeline:
- Display elements
- Navigation components
- Interactive elements

### Modals (`modals/`)
Modal windows and panels for detailed content display:
- Event detail modals
- Interactive panels
- Popup windows

### Content (`content/`)
Components that display specific content:
- Educational content
- Maps and locations
- Interactive guides

### Examples (`examples/`)
Demo and example components for development reference

## Usage

Import the main Timeline component:
```javascript
import Timeline from './components/Timeline/Timeline'
```

Or import specific subcomponents:
```javascript
import TimelineModal from './components/Timeline/modals/TimelineModal'
import VirtualGuide from './components/Timeline/content/VirtualGuide'
```

## Notes

- All code comments are in English
- Components use Framer Motion for animations
- Styled with Tailwind CSS
- Responsive design for touch interfaces
