/**
 * Motion layer: entrance reveals and micro-interactions, ported from the prototype's motion.js.
 *
 * Everything runs on the Web Animations API and only animates compositor-friendly properties
 * (transform, opacity, filter, clip-path), so React never re-renders for an animation frame.
 * Elements opt in through data attributes:
 *   data-reveal  card that fades/rises in when scrolled into view (and lifts on hover)
 *   data-count   big number that counts up when its card reveals
 *   data-hbar    horizontal bar that grows from the left
 *   data-bar     vertical bar that grows up (time chart)
 *   data-cal     calendar cell that pops in
 *   data-seg     gate-track segment that fills in order
 *   data-row     attention row (slide in, hover tilt, slide out on clear)
 *   data-hseg    health-bar segment in the glass card
 *   data-pulse   orange alert dot with an ambient pulse
 * All of it is skipped when the user prefers reduced motion.
 */

const EASE = 'cubic-bezier(.2,.8,.2,1)';
const SPRING = 'cubic-bezier(.34,1.56,.64,1)';

const reduced = () => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;

function anim(el: Element, kf: Keyframe[], o: KeyframeAnimationOptions): Animation | null {
  try {
    const a = el.animate(kf, { easing: EASE, fill: 'both', ...o });
    a.finished.catch(() => {});
    return a;
  } catch {
    return null;
  }
}

const done = new WeakSet<Element>();
const qa = <T extends Element = HTMLElement>(root: ParentNode, sel: string) => Array.from(root.querySelectorAll<T & Element>(sel)) as T[];

