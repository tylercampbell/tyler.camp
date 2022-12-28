const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const { EleventyRenderPlugin } = require("@11ty/eleventy");
const postCss = require("postcss");
const CleanCSS = require("clean-css");
const tailwind = require("tailwindcss");
const autoprefixer = require("autoprefixer");
const readingTime = require("eleventy-plugin-reading-time");
const esbuild = require("esbuild");
const UpgradeHelper = require("@11ty/eleventy-upgrade-help");
const eleventyVue = require("@11ty/eleventy-plugin-vue");

const getOrderValue = (page) => {
  const matches = (page.fileSlug || "").match(/^([0-9]*)_.*/);
  if (matches && matches.length === 2) {
    return Number(matches[1]);
  }
  if (page.data.order) {
    return Number(page.data.order);
  }
  return page.date;
};

module.exports = function (eleventyConfig) {
  eleventyConfig.addPlugin(UpgradeHelper);
  eleventyConfig.addPlugin(eleventyVue);
  eleventyConfig.addPlugin(EleventyRenderPlugin);

  // Content configuration
  eleventyConfig.addPassthroughCopy("static");

  eleventyConfig.addLayoutAlias("default", "layouts/index.njk");
  eleventyConfig.addLayoutAlias("html", "layouts/html.njk");
  eleventyConfig.addLayoutAlias("post", "layouts/post.njk");
  eleventyConfig.addLayoutAlias("page", "layouts/page.njk");
  eleventyConfig.addLayoutAlias("slides", "layouts/slides.11ty.js");

  eleventyConfig.addPlugin(readingTime);
  eleventyConfig.addFilter("format", (date) => {
    const d = date instanceof Date ? date : new Date(date);
    return Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(d);
  });
  eleventyConfig.addFilter("markdown", function (value) {
    let markdown = require("markdown-it")({
      html: true,
    });
    return markdown.render(value);
  });

  eleventyConfig.setTemplateFormats(["js", "png", "md", "njk", "html"]);

  eleventyConfig.addCollection("posts", (collectionApi) =>
    collectionApi.getFilteredByGlob("content/blog/**/*.md")
  );

  eleventyConfig.addCollection("slides", (collectionApi) =>
    collectionApi.getFilteredByTags("slide").sort((a, b) => {
      return getOrderValue(a) - getOrderValue(b);
    })
  );

  eleventyConfig.addPlugin(syntaxHighlight, {});

  // Asset configuration

  eleventyConfig.addWatchTarget("styles/**/*.css");
  eleventyConfig.addWatchTarget("js/**/*");
  eleventyConfig.addWatchTarget("**/*.js");
  eleventyConfig.addNunjucksAsyncFilter("esbuild", (jsFile, done) => {
    esbuild
      .build({
        entryPoints: [jsFile],
        bundle: true,
        write: false,
      })
      .then(
        (result) => {
          const reduced = result.outputFiles.reduce(
            (combined, r) => combined + r.text,
            ""
          );
          done(null, reduced);
        },
        (e) => done(e, null)
      );
  });
  eleventyConfig.addNunjucksAsyncFilter("postcss", (cssCode, done) => {
    const cleanCss = new CleanCSS({});
    postCss([require("postcss-nested"), autoprefixer, tailwind])
      .process(cssCode)
      .then(
        (r) => {
          const result = cleanCss.minify(r.css);
          if (result.errors.length) {
            done(result.errors, null);
          } else {
            done(null, result.styles);
          }
        },
        (e) => {
          done(e, null);
        }
      );
  });
};
