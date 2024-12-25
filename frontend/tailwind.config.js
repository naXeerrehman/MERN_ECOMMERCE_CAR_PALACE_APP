/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
      screens: {
        xs:'220px',
        sm: '350px',  // Small screens (customize as needed)
        md: '400px',  // Medium screens
        lg: '1024px', // Large screens
        xl: '1280px', // Extra large screens
      },
    },
  },
  plugins: [],
}