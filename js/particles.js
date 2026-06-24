const NebulaParticles = {
  canvas: null,
  ctx: null,
  particles: [],

  init() {
    this.canvas = document.getElementById('particleCanvas');
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.resize();
    this.createParticles();
    window.addEventListener('resize', () => this.resize());
    this.draw();
  },

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.createParticles();
  },

  createParticles() {
    this.particles = [];
    const w = this.canvas.width;
    const h = this.canvas.height;

    for (let i = 0; i < 30; i++) {
      this.particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 1.6 + 0.4,
        opacity: Math.random() * 0.6 + 0.2,
        speed: Math.random() * 0.3 + 0.1,
        phase: Math.random() * Math.PI * 2,
        twinkleSpeed: Math.random() * 0.02 + 0.005
      });
    }

    for (let i = 0; i < 15; i++) {
      this.particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 2.5 + 1,
        opacity: Math.random() * 0.3 + 0.1,
        speed: Math.random() * 0.15 + 0.05,
        phase: Math.random() * Math.PI * 2,
        twinkleSpeed: Math.random() * 0.01 + 0.003,
        isDust: true
      });
    }
  },

  draw() {
    if (!this.ctx) return;
    const ctx = this.ctx;
    const w = this.canvas.width;
    const h = this.canvas.height;

    ctx.clearRect(0, 0, w, h);

    for (const p of this.particles) {
      const flicker = Math.sin(Date.now() * p.twinkleSpeed + p.phase);
      const alpha = p.opacity * 0.5 + flicker * 0.25;

      if (p.isDust) {
        p.y -= p.speed;
        if (p.y < -20) { p.y = h + 20; p.x = Math.random() * w; }
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(220,210,255,${Math.max(0.02, alpha)})`;
        ctx.fill();
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * 3, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(180,160,220,${Math.max(0.01, alpha * 0.3)})`;
        ctx.fill();
      } else {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(232,213,183,${Math.max(0.03, alpha)})`;
        ctx.fill();
        if (p.r > 1) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r * 3, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(232,213,183,${Math.max(0.01, alpha * 0.2)})`;
          ctx.fill();
        }
      }
    }

    requestAnimationFrame(() => this.draw());
  }
};
