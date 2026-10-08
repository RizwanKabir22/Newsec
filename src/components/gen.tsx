import { memo, useEffect, useRef, useState } from 'react';

const reduced = () => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;

/**
 * Types `text` out character by character with a soft caret, like a model streaming tokens.
 * `play=false` renders the full text at once (used when the content was already generated).
 */
export const Typewriter = memo(function Typewriter({ text, play, delay = 0, cps = 48 }: { text: string; play: boolean; delay?: number; cps?: number }) {
  const [n, setN] = useState(play && !reduced() ? 0 : text.length);
  const done = n >= text.length;
  const start = useRef(0);

  useEffect(() => {
    if (!play || reduced()) { setN(text.length); return; }
    setN(0);
    let raf = 0;
    start.current = performance.now() + delay;
    const step = (now: number) => {
      // chunk 1–3 characters per tick so it reads like token streaming, not a metronome
      const k = Math.max(0, Math.floor(((now - start.current) / 1000) * cps));
      setN(Math.min(text.length, k));
      if (k < text.length) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [text, play, delay, cps]);

  return (
    <span className="tw" aria-label={text}>
      <span aria-hidden="true">{text.slice(0, n)}</span>
      {!done && <span className="tw__caret" aria-hidden="true" />}
    </span>
  );
});

/** Tweens a number to its new value. */
export const CountUp = memo(function CountUp({ value, format, ms = 520 }: { value: number; format: (v: number) => string; ms?: number }) {
  const [shown, setShown] = useState(value);
  const from = useRef(value);

  useEffect(() => {
    if (reduced() || from.current === value) { from.current = value; setShown(value); return; }
    const a = from.current, t0 = performance.now();
    let raf = 0;
    const step = (now: number) => {
      const q = Math.min(1, (now - t0) / ms), e = 1 - Math.pow(1 - q, 3);
      const v = a + (value - a) * e;
      setShown(v);
      if (q < 1) raf = requestAnimationFrame(step); else from.current = value;
    };
    raf = requestAnimationFrame(step);
    return () => { cancelAnimationFrame(raf); from.current = value; };
  }, [value, ms]);

  // round to the half-hour grid the values live on, so the tween never shows odd decimals at rest
  return <>{format(Math.abs(shown - value) < 0.01 ? value : Math.round(shown * 10) / 10)}</>;
});
