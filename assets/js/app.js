const elementIsVisibleInViewport = (el, partiallyVisible = false) => {
  const { top, left, bottom, right } = el.getBoundingClientRect();
  const { innerHeight, innerWidth } = window;
  return partiallyVisible
    ? ((top > 0 && top < innerHeight) ||
      (bottom > 0 && bottom < innerHeight)) &&
    ((left > 0 && left < innerWidth) || (right > 0 && right < innerWidth))
    : top >= 0 && left >= 0 && bottom <= innerHeight && right <= innerWidth;
};

document.addEventListener('DOMContentLoaded', () => {
  let line1 = document.getElementById('env-line-1');
  let line2 = document.getElementById('env-line-2');
  let line3 = document.getElementById('env-line-3');
  let mailIcon = document.getElementById('mail-icon');
  let envLid = document.getElementById('env-lid');
  let envPaper = document.getElementById('env-paper');

  let tl = new TimelineLite({
    paused: true,
  });

  TweenLite.defaultEase = Back.easeOut;

  tl
    .to(envLid, 0.4, {
      scaleY: -1,
      y: 1.5,
    }
    )
    .fromTo(envPaper, 0.4, {
      transformOrigin: "50% 100%",
      scaleY: 0,
    }, {
      scaleY: 1,
    }, "=-0.25")
    .staggerFromTo([line1, line2, line3], 0.4, {
      transformOrigin: "50% 50%",
      scaleX: 0
    }, {
      scaleX: 1,
    }, -0.09)

  window.onscroll = () => {
    if (document.body.scrollTop > 80 || document.documentElement.scrollTop > 80) {
      document.querySelector('#logo > svg').style.minWidth = '80px';
      document.querySelector('#logo > svg').style.maxWidth = '80px';
    } else {
      document.querySelector('#logo > svg').style.minWidth = '240px';
      document.querySelector('#logo > svg').style.maxWidth = '240px';
    }

    if ( elementIsVisibleInViewport(mailIcon) ) {
      tl.play();
    }
  }
});