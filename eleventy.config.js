const metagen = require('eleventy-plugin-metagen');
const sitemap = require("@quasibit/eleventy-plugin-sitemap");

module.exports = function(eleventyConfig) {

  // reload dev server from postcss & esbuild output in package.json
  eleventyConfig.setServerOptions({
    watch: ["_site/assets/*.{js,css}"],
  });

  // watch tailwind config for changes
  eleventyConfig.addWatchTarget('./tailwind.config.js');

  // passhthrough static files
  eleventyConfig.addPassthroughCopy({ "./src/static": "/" });

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
  eleventyConfig.addPlugin(require('./src/_11ty/eleventy-img.js'))
  eleventyConfig.addPlugin(require('./src/_11ty/postcss.js'))
  eleventyConfig.addPlugin(require('./src/_11ty/esbuild.js'))
  eleventyConfig.addPlugin(require('./src/_11ty/html.js'))

  return {
    dir: {
      input: 'src',
      layouts: '_layouts',
    }
  };
};