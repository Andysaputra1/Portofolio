import { SNAKE_LENGTH } from './snakeAppearance.ts';

export const SCROLL_SNAKE_MEDIA = '(min-width: 1280px) and (prefers-reduced-motion: no-preference)';
export const SNAKE_DEPARTURE_RATIO = .65;
export type SnakeCell = { column: number; row: number };
const key = (point: SnakeCell) => point.column + ',' + point.row;

export function initialSnake(columns: number): SnakeCell[] {
  return Array.from({ length: SNAKE_LENGTH }, (_, index) => {
    const row = Math.floor(index / columns);
    const offset = index % columns;
    return { column: row % 2 ? columns - 1 - offset : offset, row };
  }).reverse();
}

// Start with the actual hero body, then remember one random route for this visit.
export function createSnakeJourney(body: SnakeCell[], columns: number, seed: number) {
  const path = body.slice().reverse();
  const start = path.length - 1;
  const blocked = new Set(body.slice(1).map(key));
  const head = body[0];
  const gate = { column: columns - 2, row: Math.max(...body.map(point => point.row)) + 1 };
  const queue = [head];
  const parents = new Map<string, SnakeCell | null>([[key(head), null]]);
  // Prefer right, then down. Avoid the existing tail instead of teleporting.
  for (let index = 0; index < queue.length && !parents.has(key(gate)); index++) {
    const point = queue[index];
    for (const [dx, dy] of [[1, 0], [0, 1], [0, -1], [-1, 0]]) {
      const next = { column: point.column + dx, row: point.row + dy };
      if (next.column < 0 || next.column >= columns || next.row < 0 || next.row > gate.row) continue;
      if (blocked.has(key(next)) || parents.has(key(next))) continue;
      parents.set(key(next), point);
      queue.push(next);
    }
  }
  // If the body encloses the head, let it move another hero step and retry.
  if (!parents.has(key(gate))) return null;
  const departure: SnakeCell[] = [];
  let point: SnakeCell | null = gate;
  while (point && key(point) !== key(head)) {
    departure.push(point);
    point = parents.get(key(point)) ?? null;
  }
  path.push(...departure.reverse());
  const departureEnd = path.length - 1;
  const rowRanges = new Map<number, { start: number; length: number }>();
  rowRanges.set(gate.row, { start: departureEnd, length: 1 });
  let row = gate.row;
  let column = gate.column;
  let straightRows = 0;
  let state = seed >>> 0;
  const random = () => {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    return state / 4294967296;
  };

  const indexAtRow = (distance: number) => {
    const targetRow = Math.max(gate.row, Math.floor(distance));
    while (row < targetRow) {
      row += 1;
      const rowStart = path.length;
      path.push({ column, row });
      if (straightRows === 0 && random() < .7) {
        const localColumn = column - (columns - 3);
        const destination = columns - 3 + (localColumn + 1 + Math.floor(random() * 2)) % 3;
        const direction = Math.sign(destination - column);
        while (column !== destination) {
          column += direction;
          path.push({ column, row });
        }
        straightRows = 1 + Math.floor(random() * 3);
      } else straightRows = Math.max(0, straightRows - 1);
      rowRanges.set(row, { start: rowStart, length: path.length - rowStart });
    }
    const range = rowRanges.get(targetRow)!;
    const fraction = Math.max(0, Math.min(.9999, distance - targetRow));
    return range.start + Math.floor(fraction * range.length);
  };
  return { path, start, departureEnd, indexAtRow };
}

export function journeyTarget(journey: NonNullable<ReturnType<typeof createSnakeJourney>>, scroll: number, viewport: number, hero: number, end: number, cell: number) {
  const departureStart = hero * SNAKE_DEPARTURE_RATIO;
  if (scroll <= departureStart) return journey.start;
  const departureProgress = Math.min(1, (scroll - departureStart) / Math.min(180, hero * .22));
  const progress = Math.min(1, scroll / Math.max(1, end));
  const exitDistance = Math.min(viewport * .8, end * .25);
  const exit = Math.max(0, Math.min(1, (scroll - end + exitDistance) / Math.max(1, exitDistance)));
  const cruisingY = viewport * (.35 + progress * .2);
  const beyondScreen = viewport + (SNAKE_LENGTH + 2) * cell;
  const headY = cruisingY + (beyondScreen - cruisingY) * exit * exit;
  const cruisingStep = journey.indexAtRow((scroll + headY) / cell);
  // Join the current scroll position gradually after the hero threshold.
  return journey.start + (cruisingStep - journey.start) * departureProgress;
}
