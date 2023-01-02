// Plugin Imports
const metagen = require('eleventy-plugin-metagen');
const sitemap = require("@quasibit/eleventy-plugin-sitemap");
const htmlmin = require("html-minifier");


module.exports = function(eleventyConfig) {

  // passhthrough static files
  eleventyConfig.addPassthroughCopy({ "./static": "/" });
  // postcss & esbuild output here for more reliable livereload
  eleventyConfig.addPassthroughCopy({ "./src/_includes/assets/_compiled/": "assets" });

  // add plugins
  eleventyConfig.addPlugin(metagen);
  eleventyConfig.addPlugin(sitemap, {
    sitemap: {
      hostname: "https://www.tyler.camp",
    },
  });

  // minify html if production
  if (process.env.NODE_ENV === "production") {
    eleventyConfig.addTransform("htmlmin", function (content) {
      if (this.page.outputPath && this.page.outputPath.endsWith(".html")) {
        let minified = htmlmin.minify(content, {
          useShortDoctype: true,
          removeComments: true,
          collapseWhitespace: true
        });
        return minified;
      }

      return content;
    });
  }

  return {
    dir: {
      input: 'src'
    }
  };
};