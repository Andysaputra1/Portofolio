import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
} from "react";

const SNAKE_LENGTH = 18;

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
      className="hero-grid"
      id="home"
      aria-labelledby="hero-title"
      style={
        { "--hero-cols": columns } as CSSProperties &
          Record<"--hero-cols", number>
      }
    >
      {Array.from({ length: cellCount }).map((_, index) => {
        const snakeIndex = snakeCells.get(index);
        return (
          <span
            aria-hidden="true"
            key={index}
            data-cell={index}
            onPointerEnter={() => {
              targetRef.current = index;
            }}
            className={
              snakeIndex === undefined
                ? ""
                : `is-snake snake-segment-${Math.min(4, Math.floor(snakeIndex / 4))} ${snakeIndex === 0 ? "is-snake-head" : ""}`
            }
          />
        );
      })}
      <div className="hero-text">
        <div className="hero-eyebrow"><span className="status-dot" /> A mind for technology. An eye for possibility.</div>
        <h1 id="hero-title">Andy<br /><span>Saputra.</span></h1>
        <p className="hero-description">Turning curiosity into meaningful digital experiences. <br />Computer science, intelligent systems & a little creativity.</p>
        <div className="hero-actions">
          <a href="#projects" className="hero-cta">
            <span>Explore my work</span>
            <i className="fa-solid fa-arrow-right" aria-hidden="true" />
          </a>
          <a href="#contact" className="hero-secondary">Let’s connect <span aria-hidden="true">↗</span></a>
        </div>
      </div>
      <div className="hero-bottom"><span>PORTFOLIO / ANDY SAPUTRA</span><a href="#about">Scroll to discover <span aria-hidden="true">↓</span></a><span className="grid-hint">Move your cursor. Follow the squares.</span></div>
    </section>
  );
}
