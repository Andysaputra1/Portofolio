import { useEffect, useId, useRef, useState } from "react";
import "./TeamLead.css";
import finishSprite from "../images/andy-team-finish.png";
import teamSprite from "../images/andy-team-sprites.png";

function Teammate({ index, pose, maskId, finish }: { index: number; pose: number; maskId: string; finish: boolean }) {
  // Each pose uses its own baseline so feet stay on the section divider.
  const rowTop = [20, 369, 716][pose];
  return <svg className={`team-person ${index === 3 ? "team-leader" : ""}`} x={index * 84} y="30" width="90" height="88" viewBox={`${index * 362} ${rowTop} 362 354`} overflow="hidden">
    <image href={finish && pose === 2 ? finishSprite : teamSprite} width="1448" height="1086" filter={`url(#${maskId})`} />
  </svg>;
}

export default function TeamLead({ finish = false }: { finish?: boolean }) {
  const maskId = useId();
  const [pose, setPose] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const groupRef = useRef<SVGGElement>(null);
  const [phase, setPhase] = useState("walk");
  useEffect(() => {
    const motion = matchMedia('(prefers-reduced-motion: reduce)');
    let frame = 0, elapsed = 0, previous = 0, visible = false;
    const tick = (time: number) => {
      if (previous && !document.hidden) elapsed += Math.min(time - previous, 50);
      previous = time;
      const duration = finish ? 5800 : 7000;
      const t = elapsed % duration;
      const next = finish ? (t < 2400 ? 'walk' : 'celebrate') : t < 1200 ? 'walk' : t < 2000 ? 'guide' : t < 3600 ? 'idea' : 'walk';
      setPose(next === 'walk' ? Math.floor(t / 320) % 2 : 2);
      setPhase(current => current === next ? current : next);
      const x = finish ? 20 + Math.min(t / 2400, 1) * 16 : t < 1200 ? t / 1200 * 12 : t < 3600 ? 12 : 12 + (t - 3600) / 3400 * 24;
      groupRef.current?.setAttribute('transform', `translate(${x} 0)`);
      if (groupRef.current) groupRef.current.style.opacity = String(t < 500 ? t / 500 : t > duration - 800 ? (duration - t) / 800 : 1);
      frame = requestAnimationFrame(tick);
    };
    const update = () => {
      cancelAnimationFrame(frame); previous = 0;
      if (ref.current) ref.current.dataset.paused = String(!visible || motion.matches);
      if (motion.matches) {
        setPhase(finish ? 'celebrate' : 'idea');
        setPose(2);
        groupRef.current?.setAttribute('transform', 'translate(24 0)');
        if (groupRef.current) groupRef.current.style.opacity = '1';
      } else if (visible) frame = requestAnimationFrame(tick);
    };
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; update(); });
    if (ref.current) observer.observe(ref.current);
    motion.addEventListener('change', update);
    return () => { observer.disconnect(); cancelAnimationFrame(frame); motion.removeEventListener('change', update); };
  }, [finish]);
  return <div className={`team-lead-scene${finish ? " team-finish-scene" : ""}`} ref={ref} data-phase={phase} role="img" aria-label={finish ? "Andy and his team reach the finish flag and celebrate together. Hooray!" : "Pixel Andy leads three teammates, pauses to share an idea, then they continue together."}>
    <svg viewBox="0 0 400 118" aria-hidden="true" focusable="false">
      <defs>
        <filter id={maskId} x="0" y="0" width="100%" height="100%" colorInterpolationFilters="sRGB">
          <feColorMatrix in="SourceGraphic" type="matrix" values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 .2126 .7152 .0722 0 0" />
          <feComponentTransfer><feFuncA type="linear" slope="255" intercept="-18" /></feComponentTransfer>
          <feMorphology operator="dilate" radius="3" result="characterMask" />
          <feComposite in="SourceGraphic" in2="characterMask" operator="in" />
        </filter>
      </defs>
      {finish && <g className="team-finish-flag" transform="translate(365 22)">
        <defs><clipPath id={`${maskId}-flag`}><path d="M2 0H14V3H31V31H18V28H2Z" /></clipPath></defs>
        <path d="M-2 0H2V94H-2Z" fill="#8a7254" />
        <path d="M-1 0V93" stroke="#e0c69b" />
        <path d="M-7 94H7V96H-7Z" fill="#ad9270" />
        <g className="team-flag-cloth">
          <path d="M2 0H14V3H31V31H18V28H2Z" fill="#eee5d5" stroke="#c4ae8d" strokeWidth="1" />
          <g clipPath={`url(#${maskId}-flag)`}>
            {Array.from({ length: 20 }, (_, i) => (Math.floor(i / 4) + i % 4) % 2 === 0 && <rect key={i} x={2 + i % 4 * 8} y={Math.floor(i / 4) * 7} width="8" height="7" fill="#3c3b45" />)}
            <path d="M14 0V29" stroke="#000" strokeOpacity=".18" strokeWidth="3" />
          </g>
        </g>
        <path d="M-3-6H3V-1H-3Z" fill="#e1c18a" />
        <path d="M-2-6H2V-4H-2Z" fill="#f7e3be" />
      </g>}
      <g ref={groupRef}>
        {[0, 1, 2, 3].map(index => <Teammate key={index} index={index} pose={pose} maskId={maskId} finish={finish} />)}
        <g style={finish ? { display: "none" } : undefined} className="team-idea" transform="translate(297 4)">
          <path d="M-9 2H9v3h3v12H8v4H-8v-4h-4V5h3Z" fill="#dac69b" />
          <path d="M-4 8H4v5l-3 3v4h-2v-4l-3-3Z" fill="#8d713f" />
          <path d="M-5 23H5v3H-5Z" fill="#b6a27d" />
          <path d="M-18 5h-4m40 0h4M0-3v-4" stroke="#cfb984" strokeWidth="2" />
        </g>
      </g>
      {finish && <g className="team-celebration">
        <g className="team-hooray-popup">
          <path d="M142-10H278V-6H282V18H278V22H218L210 29L202 22H142V18H138V-6H142Z" fill="#08080b" opacity=".4" transform="translate(0 3)" />
          <path d="M142-10H278V-6H282V18H278V22H218L210 29L202 22H142V18H138V-6H142Z" fill="#e8d7b7" stroke="#9f815a" strokeWidth="2" />
          <path d="M145-6H275" stroke="#fff0d5" strokeWidth="2" />
          <text x="210" y="12" textAnchor="middle" fill="#443329" fontFamily="monospace" fontSize="17" fontWeight="bold" letterSpacing="1.5">HOORAY!</text>
          <path d="M122 1v10m-5-5h10M298-4v10m-5-5h10" stroke="#c3b1d7" strokeWidth="2" />
        </g>
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map(i => <rect key={i} className="team-confetti" x={50 + i * 27} y={20 + i % 3 * 8} width="3" height="5" fill={['#cfb382', '#a6b6cc', '#b6a0c6'][i % 3]} style={{ animationDelay: `${i * 75}ms` }} />)}
      </g>}
    </svg>
  </div>;
}
