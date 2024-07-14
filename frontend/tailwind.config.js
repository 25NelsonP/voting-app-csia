/** @type {import('tailwindcss').Config} */
module.exports = {
  purge: ["./src/**/**/*.{js,jsx,ts,tsx,html,css}", "./public/index.html"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [],
  theme: {
    extend: {
      colors: {
        amber: "#ddb41f",
      },
    },
  },
};