function countUp(el: Element, delay: number) {
  const txt = el.firstChild && el.firstChild.nodeType === Node.TEXT_NODE ? (el.firstChild as Text) : null;
  if (!txt) return;
  const m = /^([+−-]?)(\d+(?:[.,]\d+)?)(%?)$/.exec((txt.nodeValue ?? '').trim());
  if (!m) return;
  const final = txt.nodeValue!;
  const sep = m[2].includes(',') ? ',' : '.';
  const end = parseFloat(m[2].replace(',', '.'));
  const dec = (m[2].split(sep)[1] || '').length;
  const t0 = performance.now() + delay;
  const dur = 1100;
  let last = final;
  const step = (now: number) => {
    // React re-rendered this node with a new value mid-count: stop and leave its value alone.
    if (txt.nodeValue !== last) return;
    const p = Math.min(1, Math.max(0, (now - t0) / dur));
    const e = 1 - Math.pow(1 - p, 4);
    last = p < 1 ? m[1] + (end * e).toFixed(dec).replace('.', sep) + m[3] : final;
    txt.nodeValue = last;
    if (p < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

function revealCard(card: HTMLElement, i: number) {
  const d = 120 + i * 70;
  anim(card, [{ opacity: 0, transform: 'translateY(28px) scale(.985)', filter: 'blur(10px)' }, { opacity: 1, transform: 'none', filter: 'blur(0)' }], { duration: 820, delay: d, fill: 'backwards' });
  qa(card, '[data-count]').forEach(n => countUp(n, d + 120));
  qa(card, '[data-hbar]').forEach((b, k) => {
    b.style.transformOrigin = 'left center';
    anim(b, [{ transform: 'scaleX(0)' }, { transform: 'scaleX(1)' }], { duration: 900, delay: d + 200 + k * 40, fill: 'backwards' });
  });
  qa(card, '[data-bar]').forEach((b, k) => {
    b.style.transformOrigin = 'bottom';
    anim(b, [{ transform: 'scaleY(0)' }, { transform: 'scaleY(1)' }], { duration: 800, delay: d + 220 + k * 70, easing: SPRING, fill: 'backwards' });
  });
  qa(card, '[data-cal]').forEach((c, k) =>
    anim(c, [{ opacity: 0, transform: 'scale(.6)' }, { opacity: 1, transform: 'none' }], { duration: 480, delay: d + 260 + k * 22, easing: SPRING, fill: 'backwards' }));
  qa(card, '[data-seg]').forEach((s, k) => {
    s.style.transformOrigin = 'left';
    anim(s, [{ transform: 'scaleX(0)' }, { transform: 'scaleX(1)' }], { duration: 520, delay: d + 300 + k * 90, fill: 'backwards' });
  });
  qa(card, '[data-row]').forEach((r, k) =>
    anim(r, [{ opacity: 0, transform: 'translateX(-14px)' }, { opacity: 1, transform: 'none' }], { duration: 560, delay: d + 220 + k * 70, fill: 'backwards' }));
}

function initReveal(root: HTMLElement): () => void {
  if (reduced()) return () => {};
  const cards = qa(root, '[data-reveal]').filter(c => !done.has(c));

  const hdr = root.querySelector('[data-hdr]');
  if (hdr && !done.has(hdr)) {
    done.add(hdr);
    Array.from(hdr.children).forEach((c, k) =>
      anim(c, [{ opacity: 0, transform: 'translateY(-12px)' }, { opacity: 1, transform: 'none' }], { duration: 600, delay: k * 90, fill: 'backwards' }));
  }

  const hero = root.querySelector('[data-hero]');
  if (hero && !done.has(hero)) {
    done.add(hero);
    anim(hero, [
      { filter: 'saturate(.5) brightness(.75) blur(6px)', clipPath: 'inset(0 0 0 0 round 32px)', opacity: 0.4 },
      { filter: 'none', clipPath: 'inset(0 0 0 0 round 32px)', opacity: 1 },
    ], { duration: 2200, easing: 'cubic-bezier(.16,1,.3,1)', fill: 'backwards' });
    qa(root, '[data-stagger] > *').forEach((c, k) =>
      anim(c, [
        { opacity: 0, transform: 'translateY(18px)', clipPath: 'inset(0 0 100% 0)' },
        { opacity: 1, transform: 'none', clipPath: 'inset(0 0 -20% 0)' },
      ], { duration: 900, delay: 250 + k * 120, fill: 'backwards' }));
    const g = root.querySelector('[data-glass]');
    if (g) {
      anim(g, [{ opacity: 0, transform: 'translateX(30px) rotateY(-8deg)', filter: 'blur(14px)' }, { opacity: 1, transform: 'none', filter: 'blur(0)' }], { duration: 1100, delay: 420, fill: 'backwards' });
      qa(g, '[data-hseg]').forEach((s, k) =>
        anim(s, [{ opacity: 0, transform: 'scaleX(.4)' }, { opacity: 1, transform: 'none' }], { duration: 700, delay: 900 + k * 90, easing: SPRING, fill: 'backwards' }));
      qa(g, '[data-count]').forEach(n => countUp(n, 700));
    }
  }

  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      const t = e.target as HTMLElement;
      if (e.isIntersecting && !done.has(t)) {
        done.add(t);
        revealCard(t, Math.max(0, cards.indexOf(t) % 4));
        io.unobserve(t);
      }
    });
  }, { threshold: 0.12 });
  cards.forEach(c => io.observe(c));
  return () => io.disconnect();
}

// ---------- micro-interactions ----------

type Press = HTMLElement & { __pressAnim?: Animation | null; __mag?: boolean };

const radiusKind = (el: Element): 'pill' | 'circle' | null => {
  const r = getComputedStyle(el).borderTopLeftRadius;
  if (r.endsWith('%')) return parseFloat(r) >= 50 ? 'circle' : null;
  return parseFloat(r) >= 999 ? 'pill' : null;
};

const isPress = (el: Element): el is Press => {
  if (!(el instanceof HTMLElement)) return false;
  if (el.tagName !== 'BUTTON' && !radiusKind(el)) return false;
  return el.offsetHeight >= 28 && el.offsetHeight <= 52 && el.offsetWidth <= 360;
};

const findPress = (t: EventTarget | null): Press | null => {
  let el = t instanceof Element ? t : null;
  if (el?.closest('[data-nopress]')) return null; // toggles animate themselves
  for (let i = 0; el && i < 5; i++, el = el.parentElement) if (isPress(el)) return el;
  return null;
};

const isCircle = (el: Element) => radiusKind(el) === 'circle';

