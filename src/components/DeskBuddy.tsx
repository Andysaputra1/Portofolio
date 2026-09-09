import { useEffect, useRef, useState } from "react";
import deskSprites from "../images/andy-laptop-sprites.png";
import "./DeskBuddy.css";

// Registered viewports keep the character seated in one place across all poses.
const frames = ["100 40 500 560", "630 40 500 560", "100 620 500 560", "630 620 500 560"];

export default function DeskBuddy() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting));
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="desk-buddy" ref={ref} data-paused={!visible} role="img" aria-label="Pixel Andy sits on the card, works on his laptop, has a lightbulb idea, then takes a sip of coffee.">
      {frames.map((viewBox, index) => (
        <svg key={viewBox} className={`desk-frame desk-frame--${index}`} viewBox={viewBox} aria-hidden="true">
          <image href={deskSprites} width="1254" height="1254" />
        </svg>
      ))}
      <svg className="desk-thought" viewBox="0 0 48 44" aria-hidden="true" shapeRendering="crispEdges">
        <path d="M6 30H10V34H6ZM2 37H5V40H2Z" fill="#bcc9e2" />
        <path d="M10 7H15V3H29V5H36V9H42V23H37V28H14V25H7V20H4V12H10Z" fill="#74829d" />
        <path d="M11 9H17V5H28V7H35V11H40V21H35V26H15V23H9V19H6V14H11Z" fill="#dfe7f5" />
        <g className="desk-lightbulb">
          <path d="M20 10H28V12H30V18H28V21H20V18H18V12H20Z" fill="#a87729" />
          <path d="M21 11H27V13H29V17H26V20H22V17H19V13H21Z" fill="#f6d46e" />
          <path d="M21 12H23V16H21Z" fill="#fff4bd" />
          <path d="M22 20H26V22H22ZM23 23H25V24H23Z" fill="#646978" />
          <path d="M23 7H25V9H23ZM14 13H16V15H14ZM32 13H34V15H32Z" fill="#d7aa45" />
        </g>
      </svg>
    </div>
  );
}
