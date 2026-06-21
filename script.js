/* ──────────────────────────────────────────
   Ahmed Nasser Portfolio — script.js v2
────────────────────────────────────────── */

// ── THEME ──
const html = document.documentElement;
const themeBtn = document.getElementById('themeToggle');
const saved = localStorage.getItem('pf-theme') || 'dark';
html.setAttribute('data-theme', saved);

themeBtn.addEventListener('click', () => {
  const next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  html.setAttribute('data-theme', next);
  localStorage.setItem('pf-theme', next);
});

// ── TYPED TEXT ──
const lines = [
  'AI & Machine Learning Engineer',
  'Computer Vision Specialist',
  'Data Analyst & BI Developer',
  'Deep Learning · PyTorch · CLIP',
];
let li = 0, ci = 0, del = false;
const typedEl = document.getElementById('typed-text');

function type() {
  const cur = lines[li];
  if (!del) {
    typedEl.textContent = cur.slice(0, ++ci);
    if (ci === cur.length) { del = true; setTimeout(type, 2000); return; }
    setTimeout(type, 60);
  } else {
    typedEl.textContent = cur.slice(0, --ci);
    if (ci === 0) { del = false; li = (li + 1) % lines.length; setTimeout(type, 400); return; }
    setTimeout(type, 30);
  }
}
type();

// ── PARTICLE CANVAS (background) ──
const canvas = document.getElementById('particle-canvas');
const ctx = canvas.getContext('2d');
let particles = [];

function resizeCanvas() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
window.addEventListener('resize', () => { resizeCanvas(); buildParticles(); }, { passive: true });
resizeCanvas();

function getAccent() {
  return html.getAttribute('data-theme') === 'dark'
    ? { r: 100, g: 149, b: 237 }
    : { r: 79,  g: 120, b: 200 };
}

