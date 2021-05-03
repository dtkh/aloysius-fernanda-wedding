document.addEventListener('DOMContentLoaded', () => {

  const elementIsVisibleInViewport = (el, partiallyVisible = false) => {
    const { top, left, bottom, right } = el.getBoundingClientRect();
    const { innerHeight, innerWidth } = window;
    return partiallyVisible
      ? ((top > 0 && top < innerHeight) ||
          (bottom > 0 && bottom < innerHeight)) &&
          ((left > 0 && left < innerWidth) || (right > 0 && right < innerWidth))
      : top >= 0 && left >= 0 && bottom <= innerHeight && right <= innerWidth;
  };

  window.onscroll = () => {
    if (document.body.scrollTop > 80 || document.documentElement.scrollTop > 80) {
      document.querySelector('#logo > svg').style.minWidth = '80px';
      document.querySelector('#logo > svg').style.maxWidth = '80px';
    } else {
      document.querySelector('#logo > svg').style.minWidth = '240px';
      document.querySelector('#logo > svg').style.maxWidth = '240px';
    }
  }
});