/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{html,md,11ty.js,liquid,njk,hbs,mustache,ejs,haml,pug}'
  ],
  safelist: [
    'scrolled',
  ],
  plugins: [
    require('@tailwindcss/forms'),
  ]
}