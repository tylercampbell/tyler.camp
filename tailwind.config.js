/** @type {import('tailwindcss').Config} */

const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  content: [
    './src/**/*.{html,webc,md,liquid,njk}',
    './src/_includes/**/*.{css,js}'
  ],
  safelist: [
    'scrolled',
  ],
  plugins: [
    require('@tailwindcss/forms'),
  ],
  theme: {
    extend: {
      fontFamily: {
        'serif': ['DynaPuff', ...defaultTheme.fontFamily.serif],
        'sans':  ['Nunito', ...defaultTheme.fontFamily.sans],
      },
    }
  }
}