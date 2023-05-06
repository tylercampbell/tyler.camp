const { execSync } = require('child_process')

module.exports = eleventyConfig => {
  eleventyConfig.on('eleventy.after', () => {
    execSync(
      `postcss ./src/_includes/assets-global/styles.css -o ./_site/compiled.css --verbose`,
      { encoding: 'utf-8' }
    )
  })
}