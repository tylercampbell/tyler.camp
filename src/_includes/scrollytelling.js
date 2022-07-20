sm.addEventListener('load', function () {
  // init controller
  var controller = new ScrollMagic.Controller({globalSceneOptions: {duration: 0}});

  // build scenes
  new ScrollMagic.Scene({triggerElement: "#gallery"})
    // .addIndicators() // add indicators (requires plugin)
    .setClassToggle("header", "opacity-30") // add class toggle
  .addTo(controller);
});
