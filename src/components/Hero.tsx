import { useEffect, useState, type CSSProperties } from "react";
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

  return (
    <section
      className="hero"
      id="home"
      aria-labelledby="hero-title"
      style={{ "--hero-cols": columns } as CSSProperties & Record<"--hero-cols", number>}
    >
      <div className="hero-board" aria-hidden="true">
        {Array.from({ length: cellCount }, (_, index) => <span key={index} data-cell-index={index} />)}
      </div>

      <div className="hero-content wrap">
        <h1 id="hero-title" className="hero-name">Andy<br />Saputra</h1>
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
