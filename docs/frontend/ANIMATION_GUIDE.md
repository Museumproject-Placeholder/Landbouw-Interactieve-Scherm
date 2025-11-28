# 🎬 Framer Motion Timeline Animation Guide

Complete guide for implementing modern, dynamic animations in your React timeline using Framer Motion and Tailwind CSS.

---

## 📋 Table of Contents

1. [Quick Start](#quick-start)
2. [Core Animation Concepts](#core-animation-concepts)
3. [Entry Animations](#entry-animations)
4. [Staggered Animations](#staggered-animations)
5. [Exit Animations](#exit-animations)
6. [Interactive Animations](#interactive-animations)
7. [Touch Support](#touch-support)
8. [Performance Tips](#performance-tips)
9. [Real Examples](#real-examples)

---

## 🚀 Quick Start

### Installation

```bash
npm install framer-motion
```

### Basic Setup

```jsx
import { motion, AnimatePresence } from "framer-motion"

const TimelineCard = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <h3>Timeline Card</h3>
    </motion.div>
  )
}
```

---

## 🎨 Core Animation Concepts

### 1. Motion Components

Replace HTML elements with `motion.*` components:

```jsx
// Standard HTML
<div className="card">Content</div>

// Motion-enabled
<motion.div className="card">Content</motion.div>
```

### 2. Animation States

- **initial**: Starting state when component mounts
- **animate**: Target state to transition to
- **exit**: State when component unmounts
- **whileHover**: State during mouse hover
- **whileTap**: State during click/tap

```jsx
<motion.div
  initial={{ scale: 0 }}
  animate={{ scale: 1 }}
  exit={{ scale: 0 }}
  whileHover={{ scale: 1.1 }}
  whileTap={{ scale: 0.95 }}
/>
```

### 3. Transition Options

Control how animations move between states:

```jsx
<motion.div
  animate={{ x: 100 }}
  transition={{
    duration: 0.5,        // How long (seconds)
    delay: 0.2,           // Wait before starting
    ease: "easeInOut",    // Easing function
    type: "spring",       // Use spring physics
    stiffness: 100,       // Spring stiffness
    damping: 10,          // Spring damping
  }}
/>
```

---

## 🌟 Entry Animations

### Fade In + Slide Up

Most common entry animation:

```jsx
const cardVariants = {
  hidden: {
    opacity: 0,
    y: 100,        // Start 100px below
    scale: 0.8     // Start smaller
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.8,
      ease: "easeOut"
    }
  }
}

<motion.div
  variants={cardVariants}
  initial="hidden"
  animate="visible"
>
  Card Content
</motion.div>
```

### Spring Animation (Bouncy)

More playful, natural movement:

```jsx
<motion.div
  initial={{ opacity: 0, y: 100 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{
    type: "spring",
    stiffness: 100,  // Higher = snappier
    damping: 15,     // Higher = less bounce
    mass: 1          // Higher = heavier feel
  }}
/>
```

### Rotation Entry

Cards that spin in:

```jsx
<motion.div
  initial={{ opacity: 0, scale: 0, rotate: -180 }}
  animate={{ opacity: 1, scale: 1, rotate: 0 }}
  transition={{ duration: 0.6 }}
/>
```

### 3D Perspective Entry

Cards that flip in:

```jsx
<motion.div
  initial={{ opacity: 0, rotateX: -90, z: -100 }}
  animate={{ opacity: 1, rotateX: 0, z: 0 }}
  style={{ transformPerspective: 1000 }}
  transition={{ duration: 0.8 }}
/>
```

---

## 🎯 Staggered Animations

Make cards appear one after another with delays.

### Method 1: Manual Delays

```jsx
{timelineData.map((item, index) => (
  <motion.div
    key={item.id}
    initial={{ opacity: 0, y: 100 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{
      duration: 0.6,
      delay: index * 0.15  // Each card 0.15s after previous
    }}
  >
    {item.title}
  </motion.div>
))}
```

### Method 2: Container Variants (Recommended)

Cleaner approach using parent-child relationship:

```jsx
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,    // Delay between children
      delayChildren: 0.2,       // Wait before starting
      when: "beforeChildren"    // Animate container first
    }
  }
}

const cardVariants = {
  hidden: { opacity: 0, y: 100 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6 }
  }
}

// Parent container
<motion.div
  variants={containerVariants}
  initial="hidden"
  animate="visible"
>
  {/* Children automatically stagger */}
  {timelineData.map(item => (
    <motion.div
      key={item.id}
      variants={cardVariants}
    >
      {item.title}
    </motion.div>
  ))}
</motion.div>
```

### Method 3: Scroll-Triggered Stagger

Animate as user scrolls:

```jsx
import { useInView } from "framer-motion"
import { useRef } from "react"

const TimelineCard = ({ item, index }) => {
  const ref = useRef(null)
  const isInView = useInView(ref, {
    once: true,      // Animate only once
    amount: 0.3      // Trigger when 30% visible
  })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 100 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 100 }}
      transition={{ delay: index * 0.1 }}
    >
      {item.title}
    </motion.div>
  )
}
```

---

## 🚪 Exit Animations

Smooth animations when elements leave.

### Basic Exit

```jsx
<AnimatePresence>
  {showCard && (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8, y: -50 }}
      transition={{ duration: 0.4 }}
    >
      Card Content
    </motion.div>
  )}
</AnimatePresence>
```

### Fade Out Selected Cards

When another card is selected:

```jsx
const cardVariants = {
  visible: { opacity: 1, scale: 1, filter: "blur(0px)" },
  inactive: {
    opacity: 0.4,
    scale: 0.95,
    filter: "blur(2px)",
    transition: { duration: 0.3 }
  }
}

<motion.div
  variants={cardVariants}
  animate={isSelected ? "visible" : "inactive"}
>
  Card Content
</motion.div>
```

### Slide Out Exit

```jsx
<motion.div
  exit={{ x: -300, opacity: 0 }}
  transition={{ duration: 0.5 }}
/>
```

---

## 🎮 Interactive Animations

### Hover Effects

```jsx
<motion.div
  className="card"
  whileHover={{
    scale: 1.05,
    y: -10,
    boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
    transition: { duration: 0.3 }
  }}
>
  Hover me!
</motion.div>
```

### Click/Tap Effects

```jsx
<motion.button
  whileTap={{ scale: 0.95 }}
  whileHover={{ scale: 1.05 }}
  transition={{ type: "spring", stiffness: 400 }}
>
  Click me!
</motion.button>
```

### Selection State

```jsx
const [selected, setSelected] = useState(null)

<motion.div
  animate={{
    scale: selected === item.id ? 1.05 : 1,
    borderColor: selected === item.id ? "#3b82f6" : "#e5e7eb",
    boxShadow: selected === item.id
      ? "0 25px 50px rgba(59, 130, 246, 0.5)"
      : "0 10px 20px rgba(0,0,0,0.1)"
  }}
  onClick={() => setSelected(item.id)}
/>
```

### Pulse Animation

```jsx
<motion.div
  animate={{
    scale: [1, 1.02, 1],
    opacity: [0.5, 0.8, 0.5]
  }}
  transition={{
    duration: 2,
    repeat: Infinity,
    ease: "easeInOut"
  }}
/>
```

### Wiggle Animation

```jsx
<motion.div
  whileHover={{
    rotate: [0, -5, 5, -5, 5, 0],
    transition: { duration: 0.5 }
  }}
/>
```

---

## 📱 Touch Support

Framer Motion automatically supports touch! Just use the same props:

```jsx
<motion.div
  whileHover={{ scale: 1.05 }}  // Works on hover
  whileTap={{ scale: 0.95 }}    // Works on touch
  drag                          // Enable dragging
  dragConstraints={{ left: -200, right: 200 }}
>
  Touch and drag me!
</motion.div>
```

### Touch-Specific Handling

```jsx
const [isDragging, setIsDragging] = useState(false)

<motion.div
  drag="x"
  onDragStart={() => setIsDragging(true)}
  onDragEnd={() => setIsDragging(false)}
  onClick={() => !isDragging && handleClick()}
>
  Swipe me!
</motion.div>
```

---

## ⚡ Performance Tips

### 1. Use GPU-Accelerated Properties

✅ **Fast** (GPU-accelerated):
- `transform` (x, y, scale, rotate)
- `opacity`

❌ **Slow** (CPU-intensive):
- `width`, `height`
- `top`, `left`
- `margin`, `padding`

```jsx
// ❌ Slow
<motion.div animate={{ width: 300 }} />

// ✅ Fast
<motion.div animate={{ scaleX: 1.5 }} />
```

### 2. Use `layout` for Size Changes

When animating size/position changes:

```jsx
<motion.div layout>
  {/* Content that changes size */}
</motion.div>
```

### 3. Disable Animations During Drag

```jsx
const [isDragging, setIsDragging] = useState(false)

<motion.div
  animate={!isDragging ? { scale: 1.05 } : undefined}
/>
```

### 4. Use `will-change` for Heavy Animations

```jsx
<motion.div
  style={{ willChange: "transform" }}
  animate={{ x: 100 }}
/>
```

### 5. Reduce Animation Complexity on Mobile

```jsx
const isMobile = window.innerWidth < 768

<motion.div
  animate={{
    scale: isMobile ? 1 : 1.05,
    rotateY: isMobile ? 0 : 5
  }}
/>
```

---

## 💡 Real Examples

### Complete Timeline Card

```jsx
import { motion, AnimatePresence } from "framer-motion"
import { useState } from "react"

const TimelineCard = ({ period, index, isSelected, onSelect }) => {
  return (
    <motion.div
      className="relative w-80"
      initial={{ opacity: 0, y: 100, scale: 0.8 }}
      animate={{
        opacity: isSelected ? 1 : 0.4,
        y: 0,
        scale: isSelected ? 1.05 : 1,
      }}
      exit={{ opacity: 0, y: -50, scale: 0.8 }}
      whileHover={{ scale: 1.08, y: -10 }}
      whileTap={{ scale: 0.98 }}
      transition={{
        duration: 0.6,
        delay: index * 0.15,
        type: "spring",
        stiffness: 100,
        damping: 15
      }}
      onClick={() => onSelect(period.id)}
    >
      {/* Year Badge */}
      <motion.div
        className="text-5xl font-bold text-blue-500 text-center mb-4"
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ delay: index * 0.1 + 0.2 }}
      >
        {period.year}
      </motion.div>

      {/* Card Content */}
      <motion.div className="bg-white/20 backdrop-blur-lg p-6 rounded-2xl border border-white/30">
        {/* Icon */}
        <motion.div
          className="text-4xl text-center mb-4"
          whileHover={{
            rotate: [0, -10, 10, -10, 0],
            scale: 1.2
          }}
        >
          🌾
        </motion.div>

        {/* Title */}
        <h3 className="text-xl font-bold text-white text-center mb-2">
          {period.title}
        </h3>

        {/* Description */}
        <p className="text-gray-200 text-sm text-center">
          {period.description}
        </p>

        {/* Selection Badge */}
        <AnimatePresence>
          {isSelected && (
            <motion.div
              className="absolute -top-3 -right-3 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 180 }}
            >
              <span className="text-white">✓</span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  )
}

// Usage
const Timeline = () => {
  const [selected, setSelected] = useState(null)

  const periods = [
    { id: 1, year: "1925", title: "Foundation", description: "..." },
    { id: 2, year: "1950", title: "Expansion", description: "..." },
    { id: 3, year: "2025", title: "Jubilee", description: "..." }
  ]

  return (
    <div className="flex space-x-8 overflow-x-auto">
      {periods.map((period, index) => (
        <TimelineCard
          key={period.id}
          period={period}
          index={index}
          isSelected={selected === period.id}
          onSelect={setSelected}
        />
      ))}
    </div>
  )
}
```

---

## 🎓 Advanced Patterns

### Sequence Animations

Multiple animations in sequence:

```jsx
<motion.div
  animate={{
    scale: [0, 1.2, 1],
    rotate: [0, 180, 0],
    borderRadius: ["50%", "0%", "20%"]
  }}
  transition={{
    duration: 2,
    times: [0, 0.5, 1],
    ease: "easeInOut"
  }}
/>
```

### Path Animations

Animate along a path:

```jsx
<motion.div
  animate={{
    x: [0, 100, 100, 0, 0],
    y: [0, 0, 100, 100, 0]
  }}
  transition={{ duration: 5, repeat: Infinity }}
/>
```

### Coordinated Animations

Multiple elements animating together:

```jsx
const controls = useAnimationControls()

<div>
  <button onClick={() => controls.start("visible")}>
    Animate All
  </button>

  <motion.div animate={controls} variants={variants} />
  <motion.div animate={controls} variants={variants} />
  <motion.div animate={controls} variants={variants} />
</div>
```

---

## 📚 Resources

- [Framer Motion Docs](https://www.framer.com/motion/)
- [Animation Examples](https://www.framer.com/motion/examples/)
- [Easing Functions](https://easings.net/)
- [Tailwind CSS](https://tailwindcss.com/)

---

## 🎯 Quick Reference

| Feature | Code |
|---------|------|
| Fade in | `initial={{ opacity: 0 }} animate={{ opacity: 1 }}` |
| Slide up | `initial={{ y: 100 }} animate={{ y: 0 }}` |
| Scale | `initial={{ scale: 0 }} animate={{ scale: 1 }}` |
| Rotate | `initial={{ rotate: 180 }} animate={{ rotate: 0 }}` |
| Spring | `transition={{ type: "spring", stiffness: 100 }}` |
| Delay | `transition={{ delay: 0.5 }}` |
| Stagger | `transition={{ staggerChildren: 0.15 }}` |
| Hover | `whileHover={{ scale: 1.05 }}` |
| Tap | `whileTap={{ scale: 0.95 }}` |
| Exit | `exit={{ opacity: 0 }}` with `<AnimatePresence>` |

---

**Happy Animating! 🎉**
