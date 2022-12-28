const revealDataToAttributes = (data = {}) => Object.entries(data).map(([attr, val]) => `data-${attr}="${val}"`).join(" ")

class Slides {
  data() {
    return {
      layout: 'html',
      "scripts": ["/slides.js"],
      styles: ['/reveal-css/reveal.css', '/reveal-css/theme/black.css', '//cdnjs.cloudflare.com/ajax/libs/highlight.js/10.5.0/styles/darcula.min.css']
    }
  }

  render({
    collections,
    page,
    ...props
  }) {
    const slides = collections.slides
      .filter(({
        url: slideUrl
      }) => {
        return slideUrl.startsWith(page.url) && slideUrl !== page.url
      })


    return `
      <div class="reveal">
        <div class="slides">
          ${slides.map((p) =>(`
            <section ${revealDataToAttributes(p.data.reveal)}>${p.data.content}</section>
          `)).join("")}
        </div>
      </div>
    `

  }
}

module.exports = Slides
