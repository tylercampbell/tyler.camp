const postcss = require('postcss');
const fs = require('fs');
const path = require('path');

const inputFile = `./src/_includes/css/global.css`;
const outputFile = `./_site/assets/global.css`;

const inputFileContents = fs.readFileSync(inputFile, 'utf-8');

module.exports = eleventyConfig => {

  eleventyConfig.on('eleventy.after', async () => {
    try {
      const result = await postcss([
        require('tailwindcss'),
        require('postcss-lightningcss')({
          browsers: 'defaults',
          lightningcssOptions: {
            minify: (process.env.NODE_ENV === "production")
          },
        }),
      ]).
        process(inputFileContents, { from: inputFile, to: outputFile });

      // Create the output directory if it doesn't exist
      const outputDir = path.dirname(outputFile);
      if (!fs.existsSync(outputDir)) {
        await fs.promises.mkdir(outputDir, { recursive: true });
      }

      // Write the output file contents to disk
      await fs.promises.writeFile(outputFile, result.css);
    } catch (error) {
      console.error(error);
    }
  });

  eleventyConfig.addNunjucksAsyncFilter('cssmin', function (code, callback) {
    postcss([
      require('postcss-lightningcss')({
        browsers: 'defaults',
        lightningcssOptions: {
          minify: (process.env.NODE_ENV === "production")
        },
      })
    ])
      .process(code, { from: undefined })
      .then(result => callback(null, result.css));
  });

}