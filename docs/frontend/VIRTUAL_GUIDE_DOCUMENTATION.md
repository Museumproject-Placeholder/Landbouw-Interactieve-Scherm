# Virtual Guide Component Documentation

## Overview

The `VirtualGuide` component is a friendly mascot/avatar that helps guide users through your interactive timeline application. It features animated speech bubbles, clickable interactions, and responsive design optimized for large touchscreens and mobile devices.

---

## Features

✨ **Animated Avatar** - Waving hand emoji with pulsing glow effects
💬 **Speech Bubbles** - Expandable messages with smooth animations
🎯 **Clickable Interactions** - Tap to cycle through multiple messages
📱 **Fully Responsive** - Scales perfectly for touchscreens and mobile
🎨 **Styled with Tailwind CSS** - Easy to customize colors and styling
⭐ **Floating Sparkles** - Decorative animated elements for visual appeal

---

## Basic Usage

### Import the Component

```jsx
import VirtualGuide from "./components/Timeline/VirtualGuide"
```

### Add to Your Component

```jsx
<VirtualGuide
  messages={[
    "Tik op een tijdperk om meer te weten te komen!",
    "Veeg naar links of rechts om door de geschiedenis te bladeren!",
    "Ontdek 100 jaar Fries Landbouwmuseum!"
  ]}
  position="top-right"
/>
```

---

## Props

### `messages` (Array of Strings)
**Default:** `["Tik op een tijdperk om meer te weten te komen!", "Veeg naar links of rechts...", "Klik op mij voor tips!"]`

An array of messages that the guide will display. Users can click the avatar to cycle through these messages.

**Example:**
```jsx
messages={[
  "Welcome to the timeline!",
  "Swipe left or right to explore",
  "Click on any card for details"
]}
```

### `position` (String)
**Default:** `"top-right"`
**Options:** `"top-left"`, `"top-right"`, `"bottom-left"`, `"bottom-right"`

Controls where the virtual guide appears on screen.

**Example:**
```jsx
position="top-left"  // Guide appears in top-left corner
```

---

## Component Structure

### 1. Avatar Button
- Circular button with gradient border (cyan → blue → purple)
- Waving hand emoji (👋) that animates when clicked
- Pulsing glow effect
- Badge indicator showing number of messages when collapsed

### 2. Speech Bubble
- Appears next to avatar based on position
- Contains the current message text
- Dot indicators showing which message is active (if multiple messages)
- Tail/pointer pointing toward avatar
- Sparkle emoji (✨) with rotating animation

### 3. Decorative Effects
- Floating star emojis (⭐) around the avatar
- Pulse rings emanating from avatar
- Smooth entrance/exit animations

---

## Animations

### On Page Load
- Avatar fades in with glow effect
- Speech bubble slides in from the side
- Sparkles begin floating animation

### On Click/Tap
- Avatar waves (rotates left and right)
- Speech bubble scales and transitions to next message
- Message dot indicators slide to next position

### Continuous
- Pulsing glow around avatar (2s cycle)
- Floating sparkles moving up and down
- Rotating sparkle on speech bubble

---

## Customization Guide

### Change Avatar Emoji

In [VirtualGuide.jsx](frontend/src/components/Timeline/VirtualGuide.jsx), line 103-109:

```jsx
<motion.div className="text-3xl sm:text-4xl">
  👋  // Change this to any emoji: 🌾 🐄 🚜 👨‍🌾 🏛️
</motion.div>
```

**Popular alternatives:**
- `🌾` - Wheat/grain (agriculture theme)
- `🐄` - Cow (farming theme)
- `🚜` - Tractor
- `👨‍🌾` - Farmer
- `🏛️` - Museum building

### Change Colors

The component uses a cyan → blue → purple gradient. To customize:

**Avatar border gradient** (line 92):
```jsx
className="... from-cyan-400 via-blue-500 to-purple-500 ..."
// Change to: from-green-400 via-emerald-500 to-teal-500
```

**Speech bubble border** (line 70):
```jsx
className="... border-2 border-cyan-300 ..."
// Change to: border-2 border-green-300
```

**Glow effects** (lines 95-101):
```jsx
boxShadow: [
  "0 0 20px rgba(6, 182, 212, 0.5)",   // Cyan
  "0 0 30px rgba(59, 130, 246, 0.7)",  // Blue
]
// Change to green: rgba(16, 185, 129, 0.5)
```

### Adjust Size

**Avatar size** (line 89):
```jsx
className="... w-16 h-16 sm:w-20 sm:h-20 ..."
// Larger: w-20 h-20 sm:w-24 sm:h-24
// Smaller: w-12 h-12 sm:w-16 sm:h-16
```

**Emoji size** (line 103):
```jsx
className="text-3xl sm:text-4xl"
// Larger: text-4xl sm:text-5xl
// Smaller: text-2xl sm:text-3xl
```

### Change Position Offset

In [VirtualGuide.jsx](frontend/src/components/Timeline/VirtualGuide.jsx), lines 29-34:

```jsx
const positionClasses = {
  "top-left": "top-4 left-4 sm:top-6 sm:left-6",
  "top-right": "top-4 right-4 sm:top-6 sm:right-6",
  // Increase numbers for more space from edges
  // "top-right": "top-8 right-8 sm:top-12 sm:right-12"
}
```

### Modify Animation Speed

