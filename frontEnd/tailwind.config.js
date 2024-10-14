/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      keyframes: {
        dots: {
          "0%, 20%": { content: '"."' },
          "40%": { content: '".."' },
          "60%": { content: '"..."' },
          "100%": { content: '""' },
        },
      },
      animation: {
        dots: "dots 1.5s steps(5, end) infinite",
      },
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
