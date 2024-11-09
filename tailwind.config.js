/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        nobile: ["Nobile", "sans-serif"],
        sans: ["Faculty Glyphic", "sans-serif"]
      },
      keyframes: {
        'page-transition': {
          '0%': {
            transform: 'scale(0)',
            opacity: '0'
          },
          '100%': {
            transform: 'scale(4)',
            opacity: '1'
          }
        }
      },
      animation: {
        'page-transition': 'page-transition 0.5s ease-in forwards'
      }
    },
  },
  plugins: [],
}