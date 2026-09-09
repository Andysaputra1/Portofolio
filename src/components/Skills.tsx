// src/components/Skills.tsx
import DeskBuddy from "./DeskBuddy";
import useScrollReveal from "../hook/useScrollReveal.ts";
import { usePortfolioData } from "../context/PortfolioDataContext";
import { skillGroups, type Skill } from "../types/portfolio";
import type { IconType } from "react-icons";
import { SiNodedotjs, SiAngular, SiExpress, SiDocker, SiGit, SiOpenai, SiC, SiPython } from "react-icons/si";
import { FaBrain, FaRobot, FaNetworkWired, FaCode, FaCommentDots } from "react-icons/fa";

import reactImg from "../images/logoLanguage/react.png";
import htmlImg from "../images/logoLanguage/html.png";
import cssImg from "../images/logoLanguage/css.png";
import jsImg from "../images/logoLanguage/javascript.png";
import pythonImg from "../images/logoLanguage/python.png";
import cImg from "../images/logoLanguage/c.png";
import javaImg from "../images/logoLanguage/java.png";
import sqlImg from "../images/logoLanguage/sql.png";
import tsImg from "../images/logoLanguage/typescript.png";

const imageMap: Record<string, string> = { react: reactImg, html: htmlImg, css: cssImg, javascript: jsImg, python: pythonImg, c: cImg, java: javaImg, sql: sqlImg, typescript: tsImg };

const iconMap: Record<string, IconType> = { c: SiC, python: SiPython, node: SiNodedotjs, angular: SiAngular, express: SiExpress, docker: SiDocker, git: SiGit, "rest-api": FaCode, llm: FaRobot, openai: SiOpenai, nlp: FaCommentDots, "machine-learning": FaBrain, "deep-learning": FaNetworkWired };

function TechGroup({ title, items, index }: { title: string; items: Skill[]; index: number }) {
  const groupRef = useScrollReveal<HTMLElement>();
  if (!items.length) return null;

  return (
    <section className="toolkit-group reveal" ref={groupRef} aria-labelledby={`toolkit-group-${index}`}>
      <div className="toolkit-group-heading">
        <span className="toolkit-number" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
        <h3 id={`toolkit-group-${index}`}>{title}</h3>
      </div>
      <ul className="toolkit-tags">
        {items.map((skill) => {
          const Icon = iconMap[skill.id] ?? FaCode;
          return (
            <li key={skill.id} className="toolkit-tag" data-skill={skill.id}>
              {skill.image && !["c", "python"].includes(skill.image) ? <img className="skill-icon" src={imageMap[skill.image] ?? skill.image} alt="" loading="lazy" /> : <Icon className="skill-symbol" aria-hidden="true" />}
              <span>{skill.name}</span>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

export default function Skills() {
  const { skills } = usePortfolioData();

  // Section title ikut reveal
  const wrapTitleRef = useScrollReveal<HTMLHeadingElement>();

  return (
    <section id="skills" className="skills-wrap">
      <p className="section-kicker">02 / THE TOOLKIT</p>
      <h2 className="skills-title reveal" ref={wrapTitleRef}>
        Ideas meet <span>the right tools.</span>
      </h2>
      <p className="section-description">The technologies I use to turn a blank canvas into something useful.</p>
      <div className="toolkit-groups">
        {skillGroups.map((group, index) => (
          <TechGroup key={group} title={group} index={index} items={skills.filter((skill) => skill.group === group)} />
        ))}
        <DeskBuddy />
      </div>
    </section>
  );
}
