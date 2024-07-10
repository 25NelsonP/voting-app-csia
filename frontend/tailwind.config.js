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
    colors: {
      transparent: "transparent",
      current: "currentColor",
      white: "#ffffff",
      amber: "#ddb41f",
    },
  },
};