function glint(el: HTMLElement, x: number, y: number) {
  const r = el.getBoundingClientRect();
  const dot = document.createElement('span');
  if (getComputedStyle(el).position === 'static') el.style.position = 'relative';
  const prevOv = el.style.overflow;
  el.style.overflow = 'hidden';
  const s = Math.max(r.width, r.height) * 2.2;
  dot.style.cssText = `position:absolute;pointer-events:none;left:${x - r.left - s / 2}px;top:${y - r.top - s / 2}px;width:${s}px;height:${s}px;border-radius:50%;background:radial-gradient(circle,rgba(255,255,255,.55) 0%,rgba(255,255,255,.18) 35%,rgba(255,255,255,0) 65%);mix-blend-mode:overlay;z-index:0`;
  el.appendChild(dot);
  const a = anim(dot, [{ transform: 'scale(0)', opacity: 1 }, { transform: 'scale(1)', opacity: 0 }], { duration: 650, easing: 'cubic-bezier(.2,.7,.3,1)' });
  const cleanup = () => { dot.remove(); el.style.overflow = prevOv; };
  if (a) a.onfinish = cleanup; else cleanup();
}

const leaving = (el: Element, e: PointerEvent) => !el.contains(e.relatedTarget as Node | null);

function bindMicro(root: HTMLElement): () => void {
  const down = (e: PointerEvent) => {
    const el = findPress(e.target);
    if (!el || reduced()) return;
    el.__pressAnim?.cancel();
    el.__pressAnim = anim(el, [{ transform: 'scale(1)' }, { transform: 'scale(.94)' }], { duration: 140, easing: 'cubic-bezier(.3,0,.5,1)', fill: 'forwards' });
    glint(el, e.clientX, e.clientY);
  };
  const release = (e: PointerEvent) => {
    const el = findPress(e.target);
    if (!el || !el.__pressAnim) return;
    el.__pressAnim.cancel();
    el.__pressAnim = null;
    anim(el, [{ transform: 'scale(.94)' }, { transform: 'scale(1.04)', offset: 0.55 }, { transform: 'scale(1)' }], { duration: 420, fill: 'none' });
  };

  const over = (e: PointerEvent) => {
    if (reduced()) return;
    const t = e.target as Element;
    const host = findPress(t) || t.closest?.('span,button');
    if (host && leaving(host, e)) {
      qa(host, '[data-ic="ArrowRight"],[data-ic="ArrowUpRight"]').forEach(ic => {
        const up = ic.getAttribute('data-ic') === 'ArrowUpRight';
        anim(ic, [
          { transform: 'none' },
          { transform: up ? 'translate(3px,-3px)' : 'translateX(4px)', offset: 0.45 },
          { transform: up ? 'translate(-2px,2px)' : 'translateX(-2px)', offset: 0.46, opacity: 0 },
          { transform: 'none', opacity: 1 },
        ], { duration: 520, fill: 'none' });
      });
      qa(host, '[data-ic="Bell"]').forEach(ic =>
        anim(ic, [0, 14, -12, 8, -5, 0].map(d => ({ transform: `rotate(${d}deg)` })), { duration: 620, fill: 'none', easing: 'ease-out' }));
      qa(host, '[data-ic="Plus"]').forEach(ic =>
        anim(ic, [{ transform: 'rotate(0)' }, { transform: 'rotate(90deg)' }], { duration: 380, easing: SPRING, fill: 'none' }));
      qa(host, '[data-ic="Search"]').forEach(ic =>
        anim(ic, [{ transform: 'scale(1)' }, { transform: 'scale(1.18) rotate(-8deg)' }, { transform: 'scale(1)' }], { duration: 420, fill: 'none' }));
    }
    const row = t.closest?.('[data-row]');
    if (row && leaving(row, e)) {
      const tile = row.querySelector('[data-tile]'), strip = row.querySelector('[data-strip]');
      if (tile) anim(tile, [{ transform: 'none' }, { transform: 'rotate(-6deg) scale(1.08)' }], { duration: 360, easing: SPRING, fill: 'forwards' });
      if (strip) anim(strip, [{ transform: 'scaleY(1)' }, { transform: 'scaleY(1.7)' }], { duration: 300, fill: 'forwards' });
    }
    const card = t.closest?.<HTMLElement>('[data-reveal]');
    if (card && leaving(card, e)) {
      card.style.transition = `translate .45s ${EASE}, box-shadow .45s ${EASE}`;
      card.style.translate = '0 -3px';
    }
  };

  const out = (e: PointerEvent) => {
    const t = e.target as Element;
    const row = t.closest?.('[data-row]');
    if (row && leaving(row, e)) {
      const tile = row.querySelector('[data-tile]'), strip = row.querySelector('[data-strip]');
      if (tile) anim(tile, [{ transform: 'rotate(-6deg) scale(1.08)' }, { transform: 'none' }], { duration: 300, fill: 'forwards' });
      if (strip) anim(strip, [{ transform: 'scaleY(1.7)' }, { transform: 'scaleY(1)' }], { duration: 260, fill: 'forwards' });
    }
    const card = t.closest?.<HTMLElement>('[data-reveal]');
    if (card && leaving(card, e)) card.style.translate = '0 0';

    const el = findPress(t);
    if (el && el.__mag && leaving(el, e)) {
      el.style.translate = '0 0';
      const ic = el.querySelector<HTMLElement>('[data-ic]');
      if (ic) ic.style.translate = '0 0';
      el.__mag = false;
    }
    const g = t.closest?.<HTMLElement>('[data-glass]');
    if (g && leaving(g, e)) {
      g.style.transform = 'none';
    }
  };

  // magnetic circle buttons + glass tilt/sheen, batched to one write per frame
  let frame = 0;
  let lastMove: PointerEvent | null = null;
  const applyMove = () => {
    frame = 0;
    const e = lastMove;
    if (!e || reduced()) return;
    const el = findPress(e.target);
    if (el && isCircle(el)) {
      const r = el.getBoundingClientRect();
      const dx = (e.clientX - r.left - r.width / 2) / r.width, dy = (e.clientY - r.top - r.height / 2) / r.height;
      el.style.transition = 'translate .2s ease-out';
      el.style.translate = `${dx * 6}px ${dy * 6}px`;
      const ic = el.querySelector<HTMLElement>('[data-ic]');
      if (ic) { ic.style.transition = 'translate .2s ease-out'; ic.style.translate = `${dx * 4}px ${dy * 4}px`; }
      el.__mag = true;
    }
    const g = (e.target as Element).closest?.<HTMLElement>('[data-glass]');
    if (g) {
      const r = g.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top;
      g.style.transition = `transform .5s ${EASE}`;
      g.style.transform = `perspective(1200px) rotateX(${(0.5 - y / r.height) * 3}deg) rotateY(${(x / r.width - 0.5) * 4}deg)`;
    }
  };
  const move = (e: PointerEvent) => {
    lastMove = e;
    if (!frame) frame = requestAnimationFrame(applyMove);
  };

  root.addEventListener('pointerdown', down);
  root.addEventListener('pointerup', release);
  root.addEventListener('pointercancel', release);
  root.addEventListener('pointerover', over);
  root.addEventListener('pointerout', out);
  root.addEventListener('pointermove', move, { passive: true });
  return () => {
    cancelAnimationFrame(frame);
    root.removeEventListener('pointerdown', down);
    root.removeEventListener('pointerup', release);
    root.removeEventListener('pointercancel', release);
    root.removeEventListener('pointerover', over);
    root.removeEventListener('pointerout', out);
    root.removeEventListener('pointermove', move);
  };
}

