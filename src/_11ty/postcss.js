const postcss = require('postcss');
const fs = require('fs');
const path = require('path');

const inputFile = './src/_includes/assets-global/styles.css';
const outputFile = './_site/assets/styles.css';

const inputFileContents = fs.readFileSync(inputFile, 'utf-8');

const plugins = [
  require('tailwindcss'),
  require('postcss-lightningcss')({
    browsers: 'defaults',
    lightningcssOptions: {
      minify: (process.env.NODE_ENV === "production")
    },
  }),
];

module.exports = eleventyConfig => {
  eleventyConfig.on('eleventy.after', async () => {
    try {
      const result = await postcss(plugins).process(inputFileContents, { from: inputFile, to: outputFile });

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
  })
}