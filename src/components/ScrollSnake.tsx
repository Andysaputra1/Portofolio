import { useEffect, useRef } from 'react';
import { SNAKE_LENGTH, snakeSegmentColor } from '../utils/snakeAppearance';
import { SCROLL_SNAKE_MEDIA, SNAKE_DEPARTURE_RATIO, createSnakeJourney, initialSnake, journeyTarget, type SnakeCell } from '../utils/scrollSnake';
import './ScrollSnake.css';

// One body paints both the hero tiles and their continuation below the hero.
export default function ScrollSnake() {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const overlay = overlayRef.current;
    const hero = document.getElementById('home');
    const board = hero?.querySelector<HTMLElement>('.hero-board');
    if (!overlay || !hero || !board) return;
    const desktop = window.matchMedia(SCROLL_SNAKE_MEDIA);
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    const segments = Array.from(overlay.children) as HTMLElement[];
    let tiles: HTMLElement[] = [];
    let painted: HTMLElement[] = [];
    let columns = 16;
    let body = initialSnake(columns);
    let journey: ReturnType<typeof createSnakeJourney> = null;
    let displayedStep = 0;
    let targetStep = 0;
    let hoverTarget: SnakeCell | null = null;
    let frame = 0;
    let previousTime = 0;
    let visible = true;
    let scale = 1;
    let pitch = 1;
    let originX = 0;
    let heroHeight = 1;
    let maxScroll = 1;

    const paint = () => {
      for (const tile of painted) {
        tile.classList.remove('is-snake', 'is-snake-head');
        tile.style.removeProperty('--snake-color');
      }
      painted = [];
      const points = journey
        ? Array.from({ length: SNAKE_LENGTH }, (_, index) => journey!.path[Math.floor(displayedStep) - index])
        : body;
      points.forEach((point, index) => {
        const tile = tiles[point.row * columns + point.column];
        if (tile) {
          tile.style.setProperty('--snake-color', snakeSegmentColor(index));
          tile.classList.add('is-snake');
          if (index === 0) tile.classList.add('is-snake-head');
          painted.push(tile);
        }
        segments[index].style.transform = 'translate3d(' + (originX + point.column * pitch) / scale + 'px, ' + (point.row * pitch - window.scrollY) / scale + 'px, 0)';
      });
      overlay.style.visibility = journey ? '' : 'hidden';
    };

    const tick = (time: number) => {
      frame = 0;
      if (document.hidden || !journey) return;
      const elapsed = previousTime ? Math.min(64, time - previousTime) : 16;
      previousTime = time;
      displayedStep += (targetStep - displayedStep) * (1 - Math.exp(-elapsed / 100));
      if (Math.abs(targetStep - displayedStep) < .03) displayedStep = targetStep;
      paint();
      if (displayedStep !== targetStep) frame = requestAnimationFrame(tick);
      else {
        previousTime = 0;
        if (window.scrollY <= heroHeight * SNAKE_DEPARTURE_RATIO) {
          body = journey.path.slice(0, SNAKE_LENGTH).reverse();
          journey = null;
          paint();
        }
      }
    };

    const scroll = () => {
      if (!desktop.matches || document.hidden) return;
      if (!journey && window.scrollY > heroHeight * SNAKE_DEPARTURE_RATIO) {
        journey = createSnakeJourney(body, columns, Math.floor(Math.random() * 4294967296));
        if (journey) displayedStep = journey.start;
      }
      if (!journey) return;
      targetStep = journeyTarget(journey, Math.min(maxScroll, Math.max(0, window.scrollY)), window.innerHeight, heroHeight, maxScroll, pitch);
      paint();
      if (!frame) frame = requestAnimationFrame(tick);
    };

    const measure = () => {
      tiles = Array.from(board.querySelectorAll<HTMLElement>('[data-cell-index]'));
      const nextColumns = Number(getComputedStyle(hero).getPropertyValue('--hero-cols')) || 16;
      if (columns !== nextColumns) { columns = nextColumns; body = initialSnake(columns); journey = null; }
      scale = Number.parseFloat(getComputedStyle(document.documentElement).zoom) || 1;
      const first = tiles[0]?.getBoundingClientRect();
      const second = tiles[1]?.getBoundingClientRect();
      pitch = first && second ? second.left - first.left : window.innerWidth / columns;
      originX = first?.left ?? 0;
      overlay.style.setProperty('--scroll-snake-tile', String((first?.width ?? pitch - scale) / scale) + 'px');
      heroHeight = hero.getBoundingClientRect().height;
      maxScroll = Math.max(1, document.body.getBoundingClientRect().bottom + window.scrollY - window.innerHeight);
      if (!desktop.matches) journey = null;
      paint();
      scroll();
    };

    const wander = () => {
      // A blocked departure keeps the snake moving off-screen until it can leave the hero.
      const departing = desktop.matches && window.scrollY > heroHeight * SNAKE_DEPARTURE_RATIO;
      if (reduced.matches || document.hidden || (!visible && !departing) || journey) return;
      const head = body[0];
      const neighbours = [[1, 0], [0, 1], [-1, 0], [0, -1]]
        .map(([dx, dy]) => ({ column: head.column + dx, row: head.row + dy }))
        .filter(point => point.column >= 0 && point.column < columns && point.row >= 0 && point.row * columns + point.column < tiles.length);
      let options = neighbours.filter(point => !body.slice(0, -1).some(part => part.column === point.column && part.row === point.row));
      if (!options.length) options = neighbours;
      if (!options.length) return;
      if (hoverTarget) {
        const target = hoverTarget;
        const distance = (point: SnakeCell) => Math.abs(point.column - target.column) + Math.abs(point.row - target.row);
        const closest = Math.min(...options.map(distance));
        options = options.filter(point => distance(point) === closest);
        if (closest === 0) hoverTarget = null;
      }
      body = [options[Math.floor(Math.random() * options.length)], ...body.slice(0, -1)];
      paint();
      scroll();
    };
    const pointer = (event: PointerEvent) => {
      if (!(event.target instanceof HTMLElement)) return;
      const index = Number(event.target.dataset.cellIndex);
      if (Number.isFinite(index)) hoverTarget = { column: index % columns, row: Math.floor(index / columns) };
    };
    const visibility = () => {
      cancelAnimationFrame(frame);
      frame = 0;
      previousTime = 0;
      if (!document.hidden) measure();
    };
    const resize = new ResizeObserver(measure);
    resize.observe(document.body);
    resize.observe(hero);
    const cells = new MutationObserver(measure);
    cells.observe(board, { childList: true });
    const intersection = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; });
    intersection.observe(hero);
    const timer = window.setInterval(wander, 160);
    board.addEventListener('pointerover', pointer);
    window.addEventListener('scroll', scroll, { passive: true });
    window.addEventListener('resize', measure);
    document.addEventListener('visibilitychange', visibility);
    desktop.addEventListener('change', measure);
    reduced.addEventListener('change', measure);
    measure();

    return () => {
      cancelAnimationFrame(frame);
      window.clearInterval(timer);
      resize.disconnect();
      cells.disconnect();
      intersection.disconnect();
      board.removeEventListener('pointerover', pointer);
      window.removeEventListener('scroll', scroll);
      window.removeEventListener('resize', measure);
      document.removeEventListener('visibilitychange', visibility);
      desktop.removeEventListener('change', measure);
      reduced.removeEventListener('change', measure);
      for (const tile of painted) { tile.classList.remove('is-snake', 'is-snake-head'); tile.style.removeProperty('--snake-color'); }
    };
  }, []);

  return <div ref={overlayRef} className="scroll-snake" aria-hidden="true">
    {Array.from({ length: SNAKE_LENGTH }, (_, index) => <span key={index} style={{ backgroundColor: snakeSegmentColor(index) }} />)}
  </div>;
}
