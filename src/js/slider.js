class Slider {
  constructor() {
    this.ACTIVE_CLASS = 'active';
    this.DRAG_OFFSET = 80;

    this.mousePos = {
      x: 0,
      y: 0,
    };
    this.targetPos = {
      x: 0,
      y: 0,
    };

    this.bindings();
    this.init();
  }

  init() {
    this.control = document.querySelector('.controls');
    this.buttons = document.querySelectorAll('.years button');
    this.slides = document.querySelectorAll('.main-wrap');
    this.activeYear = Array.from(this.slides)
      .filter((slide) => slide.classList.contains(this.ACTIVE_CLASS))[0]
      .dataset.slide;

    this.addListeners();
    this.slides.forEach((slideEl) => {
      const links = slideEl.querySelectorAll('a');
      slideEl.style.setProperty('--links', links.length);
      links.forEach((link, i) => link.style.setProperty('--index', i + 1));
    });
  }

  bindings() {
    this.slide = this.slide.bind(this);
    this.startMove = this.startMove.bind(this);
    this.onMove = this.onMove.bind(this);
    this.stopMove = this.stopMove.bind(this);
  }

  addListeners() {
    this.buttons.forEach((button) => {
      button.addEventListener('click', this.slide);
    });

    this.control.addEventListener('mousedown', this.startMove);
  }

  slide({ target }) {
    if (!target) return;

    const { slide } = target.dataset;

    if (
      !target.classList.contains(this.ACTIVE_CLASS)
      || (target.classList.contains(this.ACTIVE_CLASS) && slide !== this.activeYear)
    ) {
      this.buttons.forEach((button) => button.classList.remove(this.ACTIVE_CLASS));
      target.classList.add(this.ACTIVE_CLASS);

      this.slides.forEach((slideEl) => {
        if (slideEl.dataset.slide === slide) {
          setTimeout(() => {
            slideEl.classList.add(this.ACTIVE_CLASS);
            this.activeYear = slide;
          }, 600);
        } else if (slideEl.classList.contains(this.ACTIVE_CLASS)) {
          slideEl.classList.add('fade-out');

          setTimeout(() => {
            slideEl.classList.remove(this.ACTIVE_CLASS);
            slideEl.classList.remove('fade-out');
          }, 600);
        }
      });
    }
  }

  startMove(e) {
    window.addEventListener('mouseup', this.stopMove);

    this.mousePos.x = e.clientX;
    this.mousePos.y = e.clientY;

    window.addEventListener('mousemove', this.onMove);
  }

  onMove(e) {
    this.targetPos.x = this.mousePos.x - e.clientX;
    this.targetPos.y = this.mousePos.y - e.clientY;

    if (Math.abs(this.targetPos.x) < 100 && Math.abs(this.targetPos.y) < 20) {
      this.control.style.transform = `translate(${-this.targetPos.x}px, ${-this.targetPos.y}px)`;
    }

    if (this.targetPos.x <= this.DRAG_OFFSET && this.targetPos.x >= -this.DRAG_OFFSET) {
      this.buttons.forEach((button) => {
        if (button.dataset.slide !== this.activeYear) {
          button.classList.remove(this.ACTIVE_CLASS);
        }
      });
    } else if (this.targetPos.x > this.DRAG_OFFSET) {
      Array.from(this.buttons).filter((button) => button.dataset.slide === this.activeYear)[0]
        .previousElementSibling?.classList.add(this.ACTIVE_CLASS);
    } else if (this.targetPos.x < -this.DRAG_OFFSET) {
      Array.from(this.buttons).filter((button) => button.dataset.slide === this.activeYear)[0]
        .nextElementSibling?.classList.add(this.ACTIVE_CLASS);
    }
  }

  stopMove() {
    window.removeEventListener('mousemove', this.onMove);
    this.control.style.transform = 'translate(0, 0)';

    if (this.targetPos.x > this.DRAG_OFFSET || this.targetPos.x < -this.DRAG_OFFSET) {
      const targetButton = Array.from(this.buttons)
        .filter((button) => button.classList.contains(this.ACTIVE_CLASS)
          && button.dataset.slide !== this.activeYear)[0];

      this.slide({ target: targetButton });
    }
  }
}

export default new Slider();
