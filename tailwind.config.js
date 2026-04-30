/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./*.html", "./js/*.js"],
  theme: {
    extend: {
      colors: {
        primary: '#FB8500',
        secondary: '#2A9D8F',
        surface: '#F9F9F9',
        'text-main': '#2B2D42',
        'text-sec': '#6C757D',
        error: '#E63946',
      },
      fontFamily: {
        title: ['Plus Jakarta Sans', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
