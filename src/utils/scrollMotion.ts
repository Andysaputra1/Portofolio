// Scroll motion shared by the sections. Both helpers are ref callbacks, so an element opts in with
// `ref={reveal}` or `ref={parallax}` and the CSS in index.css does the rest.

const STAGGER_MS = 80;
const MAX_STAGGER_STEPS = 5;

let revealObserver: IntersectionObserver | undefined;

function getRevealObserver() {
  revealObserver ??= new IntersectionObserver((entries) => {
    // Elements that come into view together appear one after another, in page order.
    let step = 0;
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      const node = entry.target as HTMLElement;
      node.style.setProperty("--reveal-delay", `${Math.min(step++, MAX_STAGGER_STEPS) * STAGGER_MS}ms`);
      node.dataset.revealed = "";
      revealObserver?.unobserve(node);
    }
  }, { rootMargin: "0px 0px -10% 0px" });
  return revealObserver;
}

// Shows the element once, when its top passes 10% above the bottom of the viewport.
// Pair it with data-reveal="up" (fade and rise) or data-reveal="line" (section heads).
export function reveal(node: HTMLElement | null) {
  if (!node || "revealed" in node.dataset) return;
  if (typeof IntersectionObserver === "undefined") {
    node.dataset.revealed = "";
    return;
  }
  const observer = getRevealObserver();
  observer.observe(node);
  return () => observer.unobserve(node);
}

const parallaxNodes = new Set<HTMLElement>();
let parallaxFrame = 0;
let listening = false;

// --parallax runs from 0 while the frame's top meets the bottom of the viewport to 1 once its
// bottom leaves the top. The frame is measured, not the image, because the image is the one moving.
function updateParallax() {
  parallaxFrame = 0;
  const viewport = window.innerHeight;
  const nodes = [...parallaxNodes];
  // Measure everything first, then write, so the browser lays out once per frame.
  const progress = nodes.map((node) => {
    const { top, height } = (node.parentElement ?? node).getBoundingClientRect();
    return Math.min(1, Math.max(0, (viewport - top) / (viewport + height)));
  });
  nodes.forEach((node, index) => node.style.setProperty("--parallax", progress[index].toFixed(4)));
}

function scheduleParallax() {
  if (!parallaxFrame) parallaxFrame = requestAnimationFrame(updateParallax);
}

// Drifts an image inside its frame as the page scrolls. The frame needs overflow: hidden.
export function parallax(node: HTMLElement | null) {
  if (!node) return;
  parallaxNodes.add(node);
  if (!listening) {
    listening = true;
    window.addEventListener("scroll", scheduleParallax, { passive: true });
    window.addEventListener("resize", scheduleParallax);
  }
  scheduleParallax();
  return () => { parallaxNodes.delete(node); };
}
