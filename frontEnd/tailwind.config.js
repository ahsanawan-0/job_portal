/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}", // Adjust the path according to your project structure
  ],
  theme: {
    extend: {
      colors: {
        borderColor: "#E4E5E8", // Border color
        placeholder: "#9199A3", // Placeholder color
        button: "#0A65CC", // Button color
        textcolor: "#767F8C",
        backgroundcolor: "#FCFCFC", // Background color
      },
    },
  },
  plugins: [],
};
