import { useEffect, useId, useRef, useState } from "react";
import atlas from "../images/andy-dino-build.png";
import "./DinoBuilder.css";

export default function DinoBuilder() {
  const id = useId();
  const ref = useRef<HTMLDivElement>(null);
  const art = useRef<SVGSVGElement>(null);
  const [pose, setPose] = useState(0);
  useEffect(() => {
    const motion = matchMedia('(prefers-reduced-motion: reduce)');
    let raf = 0, last = 0, elapsed = 0, visible = false, ready = false, disposed = false;
    const tick = (time: number) => {
      if (last && !document.hidden) elapsed += Math.min(time - last, 50);
      last = time;
      const t = elapsed % 8000;
      setPose(t < 1800 ? 0 : t < 3100 ? 1 : t < 4200 ? 2 : 3);
      if (art.current) art.current.style.opacity = String(t < 350 ? t / 350 : t > 7550 ? (8000 - t) / 450 : 1);
      raf = requestAnimationFrame(tick);
    };
    const update = () => {
      cancelAnimationFrame(raf); last = 0;
      if (ref.current) ref.current.dataset.paused = String(!visible || motion.matches);
      if (motion.matches) { setPose(3); if (art.current) art.current.style.opacity = '1'; }
      else if (visible && ready) raf = requestAnimationFrame(tick);
    };
    const image = new Image(); image.src = atlas;
    image.decode().catch(() => undefined).then(() => { if (!disposed) { ready = true; update(); } });
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; update(); });
    if (ref.current) observer.observe(ref.current);
    motion.addEventListener('change', update);
    return () => { disposed = true; cancelAnimationFrame(raf); observer.disconnect(); motion.removeEventListener('change', update); };
  }, []);
  return <div className="dino-builder" ref={ref} data-pose={pose} role="img" aria-label="Andy sits building a sage-green brick dinosaur, attaches its last piece, then celebrates as it comes to life.">
    <svg ref={art} viewBox="0 0 768 440" aria-hidden="true" focusable="false">
      <defs><filter id={id} x="0" y="0" width="100%" height="100%" colorInterpolationFilters="sRGB">
        <feColorMatrix in="SourceGraphic" type="matrix" values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 .2126 .7152 .0722 0 0" />
        <feComponentTransfer><feFuncA type="linear" slope="255" intercept="-18" /></feComponentTransfer>
        <feMorphology operator="dilate" radius="3" result="mask" />
        <feComposite in="SourceGraphic" in2="mask" operator="in" />
      </filter></defs>
      {['0 40 768 440', '768 40 768 440', '0 524 768 440', '768 524 768 440'].map((box, index) => <svg key={box} className="dino-pose" width="768" height="440" viewBox={box} overflow="hidden" style={{ display: pose === index ? 'block' : 'none' }}>
        <image href={atlas} width="1536" height="1024" filter={`url(#${id})`} />
      </svg>)}
      <g className="dino-sparkle" fill="#dcc497"><path d="M480 85h8v10h10v8h-10v10h-8v-10h-10v-8h10Z" /><path d="M690 150h6v8h8v6h-8v8h-6v-8h-8v-6h8Z" /></g>
    </svg>
  </div>;
}
