/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}", // adjust to your project
    ],
    theme: {
      extend: {
        colors: {
          primary: "#ED4A5A",     // Raspberry red
          secondary: "#88BFFF",   // Pastel UCLA blue
        },
      },
    },
    plugins: [],
  };
  