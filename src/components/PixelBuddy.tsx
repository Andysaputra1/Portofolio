import { useEffect, useId, useRef, useState } from "react";
import "./PixelBuddy.css";
import runSprite from "../images/andy-nav-run.png";
import actionSprite from "../images/andy-pixel-sprites.png";

/** Six reference-based frames share a 12-second run, wave, and mining loop. */
export default function PixelBuddy() {
  const maskId = useId();
  const [frameIndex, setFrameIndex] = useState(0);
  const sceneRef = useRef<HTMLDivElement>(null);
  const travelerRef = useRef<HTMLDivElement>(null);
  const frames = ["70 62 780 780", "940 62 780 780", "1024 0 512 512", "0 512 512 512", "512 512 512 512", "1024 512 512 512"];

  useEffect(() => {
    const motion = matchMedia('(prefers-reduced-motion: reduce)');
    let raf = 0, elapsed = 0, previous = 0, visible = false, ready = false, disposed = false;
    const tick = (time: number) => {
      if (previous && !document.hidden) elapsed += Math.min(time - previous, 50);
      previous = time;
      const t = elapsed % 12000;
      const next = t < 3600 ? Math.floor(t / 240) % 2 : t < 6600 ? 2 + Math.floor((t - 3600) / 480) % 2 : 4 + Math.floor((t - 6600) / 360) % 2;
      setFrameIndex(next);
      if (travelerRef.current) {
        travelerRef.current.style.left = `${Math.min(t / 3600, 1) * 60}%`;
        travelerRef.current.style.opacity = String(t < 360 ? t / 360 : t > 11040 ? Math.max(0, (11640 - t) / 600) : 1);
      }
      raf = requestAnimationFrame(tick);
    };
    const update = () => {
      cancelAnimationFrame(raf); previous = 0;
      if (motion.matches) {
        setFrameIndex(2);
        if (travelerRef.current) { travelerRef.current.style.left = '30%'; travelerRef.current.style.opacity = '1'; }
      } else if (visible && ready) raf = requestAnimationFrame(tick);
    };
    // Decode both atlases before starting; their URLs and crop geometry stay fixed.
    Promise.all([runSprite, actionSprite].map(src => {
      const image = new Image(); image.src = src;
      return image.decode();
    })).then(() => { if (!disposed) { ready = true; update(); } }).catch(() => { if (!disposed) { ready = true; update(); } });
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; update(); });
    if (sceneRef.current) observer.observe(sceneRef.current);
    motion.addEventListener('change', update);
    return () => { disposed = true; observer.disconnect(); cancelAnimationFrame(raf); motion.removeEventListener('change', update); };
  }, []);

  return (
    <div className="pixel-buddy" ref={sceneRef}>
      <div className="pixel-scene" data-frame={frameIndex} role="img" aria-label="Pixel Andy runs to the right in side view, turns to face you and waves hello, then mines crystals.">
        <svg className="pixel-scenery" viewBox="0 0 300 112" aria-hidden="true" shapeRendering="crispEdges">
          <path d="M5 105H295" stroke="#353842" />
          <path d="M12 105v-4h4v4m39 0v-2h5v2" fill="#66738d" />
          <g className="pixel-rock">
            <path d="M256 105V95H262V86H275V82H286V91H292V98H295V105Z" fill="#393b4b" />
            <path d="M262 94V88H275V85H284V91H273V96Z" fill="#565b73" />
            <path d="M265 100V94H270V100ZM279 91V87H283V91Z" fill="#9bbef0" />
            <path d="M281 102V96H287V102Z" fill="#bca4e5" />
          </g>
          <g className="pixel-sparks" fill="#b8cef6"><path d="M253 83h4v4h-4Zm10-10h4v4h-4Zm-17 19h3v3h-3Z" /><path d="M276 77h4v4h-4Z" fill="#c6aff0" /></g>
        </svg>
        <div className="pixel-traveler" ref={travelerRef} aria-hidden="true">
          <svg className="pixel-character" viewBox="0 0 96 96" overflow="hidden">
            <defs><filter id={maskId} x="0" y="0" width="100%" height="100%" colorInterpolationFilters="sRGB">
              <feColorMatrix in="SourceGraphic" type="matrix" values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 .2126 .7152 .0722 0 0" />
              <feComponentTransfer><feFuncA type="linear" slope="255" intercept="-18" /></feComponentTransfer>
              <feMorphology operator="dilate" radius="3" result="mask" />
              <feComposite in="SourceGraphic" in2="mask" operator="in" />
            </filter></defs>
            {frames.map((viewBox, index) => (
              <svg key={index} data-pose={index} x="0" y="0" width="96" height="96" viewBox={viewBox} overflow="hidden" style={{ display: frameIndex === index ? "block" : "none" }}>
                <image href={index < 2 ? runSprite : actionSprite} width={index < 2 ? 1774 : 1536} height={index < 2 ? 887 : 1024} filter={`url(#${maskId})`} />
              </svg>
            ))}
          </svg>
          <span className="pixel-hello">Hi!</span>
        </div>
      </div>
      <div className="pixel-caption">
        <span>A tiny me. A little adventure.</span>

      </div>
    </div>
  );
}
