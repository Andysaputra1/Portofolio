import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createSnakeJourney, initialSnake, journeyTarget } from '../src/utils/scrollSnake.ts';
import { SNAKE_LENGTH, snakeSegmentColor } from '../src/utils/snakeAppearance.ts';

test('one connected body leaves its exact hero positions, then stays in three right columns', () => {
  const body = initialSnake(16);
  const journey = createSnakeJourney(body, 16, 17);
  assert.ok(journey);
  assert.deepEqual(journey.path.slice(0, SNAKE_LENGTH).reverse(), body);
  journey.indexAtRow(300);
  assert.equal(new Set(journey.path.map(point => point.column + ',' + point.row)).size, journey.path.length);
  journey.path.forEach((point, index) => {
    if (index > journey.departureEnd) assert.ok(point.column >= 13 && point.column <= 15);
    if (!index) return;
    const before = journey.path[index - 1];
    assert.equal(Math.abs(point.column - before.column) + Math.abs(point.row - before.row), 1);
  });
});

test('random turns are remembered when scrolling back and differ on another visit', () => {
  const journey = createSnakeJourney(initialSnake(16), 16, 17);
  const earlier = journey.indexAtRow(20.5);
  const trail = journey.path.slice(earlier - SNAKE_LENGTH + 1, earlier + 1);
  journey.indexAtRow(300);
  assert.equal(journey.indexAtRow(20.5), earlier);
  assert.deepEqual(journey.path.slice(earlier - SNAKE_LENGTH + 1, earlier + 1), trail);
  const other = createSnakeJourney(initialSnake(16), 16, 99);
  other.indexAtRow(20.5);
  assert.notDeepEqual(journey.path.slice(0, 40), other.path.slice(0, 40));
});

test('departure waits for 65% of the hero and the whole tail exits at the bottom', () => {
  for (const viewport of [720, 900, 1080]) {
    for (const cell of [80, 96, 120, 160]) {
      const journey = createSnakeJourney(initialSnake(16), 16, 17);
      assert.equal(journeyTarget(journey, 0, viewport, viewport, 9000, cell), journey.start);
      for (const scroll of [10, viewport * .5, viewport * .65]) {
        assert.equal(journeyTarget(journey, scroll, viewport, viewport, 9000, cell), journey.start);
      }
      assert.ok(journeyTarget(journey, viewport * .65 + 10, viewport, viewport, 9000, cell) > journey.start);
      const end = journeyTarget(journey, 9000, viewport, viewport, 9000, cell);
      const tail = journey.path.slice(end - SNAKE_LENGTH + 1, end + 1);
      assert.ok(tail.every(point => point.row * cell - 9000 > viewport));
    }
  }
});

test('shared palette fades from amber to the exact dark hero grid color', () => {
  assert.equal(snakeSegmentColor(0), 'rgb(150, 106, 58)');
  assert.equal(snakeSegmentColor(17), 'rgb(27, 25, 22)');
});
