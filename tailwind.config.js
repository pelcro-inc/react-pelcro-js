/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  // prefix: "plc-",
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#e0f4f2',
          100: '#b3e4df',
          200: '#80d4cb',
          300: '#4db4b8',
          400: '#33AEA2', // original primary color
          500: '#33AEA2',
          600: '#33AEA2',
          700: '#145757',
          800: '#0a3f3f',
          900: '#002828',
        },
      },
    },
  },
  plugins: [],
}
