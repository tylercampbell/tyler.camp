// Plugin Imports
const metagen = require('eleventy-plugin-metagen');
const sitemap = require("@quasibit/eleventy-plugin-sitemap");
const htmlmin = require("html-minifier");
const Image = require("@11ty/eleventy-img");



module.exports = function(eleventyConfig) {

  // eleventy-img
  function pictureShortcode(src, alt, classes = "", style = "", sizes = "100vw", loading = "lazy", decoding = "async") {
    let url = `./src/assets/images/${src}`;
    let options = {
      widths: [480, 770, 1920],
      formats: ["webp", "jpeg"],
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

  // add shortcodes
  eleventyConfig.addShortcode("picture", pictureShortcode);

  // watch files for changes
  eleventyConfig.addWatchTarget('./tailwind.config.js');
  eleventyConfig.addWatchTarget('./postcss.config.js');
  eleventyConfig.addWatchTarget('./src/_includes/entry.css');
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