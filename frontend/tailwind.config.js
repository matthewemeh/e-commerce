/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}', './public/*.html'],
  theme: {
    extend: {},
    screens: {
      tablets: { max: '756px' }
    }
  },
  plugins: []
};
