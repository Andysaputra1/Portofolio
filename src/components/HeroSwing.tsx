import { useEffect, useId, useRef, useState } from 'react';
import swingAtlas from '../images/andy-swing-sprites.png';
import './HeroSwing.css';

export default function HeroSwing({ mobile = false }: { mobile?: boolean }) {
  const maskId = useId();
  const leftRopeId = `${maskId}-left-rope`;
  const rightRopeId = `${maskId}-right-rope`;
  const sceneRef = useRef<HTMLDivElement>(null);
  const leftRope = useRef<SVGPathElement>(null);
  const rightRope = useRef<SVGPathElement>(null);
  const seat = useRef<SVGGElement>(null);
  const phase = useRef(0);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting));
    if (sceneRef.current) observer.observe(sceneRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let frame = 0;
    let previous = 0;
    const draw = (angle: number) => {
      const dx = 138 * Math.sin(angle);
      const dy = 138 * (1 - Math.cos(angle));
      // Keep the lower rope vertical through each closed fist as the seat moves.
      leftRope.current?.setAttribute('d', `M60 2Q${60 + dx * 0.55} 65 ${60 + dx} ${122 - dy}L${60 + dx} ${140 - dy}`);
      rightRope.current?.setAttribute('d', `M128 2Q${128 + dx * 0.55} 65 ${128 + dx} ${122 - dy}L${128 + dx} ${140 - dy}`);
      seat.current?.setAttribute('transform', `translate(${dx} ${-dy})`);
    };
    const tick = (time: number) => {
      if (previous && !document.hidden) phase.current += Math.min(time - previous, 50);
      previous = time;
      draw(Math.sin(phase.current / 4200 * Math.PI * 2) * 0.12);
      frame = requestAnimationFrame(tick);
    };
    const update = () => {
      cancelAnimationFrame(frame);
      previous = 0;
      if (motion.matches) draw(0);
      else if (visible) frame = requestAnimationFrame(tick);
    };
    update();
    motion.addEventListener('change', update);
    return () => { cancelAnimationFrame(frame); motion.removeEventListener('change', update); };
  }, [visible]);

  return (
    <div ref={sceneRef} className={`hero-swing ${mobile ? 'hero-swing-mobile' : 'hero-swing-desktop'}`} data-paused={!visible}
      role="img" aria-label="Pixel Andy swings gently from a grid square and waves hello.">
      <svg viewBox="0 0 180 180" aria-hidden="true" focusable="false">
        <defs>
          <filter id={maskId} x="0" y="0" width="100%" height="100%" colorInterpolationFilters="sRGB">
            <feColorMatrix in="SourceGraphic" type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  .2126 .7152 .0722 0 0" />
            <feComponentTransfer><feFuncA type="linear" slope="255" intercept="-18" /></feComponentTransfer>
            <feMorphology operator="dilate" radius="6" result="characterMask" />
            <feComposite in="SourceGraphic" in2="characterMask" operator="in" />
          </filter>
          <path id={leftRopeId} ref={leftRope} d="M60 2V140" />
          <path id={rightRopeId} ref={rightRope} d="M128 2V140" />
        </defs>
        <g transform="translate(-8 0)">
        {[leftRopeId, rightRopeId].map((id) => (
          <g key={id} className="swing-rope" fill="none" strokeLinecap="round">
            <use href={`#${id}`} stroke="#49372a" strokeWidth="3.8" />
            <use href={`#${id}`} stroke="#b39770" strokeWidth="2.6" />
            <use href={`#${id}`} stroke="#e0c49a" strokeWidth="1.8" strokeDasharray="1 3" />
          </g>
        ))}
        <g className="swing-seat" ref={seat}>
          <rect x="47" y="137" width="86" height="6" rx="1" fill="#684a34" />
          <path d="M47 137H133" stroke="#bc9674" strokeWidth="2" />
          <svg x="12" y="40" width="156" height="156" viewBox="0 0 1000 1000" overflow="hidden">
            <image className="swing-andy-frames" href={swingAtlas} width="2000" height="1000" filter={`url(#${maskId})`} />
          </svg>
          {/* Lashings sit below the fists, securing both ropes to the plank. */}
          {[60, 128].map((x) => (
            <g key={x} fill="none" strokeLinecap="round">
              <path d={`M${x} 134V146`} stroke="#705237" strokeWidth="3" />
              <path d={`M${x - 2} 136l4 1m-4 2l4 1m-4 2l4 1`} stroke="#d2b48b" strokeWidth="1.5" />
            </g>
          ))}
          <g className="swing-hello" transform="translate(-4 -65)">
            <path d="M128 107H161V131H140L134 137V131H128Z" fill="#dfc7ae" stroke="#8e7055" strokeWidth="1.5" />
            <text x="145" y="123" textAnchor="middle" fill="#33251c" fontFamily="monospace" fontWeight="bold" fontSize="12">Hi!</text>
          </g>
        </g>
        {[60, 128].map((x) => (
          <g key={x}>
            <circle cx={x} cy="2" r="3" fill="#604a36" stroke="#cfb28c" strokeWidth="1" />
            <path d={`M${x - 2} 5l4 1m-4 2l4 1`} stroke="#dcc29d" strokeWidth="1.4" />
          </g>
        ))}
        </g>
      </svg>
    </div>
  );
}
