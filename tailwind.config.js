/** @type {import('tailwindcss').Config} */

const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  content: [
    './src/**/*.{html,webc,md,liquid,njk}',
    './src/_includes/**/*.{css,js}'
  ],

  plugins: [
    require('@tailwindcss/forms'),
  ],
  theme: {
    extend: {
      fontFamily: {
        'sans':  ['Nunito', ...defaultTheme.fontFamily.sans],
      },
    }
  }
}