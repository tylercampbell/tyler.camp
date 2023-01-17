const Image = require("@11ty/eleventy-img");

module.exports = async function() {
  let metadata = await Image(this.src, {
    widths: [ 320, 640, 960, 1280, 1920, 2560],
    formats: ["avif", "webp", "jpeg"],
    outputDir: "_site/img/",
  });

  let imageAttributes = {
    alt: this.alt,
    class: this.class ?? "",
    style: this.style ?? "",
    loading: this.loading ?? "lazy",
    sizes: "100vw",
    decoding: "async",
    "webc:raw": true,
  };

  // You bet we throw an error on missing alt in `imageAttributes` (alt="" works okay)
  return Image.generateHTML(metadata, imageAttributes);
}