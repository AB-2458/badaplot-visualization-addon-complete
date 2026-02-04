/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Plot status colors
        'plot-available': '#22c55e',
        'plot-sold': '#ef4444',
        'plot-booked': '#ec4899',
        'plot-hold': '#f97316',
        'plot-provisional': '#84cc16',
        'plot-registered': '#8b5cf6',
        'plot-mortgaged': '#a16207',
        // UI colors
        'primary': '#7c3aed',
        'primary-dark': '#6d28d9',
        'secondary': '#64748b',
        'dark-bg': '#1e1e2e',
        'card-bg': '#2a2a3e',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
