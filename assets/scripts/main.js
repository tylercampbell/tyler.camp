var tl = new TimelineLite();
tl.from("svg", 2, { opacity:0 }, 0)
  .to("#trees-fg-right", 2.5, { x:860, y:100 }, 0)
  .to("#trees-fg-left",  2.5, { x:-600, y:0 },  0)

  .from("#trees-bg", 2, { y:80, x:-20, scale:.8 }, 0)
  .from("#grass",    2, { y:-150, scale:1.2 },     0)

  .from("#tent-bg",  2, { y:-50, scale:.7 }, 0)
  .from("#tent-fg",  2, { y:-50, scale:.7 }, 0)

  .from("#flag", 1, { y:500, scaleX:0 }, 1.5)
  .from("#bell", 1, { y:500, scaleX:0 }, 1.5);
