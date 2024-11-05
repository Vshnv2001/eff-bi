// tailwind.config.js
/** @type {import('tailwindcss').Config} */
const withMT = require("@material-tailwind/react/utils/withMT");

module.exports = withMT({
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./node_modules/@mui/material/**/*.js",
    "./node_modules/@mui/icons-material/**/*.js",
  ],
  theme: {
    extend: {
      spacing: {
        '2.4': '0.5rem',
      },
      colors: {
        gray: {
          custom: 'rgb(243, 244, 247)',
        },
      },
    },
  },
  plugins: [],
});