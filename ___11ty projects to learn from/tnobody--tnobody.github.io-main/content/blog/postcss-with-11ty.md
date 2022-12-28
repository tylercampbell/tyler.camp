---
title: Using PostCss and Tailwindcss in 11ty

---

# {{ title }}

One of the first things I check on every new technology, that I checked out recently is the support for PostCSS integration. TBH I'm not a big fan of PostCSS at all but TailwindCss works best with a PostCSS setup. So I investigated some minutes before I started to setup my blog with 11ty to find out, how PostCSS integration is possible and the result was surprisingly simple and it took me about ~30 min of research and implementation.

**TL;DR**: Checkout [`.eleventy.js`]() config file of this blog (It is really simple).

## Setup

Lets begin with the obvious parts: Installation of the dependencies ;)

```bash
yarn add -D tailwindcss postcss
```

The key of my setup is the usage of a "async nunjuck template filter" that processes a css string by applying postcss to it.

`.eleventy.js`

```js
module.exports = eleventyConfig => {
  // Registering a async filter to all nunjuck templates
  // unfortunally it didn't saw the possiblity to register
  // 'global' async filters (say for all other templating engines
  // but I'm fine with this solution
  eleventyConfig.addNunjucksAsyncFilter('postcss', (cssCode, done) => {
    // Here is where the magic will happen
  })
}
```

The snippet above shows how to register the filter with the name 'postcss' - configured with the first parameter (if you read the 11ty docs might guess the source for my inspiration). The second parameter is the callback that will actually run the filter, it receives the `cssCode`to process and a `done` callback which must be called in order to tell the template engine that the filter finished.

Before you are going to implement the actual body of the filter you should integrate the css to your template in order get better understanding what happens when the filter is invoked. I added the following snippet into the default layout `content/_includes/layouts/index.njk`:

{% raw %}
```html
  <head>
    <!-- capture the CSS content as a Nunjucks variable -->
    {% set css %}
    {% include "styles/index.css" %}
    {% endset %}
    <!-- feed it through our postcss filter to minify -->
    <style>
      {{css | postcss | safe}}
    </style>
  </head>
```
{% endraw %}

This technique includes two steps in the 11ty build pipeline:

- Including the css file to "postprocess" but persist its contents in the variable `css` rather than writing it to the output file
- Writing the contents of the variable `css` within a style tag in the head section of your document by applying the `postcss` filter to it

The approach implies that your CSS is directly included into your document and this comes (like the most things in computer engineering) with up- and down sides which we'll discuss later.

## Integrate PostCSS in the Filter

No it‘s time to add the actual code for the `postcss` filter. Fortunately PostCSS provides a relatively simple programmatic api which we use to postprocess the CSS contents.

`.eleventy.js`

```js
module.exports = eleventyConfig => {
  eleventyConfig.addNunjucksAsyncFilter('postcss', (cssCode, done) => {
    postCss([
      // plugins can be added heres
    ])
    .process(cssCode)
    .then(
      r => done(null, r.css),
      e => done(e, null)
    )
  })
}
```

Since the filter callback provides it‘s own `done` callback rather than allowing to return a promise, it‘s necessary to invoke it within the `then` function of the promise returned from `process`

## Add Tailwindcss

One of the coolest „plugins“ in PostCSS is [Tailwindcss], a _utility first css framework_. And with the current setup it is pretty easy to add this feature to the pipeline:

`.eleventy.js`

```js
const tailwind = require(„tailwindcss“)

module.exports = eleventyConfig => {
  eleventyConfig.addNunjucksAsyncFilter('postcss', (cssCode, done) => {
    postCss([
      tailwind({
        // configuration for tailwind can be added here
      })
    ])
    .process(cssCode)
    .then(
      r => done(null, r.css),
      e => done(e, null)
    )
  })
}
```

It‘s possible to add additional configuration for tailwind. For a (mostly) markdown based blogging environment like 11ty I'd add the [@tailwindcss/typography]() plugin:

```js
  tailwind({
    plugins: [
      require('@tailwindcss/typography')
    ]
  })
```

And that's it! You can now add the Tailwind directives to `styles/index.css` and start to build your design.

## One more thing

You might encounter that the changes in css doens't trigger a rebuild of 11ty. This is because the file is (probably) neither in the input directory nor having a known fileextension. Fortunately 11ty provides a simple configuration method to close this gap:

```js
  eleventyConfig.addWatchTarget("styles/**/*.css");
```

The method registers a new glob which tells 11ty to watch for changes and rebuild when ever they happen.

## Alternative / Extension

The result of the presented approach is that all CSS is inlined within every document rather than loaded as external resource. TBH, it might not have a too big impact in a small blogging setup with a small amount of CSS like this blog in the moment (to have really small css, some more postcss plugins are required like purgecss and minifycss). But maybe your use-case is different or you're just curios.

The [11ty quick tip about CSS concatenation](https://www.11ty.dev/docs/quicktips/concatenate/) shows an approach to bundle CSS data into a separate CSS File which can be loaded traditionally in `<link />` tag.

Here is an incomplete +/- list for for inlined CSS:

**Advantages:**

- (Critical) is always loaded as the document is loaded successfully
- Page can be distributed as a single file
- Reducing HTTP overhead a bit for a single page request (caching might make this point obsolete on subsequent requests or navigation on the  page)

**Disadvantages:**

- CSS is send on every page request and can not be cached individually be the browser
- Document size increases for every document

The approach to create the inline CSS combined with the `permalink` configuration of 11ty makes it handy to implement a loadable css file. Just create a template file and roughly add the following contents:

{% raw %}
```md
---
permalink: theme.css
---

{% set css %}
  {% include "styles/index.css" %}
  {% include "styles/prism-theme.css" %}
{% endset %}
{{css | postcss | safe}}

```
{% endraw %}

Now the css can be loaded as a file with: `<link rel="stylesheet" href="/theme.css" />`
