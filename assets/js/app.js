document.addEventListener('DOMContentLoaded', () => {
  window.onscroll = () => {
    if ( document.body.scrollTop > 50 || document.documentElement.scrollTop > 50 ) {
      document.querySelector('#logo > svg').style.minWidth = '80px';
      document.querySelector('#logo > svg').style.maxWidth = '80px';
    } else {
      document.querySelector('#logo > svg').style.minWidth = '120px';
      document.querySelector('#logo > svg').style.maxWidth = '120px';
    }
  }
});