const metagen = require('eleventy-plugin-metagen');
const sitemap = require("@quasibit/eleventy-plugin-sitemap");
const postcss = require('postcss');
const esbuild = require('esbuild');
const htmlmin = require("html-minifier");

module.exports = function(eleventyConfig) {

  // passhthrough static files
  eleventyConfig.addPassthroughCopy({ "./static": "/" });
  // postcss & esbuild output here for more reliable livereload
  eleventyConfig.addPassthroughCopy({ "./src/_includes/globalAssets/_compiled/": "/" });
  // opt out of emulated passthrough during --serve
  eleventyConfig.setServerPassthroughCopyBehavior("copy");

  // add plugins
  eleventyConfig.addPlugin(metagen);
  eleventyConfig.addPlugin(sitemap, {
    sitemap: {
      hostname: "https://www.tyler.camp",
    },
  });

  // watch tailwind config for changes
  eleventyConfig.addWatchTarget('./tailwind.config.js');

  // process css (inline)
  eleventyConfig.addNunjucksAsyncFilter('cssmin', function (code, callback) {
    postcss([
      require('tailwindcss'),
      require('postcss-100vh-fix'),
      require('postcss-lightningcss')({
        browsers: 'defaults'
      })
    ])
      .process(code, { from: undefined })
      .then(result => callback(null, result.css));
  });

  // process js (inline)
  eleventyConfig.addNunjucksAsyncFilter('jsmin', function (code, callback) {
    esbuild.transform(code, {
      minify: true,
    })
      .then(result => callback(null, result.code));
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