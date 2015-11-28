var tl = new TimelineLite();
tl.to("#trees-fg-right", 2.5, { x:860, y:100 }, 1)
  .to("#trees-fg-left",  2.5, { x:-600, y:0 },  1)

  .from("#trees-bg", 2, { y:80, x:20, scale:.8, opacity: 0 }, 1)
  .from("#grass",    2, { y:20 }, 1)

  .from("#tent-bg",  2, { y:40, x:-30, scale:.7, opacity: .5 }, 1)
  .from("#tent-fg",  2, { y:-50, scale:.7 }, 1)

  .from("#flag", 1, { y:500, scaleX:0 }, 2.5)
  .from("#bell", 1, { y:500, scaleX:0 }, 2.5);
