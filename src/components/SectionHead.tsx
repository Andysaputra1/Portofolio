import type { ReactNode } from "react";

type Props = { title: string; titleId: string; children?: ReactNode; aside?: ReactNode };

// Shared opener: title and lede. The line under it is the floor each section's pixel-Andy scene stands on.
export default function SectionHead({ title, titleId, children, aside }: Props) {
  return (
    <header className="section-head">
      <div className="section-head-text">
        <h2 id={titleId}>{title}</h2>
        {children && <p className="section-lede">{children}</p>}
      </div>
      {aside && <div className="section-scene">{aside}</div>}
    </header>
  );
}
