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
    columns * Math.ceil(window.innerHeight / (window.innerWidth / columns))
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
    const timer = window.setInterval(() => {
      setSnake((current) => {
        const head = current[0];
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
    return () => window.clearInterval(timer);
  }, [cellCount, columns]);

  const snakeCells = useMemo(
    () => new Map(snake.map((cell, index) => [cell, index])),
    [snake],
  );

  return (
    <section
      className="hero-grid"
      id="home"
      style={
        { "--hero-cols": columns } as CSSProperties &
          Record<"--hero-cols", number>
      }
    >
      {Array.from({ length: cellCount }).map((_, index) => {
        const snakeIndex = snakeCells.get(index);
        return (
          <span
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
        <h1>ANDY SAPUTRA PORTOFOLIO</h1>
        <p className="subhead">
          “Whatever your hand finds to do, do it with your might.”
        </p>
        <div className="hero-actions">
          <a href="#about" className="hero-cta">
            <span>Explore Portfolio</span>
            <i className="fa-solid fa-arrow-right" aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  );
}
