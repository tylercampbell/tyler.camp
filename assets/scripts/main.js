var tl = new TimelineLite();
tl.to("#trees-fg-right", 2.5, { x:860, y:100 }, 0)
  .to("#trees-fg-left",  2.5, { x:-600, y:0 },  0)

  .from("#trees-bg", 2, { y:80, x:20, scale:.8, opacity: 0 }, 0)
  .from("#grass",    2, { y:20 }, 0)

  .from("#tent-bg",  2, { y:40, x:-30, scale:.7, opacity: .5 }, 0)
  .from("#tent-fg",  2, { y:-50, scale:.7 }, 0)

  .from("#flag", 1, { y:500, scaleX:0 }, 1.5)
  .from("#bell", 1, { y:500, scaleX:0 }, 1.5);

function yoyo() {
    if (tl.reversed()) {
        tl.play();
    } else {
        tl.reverse();
    }
  }
