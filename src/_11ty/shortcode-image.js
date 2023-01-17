const Image = require("@11ty/eleventy-img");
Image.concurrency = 8; // default is 10

// Image
function pictureShortcode(src, alt, classes = "", style = "", sizes = "100vw", loading = "lazy", decoding = "async") {
  let url = `./src/_images/${src}`;
  let options = {
    widths: [480, 770, 1920],
    formats: ["webp", "jpeg"],
    urlPath: "/img/optimized/",
    outputDir: "./_site/img/optimized/",
  };
  Image(url, options);
  let imageAttributes = {
    alt,
    class: classes,
    style: style,
    sizes,
    loading,
    decoding,
  };
  let metadata = Image.statsSync(url, options);
  return Image.generateHTML(metadata, imageAttributes, {
    whitespaceMode: "inline",
  });
}

module.exports = eleventyConfig => {
  eleventyConfig.addShortcode("picture", pictureShortcode);
};