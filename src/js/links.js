const lerp = (a, b, n) => (1 - n) * a + n * b;

class Links {
  constructor() {
    this.ACTIVE_CLASS = 'active';

    this.rootPos = {
      x: 0,
      y: 0,
    };
    this.mousePos = {
      x: 0,
      y: 0,
    };
    this.targetPos1 = {
      x: 0,
      y: 0,
      lerp: 0.06,
    };
    this.targetPos2 = {
      x: 0,
      y: 0,
      lerp: 0.12,
    };

    this.bindings();
    this.init();
  }

  bindings() {
    this.onMove = this.onMove.bind(this);
    this.render = this.render.bind(this);
  }

  init() {
    this.links = document.querySelectorAll('.main-wrap a');

    this.links.forEach((link) => link.addEventListener('mouseenter', this.handleMouseEnter.bind(this)));
    this.links.forEach((link) => link.addEventListener('mouseleave', this.handleMouseLeave.bind(this)));
  }

  render() {
    // img 1
    this.targetPos1.x = lerp(this.targetPos1.x, this.mousePos.x, this.targetPos1.lerp);
    this.targetPos1.y = lerp(this.targetPos1.y, this.mousePos.y, this.targetPos1.lerp);
    this.images[0].style.transform = `translate(${this.targetPos1.x / 2}px, ${this.targetPos1.y / 2}px)`;

    // img 2
    this.targetPos2.x = lerp(this.targetPos2.x, this.mousePos.x, this.targetPos2.lerp);
    this.targetPos2.y = lerp(this.targetPos2.y, this.mousePos.y, this.targetPos2.lerp);
    this.images[1].style.transform = `translate(${this.targetPos2.x / 4}px, ${this.targetPos2.y / 4}px)`;

    this.raf = requestAnimationFrame(this.render);
  }

  onMove({ clientX, clientY }) {
    this.mousePos.x = this.rootPos.x - clientX;
    this.mousePos.y = this.rootPos.y - clientY;

    if (!this.raf) this.raf = requestAnimationFrame(this.render);
  }

  handleMouseEnter({ target, clientX, clientY }) {
    this.images = target.parentNode.querySelectorAll('img');
    this.rootPos.x = clientX;
    this.rootPos.y = clientY;

    target.classList.add(this.ACTIVE_CLASS);
    window.addEventListener('mousemove', this.onMove);
  }

  handleMouseLeave({ target }) {
    target.classList.remove(this.ACTIVE_CLASS);
    window.removeEventListener('mousemove', this.onMove);
    this.raf = null;
  }
}

export default new Links();
