/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  safelist: [
    // Museum theme colors - ensure these classes are always generated
    {
      pattern:
        /^(bg|text|border|from|via|to)-brand-(mist|sky|olive|gold|amber|maroon|rust|slate|linen|terracotta)/,
      variants: ["hover", "active"],
    },
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#f0f9ff",
          100: "#e0f2fe",
          200: "#bae6fd",
          300: "#7dd3fc",
          400: "#38bdf8",
          500: "#0ea5e9",
          600: "#0284c7",
          700: "#0369a1",
          800: "#075985",
          900: "#0c4a6e",
        },
        museum: {
          brown: "#8B4513",
          gold: "#FFD700",
          cream: "#F5F5DC",
          green: "#228B22",
        },
        // Project brand palette
        brand: {
          mist: "#a7b8b4", // #a7b8b4
          sky: "#b5cbd1", // #b5cbd1
          olive: "#929d7c", // #929d7c
          gold: "#c9a300", // #c9a300
          amber: "#b48a0f", // #b48a0f
          maroon: "#440f0f", // #440f0f
          rust: "#89350a", // #89350a
          slate: "#657575", // #657575
          linen: "#f3f2e9", // #f3f2e9
          terracotta: "#ae5514", // #ae5514
        },
        // Semantic aliases for easier usage
        theme: {
          primary: "#c9a300", // brand.gold
          secondary: "#657575", // brand.slate
          accent: "#ae5514", // brand.terracotta
          success: "#929d7c", // brand.olive
          warning: "#b48a0f", // brand.amber
          danger: "#89350a", // brand.rust
          surface: "#f3f2e9", // brand.linen
          muted: "#a7b8b4", // brand.mist
        },
      },
      fontFamily: {
        // Museum fonts
        heading: ["Josefin Sans", "sans-serif"], // For headings and buttons
        body: ["Montserrat", "sans-serif"], // For text content
        display: ["Josefin Sans", "sans-serif"], // Alias for headings
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-in-out",
        "slide-up": "slideUp 0.6s ease-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
      },
    },
  },
  plugins: [],
}
