import { useEffect, useId, useRef, useState } from "react";
import atlas from "../images/andy-coffee-chat.png";
import "./CoffeeChat.css";

export default function CoffeeChat() {
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
      const t = elapsed % 7000;
      setPose(t < 1800 ? 0 : t < 3600 ? 1 : t < 4700 ? 4 : t < 5300 ? 2 : t < 6300 ? 3 : 2);
      if (art.current) art.current.style.opacity = String(t < 350 ? t / 350 : t > 6650 ? (7000 - t) / 350 : 1);
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
  return <div className="coffee-chat" ref={ref} data-pose={pose} role="img" aria-label="Andy and a friend chat over coffee, share an idea, then raise their mugs for a toast.">
    <svg ref={art} viewBox="0 -72 768 532" aria-hidden="true" focusable="false">
      <defs><filter id={id} x="0" y="0" width="100%" height="100%" colorInterpolationFilters="sRGB">
        <feColorMatrix in="SourceGraphic" type="matrix" values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 .2126 .7152 .0722 0 0" />
        <feComponentTransfer><feFuncA type="linear" slope="255" intercept="-18" /></feComponentTransfer>
        <feMorphology operator="dilate" radius="3" result="mask" />
        <feComposite in="SourceGraphic" in2="mask" operator="in" />
      </filter></defs>
      {['0 0 768 460', '768 0 768 460', '0 488 768 460', '768 488 768 460'].map((box, index) => <svg key={box} className="coffee-pose" width="768" height="460" viewBox={box} overflow="hidden" style={{ display: (pose === 4 ? 1 : pose) === index ? 'block' : 'none' }}>
        <image href={atlas} width="1536" height="1024" filter={`url(#${id})`} />
      </svg>)}
      {(pose === 0 || pose === 1) && <g className="coffee-bubble" transform={`translate(${pose === 0 ? 205 : 570} -45)`}>
        <path d="M-48 0H48V42H7L-3 52V42H-48Z" fill={pose === 0 ? '#c3d3ec' : '#d3c5e4'} />
        {[0, 1, 2].map(i => <circle key={i} className="coffee-dot" cx={-22 + i * 22} cy="21" r="5" fill="#665977" style={{ animationDelay: `${i * 160}ms` }} />)}
      </g>}
      {pose === 4 && <g className="coffee-idea" transform="translate(385 42)">
        <path d="M-22 0H22V8H30V36H18V50H-18V36H-30V8H-22Z" fill="#dfc78f" />
        <path d="M-12 53H12V61H-12Z" fill="#ab9466" />
        <path d="M-8 18L0 34L8 18M0 34V48" stroke="#886e43" strokeWidth="4" fill="none" />
        <path d="M-43 9h-12M43 9h12M0-12v-12" stroke="#dfc78f" strokeWidth="4" />
      </g>}
      {pose === 3 && <path className="coffee-clink" d="M378 169v-17m-24 29l-12-12m61 12l12-12" fill="none" stroke="#dfc78f" strokeWidth="5" />}

    </svg>
  </div>;
}
