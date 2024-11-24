/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#FFD700', // Pure golden yellow
          hover: '#FFED4A',   // Lighter golden yellow for hover states
        }
      }
    },
  },
  plugins: [],
};