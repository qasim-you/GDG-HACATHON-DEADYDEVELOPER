// tailwind.config.js
module.exports = {
    content: [
      './pages/**/*.{js,ts,jsx,tsx}',   // This includes pages folder (if it's there)
      './app/**/*.{js,ts,jsx,tsx}',      // This includes the app folder
      './components/**/*.{js,ts,jsx,tsx}', // If you have a components folder
    ],
    theme: {
      extend: {
        colors: {
          customBlue: 'rgb(95, 173, 199)', // Your custom blue color
        },
      },
    },
    plugins: [],
  }
  