  // Plugin Imports
const metagen = require('eleventy-plugin-metagen');
const sitemap = require("@quasibit/eleventy-plugin-sitemap");
const svgSprite = require("eleventy-plugin-svg-sprite");
const htmlmin = require("html-minifier");
const CleanCSS = require("clean-css");
const postCss = require("postcss");
const tailwind = require("tailwindcss");
const autoprefixer = require("autoprefixer");

// Shortcode Imports
const Image = require("@11ty/eleventy-img");
const path = require("path");

// Picture Shortcode
function pictureShortcode(src, alt, classes = "", style = "", sizes = "100vw", loading = "lazy", decoding = "async") {
  let url = `./src/assets/images/${src}`;
  let options = {
    widths: [660, 1920],
    formats: ["webp"],
    urlPath: "/img/opt/",
    outputDir: "./_dist/img/opt/",
  };
  Image(url, options);
  let imageAttributes = {
    alt,
    class: classes,
    style: style,
    sizes,
    loading,
    decoding,
  };
  let metadata = Image.statsSync(url, options);
  return Image.generateHTML(metadata, imageAttributes, {
    whitespaceMode: "inline",
  });
}

module.exports = function(eleventyConfig) {

  // watch files for changes
  eleventyConfig.addWatchTarget('./tailwind.config.js');
  eleventyConfig.addWatchTarget('./src/_includes/styles.css');

  // passthrough files
  eleventyConfig.addPassthroughCopy({'./node_modules/scrollmagic/scrollmagic/minified/ScrollMagic.min.js' : './ScrollMagic.min.js'});
  eleventyConfig.setServerPassthroughCopyBehavior("copy");
  eleventyConfig.addPassthroughCopy({'./src/static' : './'});

  // add plugins
  eleventyConfig.addPlugin(metagen);
  eleventyConfig.addPlugin(sitemap, {
    sitemap: {
      hostname: "https://www.tyler.camp",
    },
  });
  eleventyConfig.addPlugin(svgSprite, {
    path: "./src/assets/svg/",
  });

  // add shortcodes
  eleventyConfig.addShortcode("picture", pictureShortcode);

  // process postcss & minify with clean-css
  eleventyConfig.addNunjucksAsyncFilter("postcss", (cssCode, done) => {
    const cleanCss = new CleanCSS({});
    postCss([tailwind,autoprefixer])
      .process( cssCode, { from: undefined } )
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
      output: '_dist'
    }
  };
};