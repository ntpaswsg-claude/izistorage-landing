(function () {
  'use strict';

  var canvas = document.getElementById('canvas-bg');
  if (!canvas) return;

  var ctx = canvas.getContext('2d');
  if (!ctx) return;

  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) {
    canvas.style.display = 'none';
    return;
  }

  var W = 0;
  var H = 0;
  var nodes = [];
  var frameId = null;
  var isMobile = false;

  var NODE_COUNT_DESKTOP = 55;
  var NODE_COUNT_MOBILE = 22;
  var CONNECTION_DIST = 170;
  var CONNECTION_DIST_MOBILE = 120;
  var SPEED_FACTOR = 0.28;

  function getColor(alpha) {
    return 'rgba(53,208,255,' + alpha + ')';
  }

  function getColorGreen(alpha) {
    return 'rgba(44,229,155,' + alpha + ')';
  }

  function resize() {
    W = window.innerWidth;
    H = window.innerHeight;
    canvas.width = W;
    canvas.height = H;
    isMobile = W < 700;
    buildNodes();
  }

  function buildNodes() {
    var count = isMobile ? NODE_COUNT_MOBILE : NODE_COUNT_DESKTOP;
    nodes = [];
    for (var i = 0; i < count; i++) {
      var useGreen = Math.random() > 0.65;
      nodes.push({
        x: Math.random() * W,
        y: Math.random() * H,
        vx: (Math.random() - 0.5) * SPEED_FACTOR,
        vy: (Math.random() - 0.5) * SPEED_FACTOR,
        r: Math.random() * 2.2 + 1.2,
        pulse: Math.random() * Math.PI * 2,
        pulseSpeed: Math.random() * 0.018 + 0.008,
        green: useGreen,
      });
    }
  }

  function drawFrame() {
    ctx.clearRect(0, 0, W, H);

    var dist = isMobile ? CONNECTION_DIST_MOBILE : CONNECTION_DIST;

    for (var i = 0; i < nodes.length; i++) {
      var a = nodes[i];
      a.pulse += a.pulseSpeed;
      a.x += a.vx;
      a.y += a.vy;

      if (a.x < -10) a.x = W + 10;
      if (a.x > W + 10) a.x = -10;
      if (a.y < -10) a.y = H + 10;
      if (a.y > H + 10) a.y = -10;

      for (var j = i + 1; j < nodes.length; j++) {
        var b = nodes[j];
        var dx = a.x - b.x;
        var dy = a.y - b.y;
        var d = Math.sqrt(dx * dx + dy * dy);

        if (d < dist) {
          var alpha = (1 - d / dist) * 0.14;
          var color = (a.green && b.green) ? getColorGreen(alpha) : getColor(alpha);

          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = color;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }

    for (var k = 0; k < nodes.length; k++) {
      var n = nodes[k];
      var pulseFactor = 0.7 + Math.sin(n.pulse) * 0.3;
      var baseAlpha = n.green ? 0.5 : 0.45;
      var dotColor = n.green ? getColorGreen(baseAlpha * pulseFactor) : getColor(baseAlpha * pulseFactor);
      var glowColor = n.green ? getColorGreen(0.07) : getColor(0.08);

      var glowR = n.r * 3.5;
      var grd = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, glowR);
      grd.addColorStop(0, n.green ? getColorGreen(0.1) : getColor(0.12));
      grd.addColorStop(1, n.green ? getColorGreen(0) : getColor(0));

      ctx.beginPath();
      ctx.arc(n.x, n.y, glowR, 0, Math.PI * 2);
      ctx.fillStyle = grd;
      ctx.fill();

      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r * pulseFactor, 0, Math.PI * 2);
      ctx.fillStyle = dotColor;
      ctx.fill();
    }

    frameId = requestAnimationFrame(drawFrame);
  }

  function start() {
    resize();
    drawFrame();
  }

  var resizeTimer;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(resize, 180);
  });

  document.addEventListener('visibilitychange', function () {
    if (document.hidden) {
      cancelAnimationFrame(frameId);
    } else {
      drawFrame();
    }
  });

  try {
    start();
  } catch (e) {
    canvas.style.display = 'none';
  }
})();
