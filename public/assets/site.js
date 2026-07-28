/* PARHAM FADAEI — site behaviors
   1. Network Crown hero animation (scattered points → crowned network)
   2. Scroll reveals
*/

(function () {
  "use strict";

  /* ---------- scroll reveal ---------- */
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && revealEls.length) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("in"); });
  }

  /* ---------- network crown ---------- */
  var canvas = document.getElementById("crown-canvas");
  if (!canvas) return;

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var ctx = canvas.getContext("2d");
  var dpr = Math.min(window.devicePixelRatio || 1, 2);
  var W, H;

  var GOLD = "210, 171, 99";
  var PAPER = "234, 227, 209";

  // Crown silhouette: five peaks over a band, expressed in unit space.
  // Anchor nodes sit on the band and the peak tips; drift nodes wander nearby.
  var CROWN = [
    // band (base of the crown)
    { x: 0.20, y: 0.86 }, { x: 0.35, y: 0.88 }, { x: 0.50, y: 0.89 },
    { x: 0.65, y: 0.88 }, { x: 0.80, y: 0.86 },
    // valleys between peaks
    { x: 0.275, y: 0.60 }, { x: 0.425, y: 0.56 }, { x: 0.575, y: 0.56 }, { x: 0.725, y: 0.60 },
    // peak tips
    { x: 0.20, y: 0.34 }, { x: 0.35, y: 0.22 }, { x: 0.50, y: 0.12 },
    { x: 0.65, y: 0.22 }, { x: 0.80, y: 0.34 }
  ];

  // Edges tracing the crown outline + a few internal cross-links (capital flows).
  var EDGES = [
    [0, 1], [1, 2], [2, 3], [3, 4],          // band
    [0, 9], [9, 5], [5, 10], [10, 6],        // left peaks
    [6, 11], [11, 7],                        // center peak
    [7, 12], [12, 8], [8, 13], [13, 4],      // right peaks
    [5, 1], [6, 2], [7, 3], [8, 3],          // struts to band
    [10, 11], [11, 12],                      // tip-to-tip signal lines
    [9, 1], [13, 3]
  ];

  var nodes = [];
  var dust = [];
  var DUST_COUNT = 46;

  function sizeCanvas() {
    var rect = canvas.getBoundingClientRect();
    W = rect.width;
    H = rect.height;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function crownFrame() {
    // Crown drawing area centered, with margins.
    var cw = Math.min(W * 0.62, 560);
    var chh = H * 0.78;
    var ox = (W - cw) / 2;
    var oy = H * 0.08;
    return { cw: cw, ch: chh, ox: ox, oy: oy };
  }

  function init() {
    sizeCanvas();
    var f = crownFrame();

    nodes = CROWN.map(function (p, i) {
      return {
        hx: f.ox + p.x * f.cw,
        hy: f.oy + p.y * f.ch,
        x: f.ox + p.x * f.cw,
        y: f.oy + p.y * f.ch,
        phase: (i * 137.5) % (Math.PI * 2),
        amp: 2.2 + (i % 3),
        tip: p.y < 0.4
      };
    });

    dust = [];
    for (var i = 0; i < DUST_COUNT; i++) {
      // Deterministic-ish scatter derived from index (no layout jumps on resize).
      var a = i * 2.399963; // golden angle
      var r = 0.18 + 0.8 * ((i * 0.6180339887) % 1);
      dust.push({
        x: W / 2 + Math.cos(a) * r * W * 0.46,
        y: H * 0.5 + Math.sin(a) * r * H * 0.52,
        vx: Math.cos(a * 1.7) * 0.08,
        vy: Math.sin(a * 1.3) * 0.06,
        s: 0.6 + ((i * 0.414) % 1) * 1.1
      });
    }
  }

  function draw(t) {
    ctx.clearRect(0, 0, W, H);
    var sec = t / 1000;

    // drifting dust — the scattered, unmapped points
    for (var i = 0; i < dust.length; i++) {
      var d = dust[i];
      if (!reduceMotion) {
        d.x += d.vx; d.y += d.vy;
        if (d.x < -10) d.x = W + 10; if (d.x > W + 10) d.x = -10;
        if (d.y < -10) d.y = H + 10; if (d.y > H + 10) d.y = -10;
      }
      ctx.beginPath();
      ctx.arc(d.x, d.y, d.s, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(" + PAPER + ", 0.16)";
      ctx.fill();
    }

    // node positions with a slow breathing drift
    for (var n = 0; n < nodes.length; n++) {
      var nd = nodes[n];
      if (reduceMotion) {
        nd.x = nd.hx; nd.y = nd.hy;
      } else {
        nd.x = nd.hx + Math.cos(sec * 0.5 + nd.phase) * nd.amp;
        nd.y = nd.hy + Math.sin(sec * 0.4 + nd.phase) * nd.amp;
      }
    }

    // edges — the drawn map
    for (var e = 0; e < EDGES.length; e++) {
      var a = nodes[EDGES[e][0]], b = nodes[EDGES[e][1]];
      var grad = ctx.createLinearGradient(a.x, a.y, b.x, b.y);
      grad.addColorStop(0, "rgba(" + GOLD + ", 0.34)");
      grad.addColorStop(0.5, "rgba(" + GOLD + ", 0.14)");
      grad.addColorStop(1, "rgba(" + GOLD + ", 0.34)");
      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(b.x, b.y);
      ctx.strokeStyle = grad;
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    // signal pulses travelling along edges
    if (!reduceMotion) {
      for (var p = 0; p < EDGES.length; p += 3) {
        var pa = nodes[EDGES[p][0]], pb = nodes[EDGES[p][1]];
        var prog = (sec * 0.22 + p * 0.13) % 1;
        var px = pa.x + (pb.x - pa.x) * prog;
        var py = pa.y + (pb.y - pa.y) * prog;
        ctx.beginPath();
        ctx.arc(px, py, 1.6, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(" + GOLD + ", 0.75)";
        ctx.fill();
      }
    }

    // nodes — brass rivets; tips glow brighter
    for (var k = 0; k < nodes.length; k++) {
      var nk = nodes[k];
      var pulse = reduceMotion ? 0.5 : (Math.sin(sec * 1.2 + nk.phase) + 1) / 2;
      var rr = nk.tip ? 3.4 + pulse * 1.2 : 2.4 + pulse * 0.7;

      // halo
      var halo = ctx.createRadialGradient(nk.x, nk.y, 0, nk.x, nk.y, rr * 5);
      halo.addColorStop(0, "rgba(" + GOLD + ", " + (nk.tip ? 0.28 : 0.14) + ")");
      halo.addColorStop(1, "rgba(" + GOLD + ", 0)");
      ctx.beginPath();
      ctx.arc(nk.x, nk.y, rr * 5, 0, Math.PI * 2);
      ctx.fillStyle = halo;
      ctx.fill();

      ctx.beginPath();
      ctx.arc(nk.x, nk.y, rr, 0, Math.PI * 2);
      ctx.fillStyle = nk.tip ? "rgba(236, 201, 135, 0.95)" : "rgba(" + GOLD + ", 0.9)";
      ctx.fill();
    }

    if (!reduceMotion) requestAnimationFrame(draw);
  }

  var resizeTimer;
  window.addEventListener("resize", function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      init();
      if (reduceMotion) draw(0);
    }, 120);
  });

  init();
  if (reduceMotion) {
    draw(0);
  } else {
    requestAnimationFrame(draw);
  }
})();
