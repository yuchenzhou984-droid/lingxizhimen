const STAR_COUNT = 120;
const canvas = document.getElementById('starsCanvas');
const ctx = canvas.getContext('2d');
let stars = [];

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

function createStars() {
  stars = [];
  for (let i = 0; i < STAR_COUNT; i++) {
    stars.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.2 + 0.3,
      opacity: Math.random(),
      speed: Math.random() * 0.008 + 0.003,
      phase: Math.random() * Math.PI * 2
    });
  }
}

function drawStars() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (const s of stars) {
    const flicker = Math.sin(Date.now() * s.speed + s.phase);
    const alpha = s.opacity * 0.6 + flicker * 0.2;

    ctx.beginPath();
    ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(232,213,183,${Math.max(0.05, alpha)})`;
    ctx.fill();

    if (s.r > 0.9) {
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r * 2.5, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(232,213,183,${Math.max(0.01, alpha * 0.25)})`;
      ctx.fill();
    }
  }

  requestAnimationFrame(drawStars);
}

window.addEventListener('resize', () => {
  resize();
  createStars();
});

resize();
createStars();
drawStars();
