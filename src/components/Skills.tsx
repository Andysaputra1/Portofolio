// src/components/Skills.tsx
import { useMemo, type CSSProperties } from "react";
import useScrollReveal from "../hook/useScrollReveal.ts";

import reactImg from "../images/logoLanguage/react.png";
import htmlImg from "../images/logoLanguage/html.png";
import cssImg from "../images/logoLanguage/css.png";
import jsImg from "../images/logoLanguage/javascript.png";
import pythonImg from "../images/logoLanguage/python.png";
import cImg from "../images/logoLanguage/c.png";
import javaImg from "../images/logoLanguage/java.png";
import sqlImg from "../images/logoLanguage/sql.png";
import tsImg from "../images/logoLanguage/typescript.png";

type TechSkill = { name: string; img: string; alt?: string };
const si = (i: number) => ({ ["--i" as any]: i } as CSSProperties);

function TechGrid({
  title,
  items,
  size = "md",
}: {
  title: string;
  items: TechSkill[];
  size?: "sm" | "md";
}) {
  const packed = items.length <= 4;

  // reveal refs
  const titleRef = useScrollReveal<HTMLHeadingElement>();
  const listRef = useScrollReveal<HTMLUListElement>();

  return (
    <section className="skills-section">
      <h3 className="skills-subhead reveal" ref={titleRef}>
        {title}
      </h3>

      {/* Container pakai reveal-stagger, child di-stagger pakai --i */}
      <ul
        ref={listRef}
        className={`skill-grid is-${size} ${packed ? "is-packed" : ""} reveal-stagger`}
        role="list"
      >
        {items.map((s, idx) => (
          <li key={s.name} className="skill-card" style={si(idx)} aria-label={s.name}>
            <div className="skill-card-inner">
              <img className="skill-icon" src={s.img} alt={s.alt ?? s.name} />
              <span className="skill-label">{s.name}</span>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default function Skills() {
  const webDev: TechSkill[] = useMemo(
    () => [
      { name: "React.js", img: reactImg, alt: "React logo" },
      { name: "HTML", img: htmlImg, alt: "HTML logo" },
      { name: "CSS", img: cssImg, alt: "CSS logo" },
    ],
    []
  );

  const langs: TechSkill[] = useMemo(
    () => [
      { name: "Python", img: pythonImg, alt: "Python logo" },
      { name: "C", img: cImg, alt: "C language logo" },
      { name: "Java", img: javaImg, alt: "Java logo" },
      { name: "SQL", img: sqlImg, alt: "SQL/MySQL logo" },
      { name: "JavaScript", img: jsImg, alt: "JavaScript logo" },
      { name: "TypeScript", img: tsImg, alt: "TypeScript logo" },
    ],
    []
  );

  // Section title ikut reveal
  const wrapTitleRef = useScrollReveal<HTMLHeadingElement>();

  return (
    <section id="skills" className="skills-wrap">
      <h2 className="skills-title reveal" ref={wrapTitleRef}>
        Skills
      </h2>

      <TechGrid title="Web Development" items={webDev} size="sm" />
      <TechGrid title="Programming Languages & Database" items={langs} size="md" />
    </section>
  );
}
