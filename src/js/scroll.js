import LocomotiveScroll from 'locomotive-scroll';

export default new LocomotiveScroll({
  el: document.querySelector('[data-scroll-container]'),
  smooth: true,
});
