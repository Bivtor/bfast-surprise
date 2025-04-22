module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./app/*.{js,ts,jsx,tsx}",
    "app/*.tsx",
    "app/page.tsx"
  ],
  theme: {
    extend : {
      colors: {
        'berry-red': '#ed4a5a', // Raspberry red [#ed4a5a]
        'uc-blue': {
          light: '#A7C6ED', // Light UCLA blue
          DEFAULT: '#88BFFF', // Pastel UCLA blue [#88BFFF]
        },
        // 'primary' : '#F5F5F5', // Light gray
      },
    }
  },
  plugins: [],
};