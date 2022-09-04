/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/index.njk'
  ],
  safelist: [
    'scrolled',
  ],
  plugins: [
    require('@tailwindcss/forms'),
  ]
}