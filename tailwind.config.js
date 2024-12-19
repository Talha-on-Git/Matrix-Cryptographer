/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./*.{html,js}"],
  theme: {
    extend: {
      animation: {
          gradient: 'gradient 15s ease infinite',
      },
      keyframes: {
          gradient: {
              '0%': { 'background-position': '0% 50%' },
              '50%': { 'background-position': '100% 50%' },
              '100%': { 'background-position': '0% 50%' },
          },
      },
      fontFamily: {
        iceland: ['Iceland', 'sans-serif'],
      },
  },
  },
  plugins: [],
};
