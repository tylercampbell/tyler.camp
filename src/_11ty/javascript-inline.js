const esbuild = require('esbuild');

module.exports = eleventyConfig => {
  eleventyConfig.addNunjucksAsyncFilter('jsmin', function (code, callback) {
    esbuild.transform(code, {
      minify: true,
    })
      .then(result => callback(null, result.code));
  });
}