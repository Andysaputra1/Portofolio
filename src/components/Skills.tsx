// src/components/Skills.tsx
import type { CSSProperties } from "react";
import useScrollReveal from "../hook/useScrollReveal.ts";
import { usePortfolioData } from "../context/PortfolioDataContext";
import type { Skill } from "../types/portfolio";

import reactImg from "../images/logoLanguage/react.png";
import htmlImg from "../images/logoLanguage/html.png";
import cssImg from "../images/logoLanguage/css.png";
import jsImg from "../images/logoLanguage/javascript.png";
import pythonImg from "../images/logoLanguage/python.png";
import cImg from "../images/logoLanguage/c.png";
import javaImg from "../images/logoLanguage/java.png";
import sqlImg from "../images/logoLanguage/sql.png";
import tsImg from "../images/logoLanguage/typescript.png";

const si = (i: number) => ({ "--i": i } as CSSProperties & Record<"--i", number>);
const imageMap: Record<string, string> = { react: reactImg, html: htmlImg, css: cssImg, javascript: jsImg, python: pythonImg, c: cImg, java: javaImg, sql: sqlImg, typescript: tsImg };

function TechGrid({
  title,
  items,
  size = "md",
}: {
  title: string;
  items: Skill[];
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
          <li key={s.id} className="skill-card" style={si(idx)} aria-label={s.name}>
            <div className="skill-card-inner">
              {s.image && <img className="skill-icon" src={imageMap[s.image] ?? s.image} alt={s.name} />}
              <span className="skill-label">{s.name}</span>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default function Skills() {
  const { skills } = usePortfolioData();
  const webDev = skills.filter((skill) => skill.group === "Web Development");
  const langs = skills.filter((skill) => skill.group === "Programming Languages & Database");

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
