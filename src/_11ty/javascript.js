const esbuild = require("esbuild");

module.exports = eleventyConfig => {
  eleventyConfig.on('eleventy.after', ({ runMode }) => {
    const minify = runMode === 'build' ? true : false;
    
    esbuild.build({
      entryPoints: ['./src/_includes/assets-global/scripts.js'],
      bundle: true,
      outdir: './_site/assets',
      minify: minify,
      sourcemap: minify,
    })
  });
}

// https://github.com/flight-deck/flightdeck-for-eleventy-with-esbuild/blob/fa5d23d2ee9436be58d745903bd8295a4cbf193e/_flightdeck/transforms/esBuildAssets.js#L10