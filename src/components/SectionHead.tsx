import type { ReactNode } from "react";
import useScrollReveal from "../hook/useScrollReveal.ts";

type Props = { label: string; title: string; titleId: string; children?: ReactNode; aside?: ReactNode };

// Shared opener: a small path-style label, the title and a lede. The hairline under it is the floor
// that each section's pixel-Andy scene (the aside) stands on.
export default function SectionHead({ label, title, titleId, children, aside }: Props) {
  const ref = useScrollReveal<HTMLElement>();
  return (
    <header className="section-head reveal" ref={ref}>
      <div className="section-head-text">
        <p className="section-label">~/{label}</p>
        <h2 id={titleId}>{title}</h2>
        {children && <p className="section-lede">{children}</p>}
      </div>
      {aside && <div className="section-scene">{aside}</div>}
    </header>
  );
}
