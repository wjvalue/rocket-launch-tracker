// =========================================================
// 粒子背景系统 · 深空极简
// 克制模式: 80 粒子(桌面) / 25 粒子(移动) · 缓速漂移 · 鼠标轻吸引
// =========================================================
window.RT = window.RT || {};
RT.ParticleField = (function () {

  let canvas, ctx, particles = [], raf = null;
  let width = 0, height = 0, dpr = 1;
  let mouse = { x: -9999, y: -9999, active: false };
  let lastFrame = 0, fps = 60, frameCount = 0, fpsTimer = 0;
  let burstQueue = []; // 详情开合时的粒子爆发
  let isMobile = false;
  let reducedMotion = false;

  const CONFIG = {
    desktop: { count: 80, maxSpeed: 0.25, sizeMin: 0.4, sizeMax: 1.8, alphaMin: 0.1, alphaMax: 0.5, connectDist: 110 },
    mobile:  { count: 25, maxSpeed: 0.18, sizeMin: 0.4, sizeMax: 1.4, alphaMin: 0.1, alphaMax: 0.4, connectDist: 0 }
  };

  function pickConfig() {
    return isMobile ? CONFIG.mobile : CONFIG.desktop;
  }

  function rand(min, max) { return min + Math.random() * (max - min); }

  function createParticle() {
    const cfg = pickConfig();
    return {
      x: Math.random() * width,
      y: Math.random() * height,
      vx: rand(-cfg.maxSpeed, cfg.maxSpeed),
      vy: rand(-cfg.maxSpeed, cfg.maxSpeed),
      size: rand(cfg.sizeMin, cfg.sizeMax),
      alpha: rand(cfg.alphaMin, cfg.alphaMax),
      alphaDir: Math.random() > 0.5 ? 1 : -1,
      alphaSpeed: rand(0.001, 0.004)
    };
  }

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function initParticles() {
    const cfg = pickConfig();
    particles = [];
    for (let i = 0; i < cfg.count; i++) particles.push(createParticle());
  }

  function updateParticle(p, dt) {
    // 鼠标轻微吸引(非跟随)
    if (mouse.active && !isMobile) {
      const dx = mouse.x - p.x;
      const dy = mouse.y - p.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 120 && dist > 0) {
        const force = (1 - dist / 120) * 0.02;
        p.vx += (dx / dist) * force;
        p.vy += (dy / dist) * force;
      }
    }
    // 速度阻尼
    p.vx *= 0.99;
    p.vy *= 0.99;
    // 最低速度保持漂移
    const sp = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
    const cfg = pickConfig();
    if (sp < 0.05) {
      p.vx += rand(-0.05, 0.05);
      p.vy += rand(-0.05, 0.05);
    }
    p.x += p.vx;
    p.y += p.vy;
    // 边界回绕
    if (p.x < -10) p.x = width + 10;
    if (p.x > width + 10) p.x = -10;
    if (p.y < -10) p.y = height + 10;
    if (p.y > height + 10) p.y = -10;
    // 透明度呼吸
    p.alpha += p.alphaDir * p.alphaSpeed * dt;
    const cfgA = pickConfig();
    if (p.alpha > cfgA.alphaMax) { p.alpha = cfgA.alphaMax; p.alphaDir = -1; }
    if (p.alpha < cfgA.alphaMin) { p.alpha = cfgA.alphaMin; p.alphaDir = 1; }
  }

  function drawParticle(p) {
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255, 255, 255, ' + p.alpha + ')';
    ctx.fill();
    // 微弱光晕(仅大粒子)
    if (p.size > 1.2) {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * 2.5, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255, 255, 255, ' + (p.alpha * 0.15) + ')';
      ctx.fill();
    }
  }

  function drawConnections() {
    if (isMobile) return;
    const cfg = pickConfig();
    const dist = cfg.connectDist;
    if (!dist) return;
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < dist) {
          const alpha = (1 - d / dist) * 0.06;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = 'rgba(255, 255, 255, ' + alpha + ')';
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
  }

  function drawBursts(dt) {
    for (let i = burstQueue.length - 1; i >= 0; i--) {
      const b = burstQueue[i];
      b.life -= dt * 0.001;
      if (b.life <= 0) { burstQueue.splice(i, 1); continue; }
      const progress = 1 - b.life;
      const r = b.maxRadius * progress;
      const alpha = b.life * 0.4;
      ctx.beginPath();
      ctx.arc(b.x, b.y, r, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(255, 255, 255, ' + alpha + ')';
      ctx.lineWidth = 1;
      ctx.stroke();
    }
  }

  function loop(ts) {
    if (!lastFrame) lastFrame = ts;
    const dt = Math.min(ts - lastFrame, 50); // 限制 dt 防卡顿跳跃
    lastFrame = ts;

    // FPS 监控
    frameCount++;
    fpsTimer += dt;
    if (fpsTimer >= 1000) {
      fps = frameCount;
      frameCount = 0;
      fpsTimer = 0;
      // 低 FPS 自动降级
      if (fps < 30 && !isMobile) {
        isMobile = true;
        initParticles();
      }
    }

    ctx.clearRect(0, 0, width, height);
    drawConnections();
    for (const p of particles) {
      updateParticle(p, dt);
      drawParticle(p);
    }
    drawBursts(dt);

    raf = requestAnimationFrame(loop);
  }

  function start() {
    if (raf) cancelAnimationFrame(raf);
    lastFrame = 0;
    raf = requestAnimationFrame(loop);
  }

  function stop() {
    if (raf) cancelAnimationFrame(raf);
    raf = null;
  }

  function onMouseMove(e) {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    mouse.active = true;
  }
  function onMouseLeave() {
    mouse.active = false;
    mouse.x = -9999;
    mouse.y = -9999;
  }

  // 公开 API: 触发粒子爆发(详情开合)
  function burst(x, y, opts) {
    opts = opts || {};
    burstQueue.push({
      x: x, y: y,
      maxRadius: opts.radius || 80,
      life: 1.0
    });
  }

  function init(canvasId) {
    canvas = document.getElementById(canvasId);
    if (!canvas) return;
    ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 检测降级条件
    reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    isMobile = window.matchMedia('(max-width: 768px)').matches || ('ontouchstart' in window);

    if (reducedMotion) {
      // 静态绘制少量粒子,无动画
      resize();
      initParticles();
      ctx.clearRect(0, 0, width, height);
      particles.forEach(drawParticle);
      return;
    }

    resize();
    initParticles();

    window.addEventListener('resize', () => {
      resize();
      // 重新检测移动端
      const newMobile = window.matchMedia('(max-width: 768px)').matches;
      if (newMobile !== isMobile) {
        isMobile = newMobile;
        initParticles();
      }
    });
    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('mouseout', onMouseLeave);

    start();
  }

  return { init, burst, stop, getFps: () => fps };
})();
