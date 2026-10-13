export const SNAKE_LENGTH = 18;

// The same amber-to-dark palette is used for the entire body, in both locations.
export function snakeSegmentColor(index: number) {
  const strength = Math.pow(1 - index / (SNAKE_LENGTH - 1), 1.1);
  const head = [150, 106, 58];
  const tail = [27, 25, 22];
  return 'rgb(' + head.map((value, channel) => Math.round(tail[channel] + (value - tail[channel]) * strength)).join(', ') + ')';
}
