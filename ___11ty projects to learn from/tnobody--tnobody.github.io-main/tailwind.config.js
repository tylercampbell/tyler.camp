const typographyPlugin = require("@tailwindcss/typography");

module.exports = {
  purge: {
    enabled: true,
    content: [
      "./content/**/*.njk",
      "./content/**/*.md",
      "./content/**/*.html",
      "./content/**/*.js",
    ],
  },
  darkMode: "media", // or 'media' or 'class'
  theme: {
    extend: {},
  },
  variants: {
    typography: [],
    extend: {},
  },
  plugins: [typographyPlugin],
};
