// Plugin Imports
const metagen = require('eleventy-plugin-metagen');
const sitemap = require("@quasibit/eleventy-plugin-sitemap");
const htmlmin = require("html-minifier");


module.exports = function(eleventyConfig) {

  // watch files for changes
  eleventyConfig.addWatchTarget('./tailwind.config.js');
  eleventyConfig.addWatchTarget('./postcss.config.js');
  eleventyConfig.addWatchTarget("./_dist/styles.css");

  // passthrough files
  eleventyConfig.setServerPassthroughCopyBehavior("copy");
  eleventyConfig.addPassthroughCopy({'./src/static' : './'});

  // add plugins
  eleventyConfig.addPlugin(metagen);
  eleventyConfig.addPlugin(sitemap, {
    sitemap: {
      hostname: "https://www.tyler.camp",
    },
  });

  // minify html with html-minifier
  eleventyConfig.addTransform("htmlmin", function(content, outputPath) {
    if( this.outputPath && this.outputPath.endsWith(".html") ) {
      let minified = htmlmin.minify(content, {
        useShortDoctype: true,
        removeComments: true,
        collapseWhitespace: true
      });
      return minified;
    }
    return content;
  });

  return {
    dir: {
      input: 'src',
      output: '_dist'
    }
  };
};