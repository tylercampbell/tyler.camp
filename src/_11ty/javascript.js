const { execSync } = require('child_process')

module.exports = eleventyConfig => {
  eleventyConfig.on('eleventy.after', ({ runMode }) => {
    const minify = runMode === 'build' ? '--minify' : '';
    execSync(
      `esbuild ./src/_includes/assets-global/scripts.js --outfile=./_site/compiled.js --bundle ${minify}`,
      { encoding: 'utf-8' }
    );
  });
}