function ambient(root: HTMLElement) {
  if (reduced()) return;
  qa(root, '[data-pulse]').forEach(d =>
    anim(d, [{ boxShadow: '0 0 0 0 rgba(255,96,0,.55)' }, { boxShadow: '0 0 0 9px rgba(255,96,0,0)' }], { duration: 1800, iterations: Infinity, easing: 'ease-out', fill: 'none' }));
}

// ---------- projects-by-phase board ----------

function countInt(el: Element, delay: number) {
  const txt = el.firstChild && el.firstChild.nodeType === Node.TEXT_NODE ? (el.firstChild as Text) : null;
  const end = txt ? parseInt(txt.nodeValue ?? '', 10) : NaN;
  if (!txt || isNaN(end)) return;
  const t0 = performance.now() + delay, dur = 900;
  let last = txt.nodeValue;
  const step = (now: number) => {
    if (txt.nodeValue !== last) return;
    const q = Math.min(1, Math.max(0, (now - t0) / dur));
    last = String(q < 1 ? Math.round(end * (1 - Math.pow(1 - q, 3))) : end);
    txt.nodeValue = last;
    if (q < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

/** Cards in the phase panel slide in from the direction of travel; the selected tile gives a small bounce. */
function boardSwap(root: Element, dir: number, delay = 0) {
  if (reduced()) return;
  const dx = dir * 24;
  qa(root, '[data-pc]').forEach((c, i) => {
    anim(c, [{ opacity: 0, transform: `translate(${dx}px,12px)` }, { opacity: 1, transform: 'none' }], { duration: 560, delay: delay + 90 + i * 70, fill: 'backwards' });
    const b = c.querySelector('[data-pbar]');
    if (b) anim(b, [{ transform: 'scaleX(0)' }, { transform: 'scaleX(1)' }], { duration: 800, delay: delay + 260 + i * 70, fill: 'backwards' });
  });
  const sel = root.querySelector('[data-ptile][aria-pressed="true"]');
  if (sel && dir) {
    anim(sel, [{ transform: 'scale(.97)' }, { transform: 'scale(1.015)', offset: 0.5 }, { transform: 'none' }], { duration: 520, fill: 'none' });
    const c = sel.querySelector('[data-bcount]');
    if (c) anim(c, [{ transform: 'translateY(8px)', opacity: 0.3 }, { transform: 'none', opacity: 1 }], { duration: 500, fill: 'none', easing: SPRING });
  }
}

function boardIntro(root: HTMLElement): () => void {
  // thumbnails fan out while a tile is hovered; tiles press in when clicked
  const over = (e: PointerEvent) => {
    const tl = (e.target as Element).closest?.('[data-ptile]');
    if (!tl || !leaving(tl, e) || reduced()) return;
    qa(tl, '[data-thumb]').forEach((th, k) => { th.style.transform = `translateX(${k * 7}px)`; });
  };
  const out = (e: PointerEvent) => {
    const tl = (e.target as Element).closest?.('[data-ptile]');
    if (!tl || !leaving(tl, e)) return;
    qa(tl, '[data-thumb]').forEach(th => { th.style.transform = 'none'; });
  };
  const down = (e: PointerEvent) => {
    const tl = (e.target as Element).closest?.('[data-ptile]');
    if (tl && !reduced()) anim(tl, [{ transform: 'scale(1)' }, { transform: 'scale(.96)', offset: 0.4 }, { transform: 'scale(1)' }], { duration: 380, fill: 'none' });
  };
  root.addEventListener('pointerover', over);
  root.addEventListener('pointerout', out);
  root.addEventListener('pointerdown', down);
  const cleanup = () => {
    root.removeEventListener('pointerover', over);
    root.removeEventListener('pointerout', out);
    root.removeEventListener('pointerdown', down);
  };
  if (reduced()) return cleanup;

  const pulses = qa(root, '[data-pdot]').map(d =>
    anim(d, [{ boxShadow: '0 0 0 0 rgba(255,96,0,.5)' }, { boxShadow: '0 0 0 6px rgba(255,96,0,0)' }], { duration: 1700, iterations: Infinity, easing: 'ease-out', fill: 'none' }));

  const io = new IntersectionObserver(es => {
    if (!es[0].isIntersecting || done.has(root)) return;
    done.add(root);
    io.disconnect();
    anim(root, [{ opacity: 0, transform: 'translateY(24px)', filter: 'blur(8px)' }, { opacity: 1, transform: 'none', filter: 'blur(0)' }], { duration: 900, fill: 'backwards' });
    qa(root, '[data-rail]').forEach((r, i) => anim(r, [{ transform: 'scaleX(0)' }, { transform: 'scaleX(1)' }], { duration: 700, delay: 250 + i * 140, easing: 'cubic-bezier(.65,0,.35,1)', fill: 'backwards' }));
    qa(root, '[data-gate]').forEach((g, i) => anim(g, [{ transform: 'scale(0) rotate(-90deg)', opacity: 0 }, { transform: 'none', opacity: 1 }], { duration: 520, delay: 820 + i * 140, easing: SPRING, fill: 'backwards' }));
    qa(root, '[data-ptile]').forEach((tl, i) => {
      anim(tl, [{ opacity: 0, transform: 'translateY(26px) scale(.96)' }, { opacity: 1, transform: 'none' }], { duration: 800, delay: 300 + i * 90, fill: 'backwards' });
      qa(tl, '[data-thumb]').forEach((th, k) => anim(th, [{ opacity: 0, transform: 'translateX(-14px) scale(.6)' }, { opacity: 1, transform: 'none' }], { duration: 500, delay: 760 + i * 90 + k * 70, easing: SPRING, fill: 'backwards' }));
      const c = tl.querySelector('[data-bcount]');
      if (c) countInt(c, 500 + i * 90);
    });
    boardSwap(root, 0, 650);
  }, { threshold: 0.15 });
  io.observe(root);
  return () => { cleanup(); io.disconnect(); pulses.forEach(a => a?.cancel()); };
}

export const Motion = {
  /** Wire up reveals, micro-interactions and ambient pulses. Returns a teardown function. */
  init(root: HTMLElement): () => void {
    const stopReveal = initReveal(root);
    const stopMicro = bindMicro(root);
    const t = window.setTimeout(() => ambient(root), 1500);
    return () => { stopReveal(); stopMicro(); clearTimeout(t); };
  },
  board(root: HTMLElement): () => void { return boardIntro(root); },
  boardSwap(root: Element | null, dir: number) { if (root) requestAnimationFrame(() => boardSwap(root, dir)); },
  rows(root: ParentNode | null) {
    if (!root || reduced()) return;
    qa(root, '[data-row]').forEach((r, k) =>
      anim(r, [{ opacity: 0, transform: 'translateY(8px)' }, { opacity: 1, transform: 'none' }], { duration: 380, delay: k * 50, fill: 'backwards' }));
  },
  /** Slide a row out and collapse it, then call `cb` (which removes it from state). */
  leave(row: HTMLElement | null, cb: () => void) {
    if (!row || reduced()) return cb();
    const h = row.offsetHeight;
    const a = anim(row, [
      { opacity: 1, transform: 'none', height: h + 'px' },
      { opacity: 0, transform: 'translateX(40px) scale(.98)', height: h + 'px', offset: 0.55 },
      { opacity: 0, transform: 'translateX(40px) scale(.98)', height: '0px', marginTop: '-6px', paddingTop: '0px', paddingBottom: '0px' },
    ], { duration: 480, easing: 'cubic-bezier(.5,0,.2,1)', fill: 'forwards' });
    if (a) a.onfinish = () => { cb(); requestAnimationFrame(() => requestAnimationFrame(() => a.cancel())); };
    else cb();
  },
  pop(el: Element | null) {
    if (el && !reduced()) anim(el, [{ transform: 'scale(1)' }, { transform: 'scale(1.18)', offset: 0.35 }, { transform: 'scale(1)' }], { duration: 520, easing: SPRING, fill: 'none' });
  },
  drawer(scrim: Element | null, drawer: Element | null) {
    if (reduced()) return;
    if (scrim) anim(scrim, [{ opacity: 0 }, { opacity: 1 }], { duration: 300, fill: 'backwards' });
    if (drawer) {
      anim(drawer, [{ opacity: 0, transform: 'translateX(60px) scale(.98)', filter: 'blur(6px)' }, { opacity: 1, transform: 'none', filter: 'blur(0)' }], { duration: 620, easing: 'cubic-bezier(.16,1,.3,1)', fill: 'backwards' });
      qa(drawer, '[data-hrow]').forEach((r, k) =>
        anim(r, [{ opacity: 0, transform: 'translateY(10px)' }, { opacity: 1, transform: 'none' }], { duration: 420, delay: 180 + k * 70, fill: 'backwards' }));
    }
  },
};
