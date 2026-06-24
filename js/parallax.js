const Parallax = {
  scrollProgress: 0,
  mouseX: 0.5,
  mouseY: 0.5,
  targetMX: 0.5,
  targetMY: 0.5,
  entranceDone: false,
  isMobile: false,

  init() {
    this.isMobile = window.matchMedia('(max-width: 767px)').matches;
    this.setupScroll();
    this.setupMouse();
    this.setupEntrance();
  },

  setupScroll() {
    const container = document.getElementById('parallaxContainer');
    if (!container) return;

    const onScroll = () => {
      const scrollTop = window.scrollY;
      const maxScroll = container.scrollHeight - window.innerHeight;
      this.scrollProgress = maxScroll > 0 ? Math.min(scrollTop / maxScroll, 1) : 0;
      this.updateLayers();
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  },

  setupMouse() {
    if (this.isMobile) return;

    const onMove = (e) => {
      this.targetMX = e.clientX / window.innerWidth;
      this.targetMY = e.clientY / window.innerHeight;
    };

    window.addEventListener('mousemove', onMove, { passive: true });

    const loop = () => {
      this.mouseX += (this.targetMX - this.mouseX) * 0.07;
      this.mouseY += (this.targetMY - this.mouseY) * 0.07;
      this.updateMouseParallax();
      requestAnimationFrame(loop);
    };
    loop();
  },

  setupEntrance() {
    const cover = document.getElementById('layerCover');
    const door = document.getElementById('layerDoor');
    const nebula = document.getElementById('layerNebula');
    const lp = document.getElementById('layerPlantL');
    const rp = document.getElementById('layerPlantR');

    if (door) { door.style.transform = 'rotateY(0deg)'; door.style.opacity = '1'; }
    if (nebula) nebula.style.transform = 'scale(1)';
    if (lp) lp.style.transform = 'translateX(0)';
    if (rp) rp.style.transform = 'translateX(0)';

    setTimeout(() => {
      if (cover) {
        cover.style.transition = 'opacity 1.2s ease';
        cover.style.opacity = '0';
      }
    }, 5000);

    setTimeout(() => {
      if (cover) cover.style.display = 'none';
      this.entranceDone = true;
      this.updateEntrance();
    }, 6000);
  },

  updateEntrance() {
    if (!this.entranceDone) return;
    const lp = document.getElementById('layerPlantL');
    const rp = document.getElementById('layerPlantR');

    lp.style.transform = 'translateX(0)';
    rp.style.transform = 'translateX(0)';
    lp.style.transition = 'none';
    rp.style.transition = 'none';

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (lp) { lp.style.transition = 'transform 2s cubic-bezier(0.16, 1, 0.3, 1)'; lp.style.transform = 'translateX(-35%)'; }
        if (rp) { rp.style.transition = 'transform 2s cubic-bezier(0.16, 1, 0.3, 1)'; rp.style.transform = 'translateX(35%)'; }
      });
    });

    setTimeout(() => {
      if (lp) lp.style.transition = 'none';
      if (rp) rp.style.transition = 'none';
    }, 2200);
  },

  lerp(a, b, t) { return a + (b - a) * t; },
  clamp(v, min, max) { return Math.max(min, Math.min(max, v)); },
  easeInOut(t) { return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t; },

  updateLayers() {
    const p = this.scrollProgress;
    const ep = this.easeInOut(p);

    const nebula = document.getElementById('layerNebula');
    const door = document.getElementById('layerDoor');
    const lp = document.getElementById('layerPlantL');
    const rp = document.getElementById('layerPlantR');
    const entries = document.getElementById('ritualEntries');

    if (nebula) {
      const scale = this.lerp(1, 1.15, ep);
      nebula.style.transform = `scale(${scale})`;
    }

    if (door && this.entranceDone) {
      const openDeg = this.lerp(0, -95, this.clamp(p / 0.7, 0, 1));
      door.style.transform = `rotateY(${openDeg}deg)`;
      door.style.opacity = this.clamp(1 - (p - 0.5) / 0.4, 0.3, 1);
    }

    if (lp && this.entranceDone) {
      const extraX = this.lerp(0, 20, this.clamp(p / 0.8, 0, 1));
      lp.style.transform = `translateX(calc(-35% - ${extraX}%))`;
    }

    if (rp && this.entranceDone) {
      const extraX = this.lerp(0, 20, this.clamp(p / 0.8, 0, 1));
      rp.style.transform = `translateX(calc(35% + ${extraX}%))`;
    }

    if (entries) {
      entries.style.opacity = this.clamp((p - 0.5) / 0.25, 0, 1);
      entries.style.transform = `translateY(${this.lerp(40, 0, this.clamp((p - 0.5) / 0.25, 0, 1))}px)`;
    }
  },

  updateMouseParallax() {
    if (this.isMobile) return;
    const mx = (this.mouseX - 0.5) * 2;
    const my = (this.mouseY - 0.5) * 2;

    const nebula = document.getElementById('layerNebula');
    const door = document.getElementById('layerDoor');
    const lp = document.getElementById('layerPlantL');
    const rp = document.getElementById('layerPlantR');

    if (nebula) nebula.style.marginLeft = `${mx * 8}px`;
    if (door && this.entranceDone) door.style.marginLeft = `${mx * 12}px`;
    if (lp && this.entranceDone) lp.style.marginLeft = `${mx * 20}px`;
    if (rp && this.entranceDone) rp.style.marginLeft = `${mx * 20}px`;
  }
};
