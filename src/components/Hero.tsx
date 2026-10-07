import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import HeroSwing from './HeroSwing';

const SNAKE_LENGTH = 18;

// Warm amber head fading into the board's cell color.
function segmentColor(index: number) {
  const strength = Math.pow(1 - index / (SNAKE_LENGTH - 1), 1.1);
  const head = [150, 106, 58];
  const tail = [27, 25, 22];
  return `rgb(${head.map((value, channel) => Math.round(tail[channel] + (value - tail[channel]) * strength)).join(', ')})`;
}

function getColumnCount() {
  if (window.innerWidth <= 600) return 5;
  if (window.innerWidth <= 900) return 10;
  return 16;
}

function getCellCount(columns: number) {
  return (
    columns * Math.ceil(Math.max(720, window.innerHeight) / (window.innerWidth / columns))
  );
}

function neighbours(index: number, columns: number, cellCount: number) {
  const row = Math.floor(index / columns);
  const column = index % columns;
  const result: number[] = [];
  if (column > 0) result.push(index - 1);
  if (column < columns - 1) result.push(index + 1);
  if (row > 0) result.push(index - columns);
  if (index + columns < cellCount) result.push(index + columns);
  return result;
}

function distance(a: number, b: number, columns: number) {
  return (
    Math.abs(Math.floor(a / columns) - Math.floor(b / columns)) +
    Math.abs((a % columns) - (b % columns))
  );
}

export default function Hero() {
  const [columns, setColumns] = useState(getColumnCount);
  const [cellCount, setCellCount] = useState(() =>
    getCellCount(getColumnCount()),
  );
  const [snake, setSnake] = useState(() =>
    Array.from({ length: SNAKE_LENGTH }, (_, index) => SNAKE_LENGTH - index),
  );
  const targetRef = useRef<number | null>(null);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const updateColumns = () => {
      const nextColumns = getColumnCount();
      setColumns(nextColumns);
      setCellCount(getCellCount(nextColumns));
    };
    window.addEventListener("resize", updateColumns);
    return () => window.removeEventListener("resize", updateColumns);
  }, []);

  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let visible = true;
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; });
    if (sectionRef.current) observer.observe(sectionRef.current);
    const timer = window.setInterval(() => {
      if (motion.matches || !visible || document.hidden) return;
      setSnake((current) => {
        const head = current[0] % cellCount;
        let options = neighbours(head, columns, cellCount).filter(
          (cell) => !current.slice(0, -1).includes(cell),
        );
        if (options.length === 0)
          options = neighbours(head, columns, cellCount);
        const target = targetRef.current;
        let next: number;

        if (target !== null && target !== head) {
          const closest = Math.min(
            ...options.map((cell) => distance(cell, target, columns)),
          );
          const guided = options.filter(
            (cell) => distance(cell, target, columns) === closest,
          );
          next = guided[Math.floor(Math.random() * guided.length)];
        } else {
          targetRef.current = null;
          next = options[Math.floor(Math.random() * options.length)];
        }
        return [next, ...current.slice(0, SNAKE_LENGTH - 1)];
      });
    }, 160);
    return () => { window.clearInterval(timer); observer.disconnect(); };
  }, [cellCount, columns]);

  const snakeCells = useMemo(
    () => new Map(snake.map((cell, index) => [cell, index])),
    [snake],
  );

  return (
    <section
      ref={sectionRef}
      className="hero"
      id="home"
      aria-labelledby="hero-title"
      style={{ "--hero-cols": columns } as CSSProperties & Record<"--hero-cols", number>}
    >
      <div className="hero-board" aria-hidden="true">
        {Array.from({ length: cellCount }).map((_, index) => {
          const snakeIndex = snakeCells.get(index);
          return (
            <span
              key={index}
              style={snakeIndex === undefined ? undefined : { '--snake-color': segmentColor(snakeIndex) } as CSSProperties}
              onPointerEnter={() => {
                targetRef.current = index;
              }}
              className={
                snakeIndex === undefined
                  ? undefined
                  : `is-snake${snakeIndex === 0 ? " is-snake-head" : ""}`
              }
            />
          );
        })}
      </div>

      <div className="hero-content wrap">
        <h1 id="hero-title" className="hero-name">Andy<br />Saputra</h1>
        <p className="hero-description">Full-stack developer and Computer Science student at BINUS University. Right now I build internal apps at Polytron and the Qreed AI website.</p>
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
