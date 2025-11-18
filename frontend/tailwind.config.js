/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#0b3d91',
          light: '#0d4ba3',
          dark: '#0a3278',
        },
        teal: {
          DEFAULT: '#06b6d4',
          light: '#22d3ee',
          dark: '#0891b2',
        },
      },
      fontFamily: {
        sans: ['Poppins', 'Roboto', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

