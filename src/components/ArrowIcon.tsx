import { FiArrowDown, FiArrowLeft, FiArrowRight, FiArrowUpRight } from "react-icons/fi";

const icons = { "up-right": FiArrowUpRight, down: FiArrowDown, left: FiArrowLeft, right: FiArrowRight };

// SVG keeps arrows independent of the device's font and emoji rendering.
export default function ArrowIcon({ direction = "up-right" }: { direction?: keyof typeof icons }) {
  const Icon = icons[direction];
  return <Icon aria-hidden="true" focusable="false" style={{ width: "1em", height: "1em", verticalAlign: "-0.125em", flexShrink: 0 }} />;
}