class Particle {
  constructor() { this.reset(); }
  reset() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.r = Math.random() * 1.6 + 0.5;
    this.vx = (Math.random() - 0.5) * 0.4;
    this.vy = (Math.random() - 0.5) * 0.4;
    this.alpha = Math.random() * 0.5 + 0.2;
    this.aDir = Math.random() > 0.5 ? 1 : -1;
    this.aSpeed = Math.random() * 0.006 + 0.002;
  }
  update() {
    this.x += this.vx; this.y += this.vy;
    this.alpha += this.aDir * this.aSpeed;
    if (this.alpha > 0.7 || this.alpha < 0.08) this.aDir *= -1;
    if (this.x < 0) this.x = canvas.width;
    if (this.x > canvas.width) this.x = 0;
    if (this.y < 0) this.y = canvas.height;
    if (this.y > canvas.height) this.y = 0;
  }
  draw(c) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${c.r},${c.g},${c.b},${this.alpha})`;
    ctx.fill();
  }
}

function buildParticles() {
  const n = Math.min(Math.floor((canvas.width * canvas.height) / 12000), 100);
  particles = Array.from({ length: n }, () => new Particle());
}

function drawLines(c) {
  const maxD = 150;
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const d = Math.sqrt(dx * dx + dy * dy);
      if (d < maxD) {
        const a = (1 - d / maxD) * 0.3;
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.strokeStyle = `rgba(${c.r},${c.g},${c.b},${a})`;
        ctx.lineWidth = 0.7;
        ctx.stroke();
      }
    }
  }
}

function animateParticles() {
  requestAnimationFrame(animateParticles);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const c = getAccent();
  particles.forEach(p => { p.update(); p.draw(c); });
  drawLines(c);
}

if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  buildParticles();
  animateParticles();
}

// ── AURA CANVAS — neural / data-node animation behind photo ──
const auraCanvas = document.getElementById('aura-canvas');
if (auraCanvas) {
  const ac = auraCanvas.getContext('2d');
  let t = 0;
  let nodes = [];

  function resizeAura() {
    auraCanvas.width = auraCanvas.offsetWidth;
    auraCanvas.height = auraCanvas.offsetHeight;
    buildNodes();
  }

  function buildNodes() {
    const w = auraCanvas.width, h = auraCanvas.height;
    const cx = w / 2, cy = h / 2;
    const ringRadius = Math.min(w, h) * 0.46;
    const count = 14;
    nodes = Array.from({ length: count }, (_, i) => {
      const baseAngle = (i / count) * Math.PI * 2;
      return {
        baseAngle,
        radiusOffset: (Math.sin(i * 1.7) * 0.12),
        speed: 0.15 + (i % 3) * 0.05,
        phase: Math.random() * Math.PI * 2,
        size: 1.2 + Math.random() * 1.6,
      };
    });
  }

  const auraObs = new ResizeObserver(resizeAura);
  auraObs.observe(auraCanvas);
  resizeAura();

  function getAuraColor() {
    return html.getAttribute('data-theme') === 'dark'
      ? { r: 100, g: 149, b: 237 }
      : { r: 79,  g: 120, b: 200 };
  }

  function animateAura() {
    requestAnimationFrame(animateAura);
    const w = auraCanvas.width, h = auraCanvas.height;
    const cx = w / 2, cy = h / 2;
    const baseR = Math.min(w, h) * 0.46;
    const c = getAuraColor();

    ac.clearRect(0, 0, w, h);
    t += 0.012;

    // compute node positions (slowly orbiting at slightly varying radius)
    const pos = nodes.map(n => {
      const angle = n.baseAngle + t * n.speed;
      const r = baseR * (1 + n.radiusOffset * Math.sin(t * 0.5 + n.phase));
      return {
        x: cx + Math.cos(angle) * r,
        y: cy + Math.sin(angle) * r,
        size: n.size,
      };
    });

    // connecting lines between nearby nodes (neural network look)
    for (let i = 0; i < pos.length; i++) {
      for (let j = i + 1; j < pos.length; j++) {
        const dx = pos[i].x - pos[j].x;
        const dy = pos[i].y - pos[j].y;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < baseR * 0.85) {
          const alpha = (1 - d / (baseR * 0.85)) * 0.35;
          ac.beginPath();
          ac.moveTo(pos[i].x, pos[i].y);
          ac.lineTo(pos[j].x, pos[j].y);
          ac.strokeStyle = `rgba(${c.r},${c.g},${c.b},${alpha})`;
          ac.lineWidth = 0.8;
          ac.stroke();
        }
      }
    }

    // lines from nodes to center (subtle)
    pos.forEach((p, i) => {
      const alpha = 0.06 + 0.05 * Math.sin(t * 1.5 + i);
      ac.beginPath();
      ac.moveTo(cx, cy);
      ac.lineTo(p.x, p.y);
      ac.strokeStyle = `rgba(${c.r},${c.g},${c.b},${Math.max(alpha, 0.02)})`;
      ac.lineWidth = 0.5;
      ac.stroke();
    });

    // draw nodes (glowing dots)
    pos.forEach((p, i) => {
      const pulse = 0.6 + 0.4 * Math.sin(t * 2 + i * 0.7);
      const grad = ac.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 4);
      grad.addColorStop(0, `rgba(${c.r},${c.g},${c.b},${0.9 * pulse})`);
      grad.addColorStop(1, `rgba(${c.r},${c.g},${c.b},0)`);
      ac.beginPath();
      ac.arc(p.x, p.y, p.size * 4, 0, Math.PI * 2);
      ac.fillStyle = grad;
      ac.fill();

      ac.beginPath();
      ac.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ac.fillStyle = `rgba(${c.r},${c.g},${c.b},${0.9 * pulse})`;
      ac.fill();
    });

    // soft ambient glow behind everything
    const ambGrad = ac.createRadialGradient(cx, cy, baseR * 0.3, cx, cy, baseR * 1.1);
    ambGrad.addColorStop(0, `rgba(${c.r},${c.g},${c.b},0.05)`);
    ambGrad.addColorStop(1, 'transparent');
    ac.beginPath();
    ac.arc(cx, cy, baseR * 1.1, 0, Math.PI * 2);
    ac.fillStyle = ambGrad;
    ac.fill();
  }

  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    animateAura();
  }
}

// ── NAVBAR SCROLL ──
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.style.boxShadow = window.scrollY > 20 ? '0 4px 24px rgba(0,0,0,0.2)' : 'none';
}, { passive: true });

// ── ACTIVE NAV ──
document.head.insertAdjacentHTML('beforeend', `<style>.nav-links a.active{color:var(--accent)!important;background:var(--accent-dim)!important}</style>`);

const sectionEls = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

sectionEls.forEach(s => {
  new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting)
        navLinks.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#' + e.target.id));
    });
  }, { threshold: 0.35 }).observe(s);
});

// ── SCROLL FADE-IN ──
const obs = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); } });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

const fadeTargets = [
  '.section-eyebrow', '.section-title', '.about-text-block p',
  '.skill-group', '.project-card', '.timeline-item',
  '.cert-card', '.contact-card',
  '.hero-badge', '.hero-name', '.hero-title', '.hero-desc', '.hero-cta', '.hero-visual',
];
fadeTargets.forEach(sel => {
  document.querySelectorAll(sel).forEach((el, i) => {
    el.classList.add('fade-in');
    el.style.transitionDelay = `${i * 0.05}s`;
    obs.observe(el);
  });
});

// ── SMOOTH SCROLL ──
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const t = document.querySelector(a.getAttribute('href'));
    if (t) { e.preventDefault(); t.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
  });
});