**Wave animation** (lines 103-109):
```jsx
transition={{
  duration: 0.6,  // Make faster: 0.3, slower: 1.0
}}
```

**Speech bubble entrance** (lines 59-65):
```jsx
transition={{
  type: "spring",
  stiffness: 300,  // Higher = snappier (try 500)
  damping: 25,     // Lower = more bounce (try 15)
}
```

### Add Multiple Avatars

You can add multiple guides in different positions:

```jsx
<VirtualGuide
  messages={["Main guide messages..."]}
  position="top-right"
/>

<VirtualGuide
  messages={["Secondary guide messages..."]}
  position="bottom-left"
/>
```

---

## Responsive Behavior

### Mobile Devices (< 640px)
- Avatar: 16×16 (4rem)
- Emoji: text-3xl
- Speech bubble: max-width 90vw
- Padding: 4 (1rem) from edges

### Tablets & Desktops (≥ 640px)
- Avatar: 20×20 (5rem)
- Emoji: text-4xl
- Speech bubble: max-width 448px (28rem)
- Padding: 6 (1.5rem) from edges

### Large Touchscreens
The component scales proportionally and remains easily tappable with large touch targets.

---

## Accessibility

The component includes:
- `aria-label="Virtual guide mascot"` on the button
- Semantic HTML structure
- High contrast text (white on colored backgrounds)
- Large touch targets (minimum 16×16 / 64px × 64px)
- Keyboard navigation support (clickable button)

To improve further, you can add:

```jsx
<button
  aria-expanded={isExpanded}
  aria-controls="guide-message"
  // ...
>
```

---

## Integration with Timeline

The VirtualGuide is integrated in [Timeline.jsx](frontend/src/components/Timeline/Timeline.jsx):

```jsx
{/* Virtual Guide Mascot */}
<VirtualGuide
  messages={[
    "Tik op een tijdperk om meer te weten te komen!",
    "Veeg naar links of rechts om door de geschiedenis te bladeren!",
    "Ontdek 100 jaar Fries Landbouwmuseum!"
  ]}
  position="top-right"
/>
```

It appears above the headline and below the background layers with `z-50` to ensure it's always visible.

---

## Advanced Customization Examples

### Example 1: Agricultural Theme

```jsx
// Change to tractor emoji with green colors
<VirtualGuide
  messages={[
    "🚜 Welkom bij het landbouwmuseum!",
    "Ontdek de geschiedenis van Friese landbouw",
    "Klik op de tijdlijn kaarten voor meer info"
  ]}
  position="top-left"
/>
```

Then in VirtualGuide.jsx, change the avatar to:
```jsx
<motion.div className="text-3xl sm:text-4xl">
  🚜
</motion.div>
```

And update colors to green:
```jsx
className="... from-green-400 via-emerald-500 to-teal-500 ..."
```

### Example 2: Museum Curator Character

Use a person emoji to represent a museum guide:

```jsx
<motion.div className="text-3xl sm:text-4xl">
  👨‍🏫  // or 👩‍🏫 for female curator
</motion.div>
```

### Example 3: Auto-Dismiss After Viewing

Add state management to hide after user interacts:

```jsx
const [hasInteracted, setHasInteracted] = useState(false)

// In Timeline.jsx
{!hasInteracted && (
  <VirtualGuide
    messages={["First time? Click here for a tour!"]}
    position="top-right"
  />
)}

// Hide after first timeline card click
const handleCardClick = (periodId) => {
  setHasInteracted(true)
  // ... rest of logic
}
```

---

## Performance Considerations

- Uses Framer Motion for GPU-accelerated animations
- Animations run at 60fps on modern devices
- Minimal re-renders (only on click/expand state changes)
- No heavy computations or API calls
- Images use emojis (built-in, no loading required)

---

## Browser Compatibility

- ✅ Chrome/Edge (modern versions)
- ✅ Firefox (modern versions)
- ✅ Safari (iOS 14+, macOS 11+)
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

Requires:
- CSS Grid/Flexbox support
- CSS transforms
- Modern JavaScript (ES6+)
- Framer Motion library

---

## Troubleshooting

### Guide Not Showing
- Check that VirtualGuide is imported correctly
- Ensure it's placed within a positioned container
- Verify z-index is high enough (z-50 by default)

### Animations Not Working
- Confirm Framer Motion is installed: `npm install framer-motion`
- Check browser console for errors
- Ensure AnimatePresence wraps conditional rendering

### Speech Bubble Cut Off
- Reduce max-width in position calculations
- Adjust padding/margin values
- Check parent container overflow settings

### Touch Not Working on Mobile
- Ensure button element is used (not div)
- Check touch-action CSS property
- Verify minimum touch target size (48px recommended)

---

## Future Enhancements

Possible additions:
- 🎤 Text-to-speech for messages
- 🌍 Multi-language support
- 🎨 Custom avatar images (not just emojis)
- 🔔 Sound effects on interactions
- 📊 Analytics tracking for user engagement
- ⏱️ Auto-cycle through messages
- 🎯 Context-aware messages based on scroll position

---

## Credits

Built with:
- [React](https://react.dev/)
- [Framer Motion](https://www.framer.com/motion/)
- [Tailwind CSS](https://tailwindcss.com/)

Created for the Fries Landbouwmuseum Interactive Timeline exhibit.

---

## License

Part of the Landbouw-Interactieve-Scherm project.
