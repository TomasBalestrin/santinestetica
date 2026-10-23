/* ============================================================
   SANTIN — comparador antes/depois + revelações no scroll
   ============================================================ */

(function () {
  'use strict';

  /* ---------- Comparador antes/depois ---------- */
  var frame = document.querySelector('.reveal-frame');
  var clip  = document.getElementById('revealClip');
  var line  = document.getElementById('revealLine');
  var grip  = document.getElementById('revealGrip');

  if (frame && clip && line && grip) {
    var pct = 50;

    // A imagem "antes" precisa ter a largura do frame inteiro,
    // senão ela comprime junto com o clip e as duas metades
    // deixam de coincidir.
    function syncWidth() {
      frame.style.setProperty('--frame-w', frame.clientWidth + 'px');
    }

    function paint(p) {
      pct = Math.max(0, Math.min(100, p));
      clip.style.width = pct + '%';
      line.style.left  = pct + '%';
      grip.setAttribute('aria-valuenow', Math.round(pct));
    }

    function moveFromEvent(e) {
      var rect = frame.getBoundingClientRect();
      var x = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
      paint((x / rect.width) * 100);
    }

    var dragging = false;

    function start(e) {
      dragging = true;
      frame.classList.add('is-dragging');
      moveFromEvent(e);
    }
    function move(e) {
      if (!dragging) return;
      if (e.cancelable) e.preventDefault();
      moveFromEvent(e);
    }
    function end() {
      dragging = false;
      frame.classList.remove('is-dragging');
    }

    frame.addEventListener('mousedown', start);
    window.addEventListener('mousemove', move);
    window.addEventListener('mouseup', end);

    frame.addEventListener('touchstart', start, { passive: true });
    window.addEventListener('touchmove', move, { passive: false });
    window.addEventListener('touchend', end);

    grip.addEventListener('keydown', function (e) {
      var step = e.shiftKey ? 10 : 3;
      if (e.key === 'ArrowLeft')  { paint(pct - step); e.preventDefault(); }
      if (e.key === 'ArrowRight') { paint(pct + step); e.preventDefault(); }
      if (e.key === 'Home')       { paint(0);   e.preventDefault(); }
      if (e.key === 'End')        { paint(100); e.preventDefault(); }
    });

    window.addEventListener('resize', syncWidth);
    syncWidth();
    paint(50);

    // Abertura: a linha corre até a posição final uma vez,
    // mostrando que a imagem é arrastável sem precisar de legenda.
    var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!reduced) {
      paint(100);
      var shown = false;
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting || shown) return;
          shown = true;
          var t0 = null;
          function anim(ts) {
            if (!t0) t0 = ts;
            var k = Math.min((ts - t0) / 1100, 1);
            var ease = 1 - Math.pow(1 - k, 3);
            paint(100 - 55 * ease);
            if (k < 1 && !dragging) requestAnimationFrame(anim);
          }
          requestAnimationFrame(anim);
        });
      }, { threshold: 0.35 });
      io.observe(frame);
    }
  }

  /* ---------- Revelações no scroll ---------- */
  var targets = document.querySelectorAll(
    '.section-head, .group, .combo, .steps li, .quote, .quotes-note, .contact-copy, .contact-map'
  );

  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches && 'IntersectionObserver' in window) {
    // Só esconde o que está abaixo da dobra. O que já está visível no
    // primeiro quadro continua visível — a página nunca abre em branco
    // esperando scroll.
    targets.forEach(function (el) {
      if (el.getBoundingClientRect().top > window.innerHeight * 0.9) {
        el.classList.add('will-reveal');
      } else {
        el.classList.add('is-revealed');
      }
    });

    var revealIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        var delay = Number(el.dataset.delay || 0);
        setTimeout(function () {
          el.classList.add('is-revealed');
        }, delay);
        revealIO.unobserve(el);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    // Escalona os itens que aparecem em linha, para o olho
    // acompanhar a ordem em vez de tudo surgir de uma vez.
    document.querySelectorAll('.steps li, .quote').forEach(function (el, i) {
      el.dataset.delay = i * 90;
    });

    targets.forEach(function (el) { revealIO.observe(el); });
  }

  /* ---------- Sombra na nav ao rolar ---------- */
  var nav = document.querySelector('.nav');
  if (nav) {
    var onScroll = function () {
      nav.classList.toggle('is-stuck', window.scrollY > 12);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }
})();
