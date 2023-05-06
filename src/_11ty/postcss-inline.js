const postcss = require('postcss');

module.exports = eleventyConfig => {
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
}