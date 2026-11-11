import { useEffect, useRef, useState, type CSSProperties } from "react";
import HeroSwing from './HeroSwing';

function getColumnCount() {
  if (window.innerWidth <= 600) return 5;
  if (window.innerWidth <= 900) return 10;
  return 16;
}

function getCellCount(columns: number) {
  const scale = Number.parseFloat(getComputedStyle(document.documentElement).zoom) || 1;
  return (
    columns * Math.ceil(Math.max(720 * scale, window.innerHeight) / (window.innerWidth / columns))
  );
}

export default function Hero() {
  const [columns, setColumns] = useState(getColumnCount);
  const [cellCount, setCellCount] = useState(() => getCellCount(getColumnCount()));
  useEffect(() => {
    const resize = () => {
      const next = getColumnCount();
      setColumns(next);
      setCellCount(getCellCount(next));
    };
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  // 0 while the hero's top is at the top of the viewport, 1 once its bottom has scrolled past it.
  // CSS turns this into the staggered drift and fade of the hero copy.
  const heroRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const hero = heroRef.current;
    const content = contentRef.current;
    if (!hero || !content) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const { top, height } = hero.getBoundingClientRect();
      const progress = Math.min(1, Math.max(0, -top / height));
      content.style.setProperty("--hero-scroll", progress.toFixed(4));
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, []);

  return (
    <section
      ref={heroRef}
      className="hero"
      id="home"
      aria-labelledby="hero-title"
      style={{ "--hero-cols": columns } as CSSProperties & Record<"--hero-cols", number>}
    >
      <div className="hero-board" aria-hidden="true">
        {Array.from({ length: cellCount }, (_, index) => <span key={index} data-cell-index={index} />)}
      </div>

      <div ref={contentRef} className="hero-content wrap">
        <h1 id="hero-title" className="hero-name">
          <span className="hero-line">Andy</span>{" "}
          <span className="hero-line">Saputra</span>
        </h1>
        <p className="hero-description"><strong className="text-emphasis">Full-stack developer</strong> and Computer Science student at BINUS University. Right now I build internal apps at <strong className="text-emphasis">Polytron</strong> and AI products at <strong className="text-emphasis">Qreed AI</strong>.</p>
        <div className="hero-actions">
          <div className="hero-swing-cta">
            <a href="#projects" className="btn btn-primary">See projects</a>
            <HeroSwing mobile />
          </div>
          <a href="#contact" className="btn btn-ghost">Get in touch</a>
        </div>
      </div>
      <HeroSwing />
      <p className="hero-hint" aria-hidden="true">Move your cursor around. The snake follows it.</p>
    </section>
  );
}
