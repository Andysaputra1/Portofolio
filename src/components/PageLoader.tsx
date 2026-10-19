import { useEffect, useRef, useState } from 'react';
import NavRunner from './NavRunner';
import './PageLoader.css';

// Even a cached visit lets the runner cross the line instead of flashing.
const MIN_RUN_MS = 4000;
// A slow connection still gets the page rather than an endless loader.
const MAX_WAIT_MS = 10000;
const EXIT_MS = 500;

function loadImage(src: string) {
  return new Promise<void>((resolve) => {
    const image = new Image();
    image.onload = image.onerror = () => resolve();
    image.src = src;
  });
}

/** Covers the page until every image on it and its fonts have arrived; pixel Andy runs the progress line. */
export default function PageLoader() {
  const loaderRef = useRef<HTMLDivElement>(null);
  const [leaving, setLeaving] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const loader = loaderRef.current!;
    const html = document.documentElement;
    html.setAttribute('data-loading', '');

    // Lazy images are fetched now too, so nothing pops in later while scrolling.
    const sources = new Set<string>();
    document.querySelectorAll('img').forEach((img) => { if (img.src) sources.add(img.src); });
    document.querySelectorAll('image').forEach((image) => { const href = image.getAttribute('href'); if (href) sources.add(href); });
    const tasks = [
      ...Array.from(sources, loadImage),
      new Promise<void>((resolve) => {
        if (document.readyState === 'complete') resolve();
        else window.addEventListener('load', () => resolve(), { once: true });
      }),
      document.fonts.ready,
    ];
    let finished = 0;
    let timedOut = false;
    tasks.forEach((task) => task.then(() => { finished += 1; }));
    const timeout = window.setTimeout(() => { timedOut = true; }, MAX_WAIT_MS);

    let shown = 0;
    let previous = 0;
    let frame = 0;
    let exit = 0;
    const tick = (time: number) => {
      const target = timedOut ? 1 : finished / tasks.length;
      shown = Math.min(target, shown + (previous ? time - previous : 0) / MIN_RUN_MS);
      previous = time;
      loader.style.setProperty('--progress', String(shown));
      loader.setAttribute('aria-valuenow', String(Math.round(shown * 100)));
      if (shown < 1) { frame = requestAnimationFrame(tick); return; }
      html.removeAttribute('data-loading');
      setLeaving(true);
      exit = window.setTimeout(() => setDone(true), EXIT_MS);
    };
    frame = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(timeout);
      window.clearTimeout(exit);
      html.removeAttribute('data-loading');
    };
  }, []);

  if (done) return null;
  return (
    <div ref={loaderRef} className="page-loader" data-leaving={leaving} role="progressbar" aria-label="Loading the portfolio" aria-valuemin={0} aria-valuemax={100}>
      <div className="page-loader-track">
        <span className="page-loader-fill" />
        <span className="page-loader-runner"><NavRunner /></span>
      </div>
      <p className="page-loader-word">andy<span>.</span></p>
    </div>
  );
}
