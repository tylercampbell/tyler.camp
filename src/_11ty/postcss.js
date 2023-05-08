const postcss = require('postcss');
const tailwind = require('tailwindcss');
const lightningcss = require('postcss-lightningcss');

module.exports = (eleventyConfig) => {
  eleventyConfig.addTemplateFormats('css');

  eleventyConfig.addExtension('css', {
    outputFileExtension: 'css',
    compile: async (inputContent, inputPath) => {
      if (inputPath !== './src/assets/global.css') {
        return;
      }

      return async () => {
        let output = await postcss([
          tailwind,
          lightningcss({
            browsers: 'defaults',
            lightningcssOptions: {
              minify: process.env.NODE_ENV === 'production',
            },
          }),
        ]).process(inputContent, { from: inputPath });

        return output.css;
      };
    },
  });

  eleventyConfig.addNunjucksAsyncFilter('cssmin', function (code, callback) {
    postcss([
      lightningcss({
        browsers: 'defaults',
        lightningcssOptions: {
          minify: process.env.NODE_ENV === 'production',
        },
      }),
    ])
      .process(code, { from: undefined })
      .then((result) => callback(null, result.css));
  });
};
