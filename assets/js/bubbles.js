'use strict';

/*-----------------------------------*\
  #FLOATING BUBBLES + FLUID CURSOR
\*-----------------------------------*/

(function initFluidBubbles() {
  const canvas = document.getElementById('bubbles-canvas');
  if (!canvas) return;

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const ctx = canvas.getContext('2d');

  // Gold/black theme palette (ALPHA is swapped in at draw time)
  const palette = [
    'hsla(45, 100%, 72%, ALPHA)',
    'hsla(45, 54%, 58%, ALPHA)',
    'hsla(38, 90%, 55%, ALPHA)',
    'hsla(0, 0%, 32%, ALPHA)',
    'hsla(0, 0%, 18%, ALPHA)',
    'hsla(240, 2%, 22%, ALPHA)'
  ];

  let width = 0;
  let height = 0;
  let bubbles = [];

  const mouse = { x: -9999, y: -9999, active: false };
  const follower = { x: -9999, y: -9999 };
  const trail = [];
  const TRAIL_LENGTH = 6;

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    createBubbles();
  }

  function newBubble(spawnAnywhere) {
    const radius = 6 + Math.random() * 34;
    return {
      x: Math.random() * width,
      y: spawnAnywhere ? Math.random() * height : height + radius + Math.random() * 100,
      baseRadius: radius,
      radius,
      speed: 0.15 + Math.random() * 0.5,
      drift: Math.random() * 2 - 1,
      angle: Math.random() * Math.PI * 2,
      swaySpeed: 0.002 + Math.random() * 0.006,
      color: palette[Math.floor(Math.random() * palette.length)],
      alpha: 0.08 + Math.random() * 0.22,
      vx: 0,
      vy: 0
    };
  }

  function createBubbles() {
    const count = Math.min(70, Math.max(24, Math.round((width * height) / 16000)));
    bubbles = [];
    for (let i = 0; i < count; i++) bubbles.push(newBubble(true));
  }

  function updateBubble(b) {
    b.angle += b.swaySpeed;
    b.radius = b.baseRadius + Math.sin(b.angle * 2) * 1.5;

    b.y -= b.speed;
    b.x += Math.sin(b.angle) * b.drift * 0.4 + b.vx;
    b.y += b.vy;

    b.vx *= 0.94;
    b.vy *= 0.94;

    if (mouse.active) {
      const dx = b.x - mouse.x;
      const dy = b.y - mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const influence = 140;
      if (dist < influence && dist > 0.01) {
        const force = (1 - dist / influence) * 1.6;
        b.vx += (dx / dist) * force;
        b.vy += (dy / dist) * force;
      }
    }

    if (b.y + b.radius < -20) Object.assign(b, newBubble(false));
    if (b.x < -60) b.x = width + 60;
    if (b.x > width + 60) b.x = -60;
  }

  function drawBubble(b) {
    const color = b.color.replace('ALPHA', b.alpha.toFixed(3));
    const highlight = b.color.replace('ALPHA', Math.min(1, b.alpha * 1.6).toFixed(3));

    const gradient = ctx.createRadialGradient(
      b.x - b.radius * 0.3, b.y - b.radius * 0.3, b.radius * 0.1,
      b.x, b.y, b.radius
    );
    gradient.addColorStop(0, highlight);
    gradient.addColorStop(1, color);

    ctx.beginPath();
    ctx.fillStyle = gradient;
    ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
    ctx.fill();
  }

  function updateFollower() {
    if (mouse.active) {
      follower.x += (mouse.x - follower.x) * 0.12;
      follower.y += (mouse.y - follower.y) * 0.12;
    }
    trail.unshift({ x: follower.x, y: follower.y });
    if (trail.length > TRAIL_LENGTH) trail.pop();
  }

  function drawFollower() {
    if (!mouse.active) return;

    for (let i = trail.length - 1; i >= 0; i--) {
      const point = trail[i];
      const t = i / TRAIL_LENGTH;
      const radius = 26 * (1 - t * 0.7);
      const alpha = 0.16 * (1 - t);

      const gradient = ctx.createRadialGradient(point.x, point.y, 0, point.x, point.y, radius);
      gradient.addColorStop(0, `hsla(45, 100%, 72%, ${alpha})`);
      gradient.addColorStop(0.6, `hsla(38, 90%, 55%, ${alpha * 0.6})`);
      gradient.addColorStop(1, 'hsla(38, 90%, 55%, 0)');

      ctx.beginPath();
      ctx.fillStyle = gradient;
      ctx.arc(point.x, point.y, radius, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);

    for (const b of bubbles) {
      updateBubble(b);
      drawBubble(b);
    }

    updateFollower();
    drawFollower();

    requestAnimationFrame(animate);
  }

  function setPointer(x, y) {
    mouse.x = x;
    mouse.y = y;
    if (!mouse.active) {
      follower.x = x;
      follower.y = y;
    }
    mouse.active = true;
  }

  window.addEventListener('mousemove', (e) => setPointer(e.clientX, e.clientY), { passive: true });
  window.addEventListener('mouseleave', () => { mouse.active = false; });

  window.addEventListener('touchmove', (e) => {
    if (e.touches.length) setPointer(e.touches[0].clientX, e.touches[0].clientY);
  }, { passive: true });
  window.addEventListener('touchend', () => { mouse.active = false; });

  window.addEventListener('resize', resize);

  resize();
  requestAnimationFrame(animate);
})();
