const esbuild = require('esbuild');

const inputFiles = [`./src/_includes/assets-global/scripts.js`];
const outputDir = `./_site/assets`;

module.exports = eleventyConfig => {
  
  eleventyConfig.on('eleventy.after', async () => {
    try {
      const minify = (process.env.NODE_ENV === 'production');
      
      esbuild.build({
        entryPoints: inputFiles,
        bundle: true,
        outdir: outputDir,
        minify: minify,
        sourcemap: minify,
      });
    } catch (error) {
      console.error(error);
    }
  });

  eleventyConfig.addNunjucksAsyncFilter('jsmin', function (code, callback) {
    esbuild.transform(code, {
      minify: (process.env.NODE_ENV === 'production'),
    })
      .then(result => callback(null, result.code));
  });

}

// https://github.com/flight-deck/flightdeck-for-eleventy-with-esbuild/blob/fa5d23d2ee9436be58d745903bd8295a4cbf193e/_flightdeck/transforms/esBuildAssets.js#L10