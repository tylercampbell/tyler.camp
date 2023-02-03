const metagen = require('eleventy-plugin-metagen');
const sitemap = require("@quasibit/eleventy-plugin-sitemap");
const postcss = require('postcss');
const esbuild = require('esbuild');
const htmlmin = require("html-minifier");

module.exports = function(eleventyConfig) {

  // reload dev server from postcss & esbuild output in package.json
  eleventyConfig.setServerOptions({
    watch: ["_site/*.{js,css}"],
  });

  // passhthrough static files
  eleventyConfig.addPassthroughCopy({ "./static": "/" });

  // opt out of emulated passthrough during --serve
  eleventyConfig.setServerPassthroughCopyBehavior("copy");

  //ignore drafts
  eleventyConfig.ignores.add("./src/posts/_drafts/");

  // add plugins
  eleventyConfig.addPlugin(metagen);
  eleventyConfig.addPlugin(sitemap, {
    sitemap: {
      hostname: "https://www.tyler.camp",
    },
  });

  // import external configs
  eleventyConfig.addPlugin(require('./src/_11ty/shortcode-image.js'))

  // watch tailwind config for changes
  eleventyConfig.addWatchTarget('./tailwind.config.js');

  // process css (inline)
  eleventyConfig.addNunjucksAsyncFilter('cssmin', function (code, callback) {
    postcss([
      require('postcss-lightningcss')({
        browsers: 'defaults',
        lightningcssOptions: {
          minify: (process.env.NODE_ENV === "production" ? true : false)
        },
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