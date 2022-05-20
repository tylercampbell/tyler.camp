// Plugin Imports
const faviconsPlugin = require("eleventy-plugin-gen-favicons");
const metagen = require('eleventy-plugin-metagen');
const sitemap = require("@quasibit/eleventy-plugin-sitemap");
const svgSprite = require("eleventy-plugin-svg-sprite");
const htmlmin = require("html-minifier");
const CleanCSS = require("clean-css");
const postCss = require("postcss");
const tailwind = require("tailwindcss");
const autoprefixer = require("autoprefixer");

module.exports = function(eleventyConfig) {

  // watch files for changes
  eleventyConfig.addWatchTarget('./tailwind.config.js');
  eleventyConfig.addWatchTarget('./src/_includes/styles.css');

  // passthrough files
  eleventyConfig.addPassthroughCopy({'./src/static' : './'});

  // add plugins
  eleventyConfig.addPlugin(metagen);
  eleventyConfig.addPlugin(faviconsPlugin, {
    'outputDir': './docs',
    'manifestData': {'name': 'Tyler Campbell'},
    'generateManifest': false
  });
  eleventyConfig.addPlugin(sitemap, {
    sitemap: {
      hostname: "https://www.tyler.camp",
    },
  });
  eleventyConfig.addPlugin(svgSprite, {
    path: "./src/_includes/sprites",
  });

  // process postcss & minify with clean-css
  eleventyConfig.addNunjucksAsyncFilter("postcss", (cssCode, done) => {
    const cleanCss = new CleanCSS({});
    postCss([require("postcss-100vh-fix"),tailwind,require("postcss-100vh-fix"),autoprefixer])
      .process(cssCode)
      .then(
        (r) => {
          const result = cleanCss.minify(r.css);
            if (result.errors.length) {
              done(result.errors, null);
            } else {
              done(null, result.styles);
            }
        },
        (e) => {
          done(e, null);
        }
      );
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
      output: 'docs'
    }
  };
};