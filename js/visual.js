/* visual.js — IZI Storage v2
   Canvas animado de fondo (partículas suaves)
*/
(function () {
  'use strict';

  var canvas = document.getElementById('canvas-bg');
  if (!canvas || !canvas.getContext) return;

  var ctx = canvas.getContext('2d');
  var W = 0, H = 0;
  var particles = [];
  var RAF;
  var PARTICLE_COUNT = 55;
  var REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (REDUCED) {
    canvas.style.display = 'none';
    return;
  }

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function rand(a, b) { return a + Math.random() * (b - a); }

  function createParticle() {
    return {
      x: rand(0, W),
      y: rand(0, H),
      r: rand(1, 2.5),
      vx: rand(-0.18, 0.18),
      vy: rand(-0.12, 0.12),
      alpha: rand(0.06, 0.22)
    };
  }

  function init() {
    particles = [];
    for (var i = 0; i < PARTICLE_COUNT; i++) {
      particles.push(createParticle());
    }
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);

    // Subtle grid lines
    ctx.strokeStyle = 'rgba(53, 208, 255, 0.025)';
    ctx.lineWidth = 1;
    var step = 80;
    for (var x = 0; x < W; x += step) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
    }
    for (var y = 0; y < H; y += step) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
    }

    // Particles
    particles.forEach(function (p) {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(53, 208, 255, ' + p.alpha + ')';
      ctx.fill();

      p.x += p.vx;
      p.y += p.vy;

      if (p.x < -10) p.x = W + 10;
      if (p.x > W + 10) p.x = -10;
      if (p.y < -10) p.y = H + 10;
      if (p.y > H + 10) p.y = -10;
    });

    // Connection lines (short range only)
    for (var i = 0; i < particles.length; i++) {
      for (var j = i + 1; j < particles.length; j++) {
        var dx = particles[i].x - particles[j].x;
        var dy = particles[i].y - particles[j].y;
        var dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          var a = (1 - dist / 120) * 0.07;
          ctx.beginPath();
          ctx.strokeStyle = 'rgba(53, 208, 255, ' + a + ')';
          ctx.lineWidth = 0.5;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }

    RAF = requestAnimationFrame(draw);
  }

  function start() {
    resize();
    init();
    draw();
  }

  window.addEventListener('resize', function () {
    resize();
    init();
  }, { passive: true });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }

  // Pause when tab hidden
  document.addEventListener('visibilitychange', function () {
    if (document.hidden) {
      cancelAnimationFrame(RAF);
    } else {
      draw();
    }
  });

}());
