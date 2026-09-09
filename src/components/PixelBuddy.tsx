import { useEffect, useRef, useState } from "react";
import "./PixelBuddy.css";

/** Six reference-based frames share a 12-second run, wave, and mining loop. */
export default function PixelBuddy() {
  const [visible, setVisible] = useState(false);
  const sceneRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting));
    if (sceneRef.current) observer.observe(sceneRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="pixel-buddy" ref={sceneRef}>
      <div className="pixel-scene" data-paused={!visible} role="img" aria-label="Pixel Andy with brown hair, silver glasses and a navy shirt: running, saying hi, then mining crystals in a loop.">
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
        <div className="pixel-traveler" aria-hidden="true">
          <div className="pixel-sprite" />
          <span className="pixel-hello">Hi!</span>
        </div>
      </div>
      <div className="pixel-caption">
        <span>A tiny me. A little adventure.</span>

      </div>
    </div>
  );
}
