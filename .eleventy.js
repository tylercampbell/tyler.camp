// Plugin Imports
const svgSprite = require("eleventy-plugin-svg-sprite");
const faviconsPlugin = require("eleventy-plugin-gen-favicons");
const metagen = require('eleventy-plugin-metagen');
const sitemap = require("@quasibit/eleventy-plugin-sitemap");

module.exports = function(eleventyConfig) {
  
  // watch for changes
  eleventyConfig.addWatchTarget('./tailwind.config.js');
  eleventyConfig.addWatchTarget('./src/*.css');

  // passthrough files
  eleventyConfig.addPassthroughCopy({'./src/ty-memoji.png' : './ty-memoji.png'});

  // add plugins
  eleventyConfig.addPlugin(faviconsPlugin, {
    'outputDir': './_dist',
    'manifestData': {'name': 'Tyler Campbell'},
    'generateManifest': true
  });
  eleventyConfig.addPlugin(metagen);
  eleventyConfig.addPlugin(svgSprite, {
    path: "./src/sprites",
  });
  eleventyConfig.addPlugin(sitemap, {
    sitemap: {
      hostname: "https://www.tyler.camp",
    },
  });

  return {
    dir: {
      input: 'src',
      output: '_dist'
    }
  };
};