/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
      colors: {
        "custom-gray": "#767F8C",
        "custom-green": "#0BA02C",
        "custom-blue": "#0A65CC",
        "custom-black": "#18191C",
      },
    },
  },
  plugins: [],
};
