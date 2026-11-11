import type { ReactNode } from "react";
import { reveal } from "../utils/scrollMotion";

type Props = { title: string; titleId: string; children?: ReactNode; aside?: ReactNode };

// Shared opener: title and lede. The line under it is the floor each section's pixel-Andy scene stands on.
// On first view the line draws from the left, then the title and the scene fade in on top of it.
export default function SectionHead({ title, titleId, children, aside }: Props) {
  return (
    <header ref={reveal} data-reveal="line" className="section-head">
      <div className="section-head-text">
        <h2 id={titleId}>{title}</h2>
        {children && <p className="section-lede">{children}</p>}
      </div>
      {aside && <div className="section-scene">{aside}</div>}
    </header>
  );
}
