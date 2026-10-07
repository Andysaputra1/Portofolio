// src/components/Skills.tsx
import DeskBuddy from "./DeskBuddy";
import SectionHead from "./SectionHead";
import useScrollReveal from "../hook/useScrollReveal.ts";
import { usePortfolioData } from "../context/PortfolioDataContext";
import { skillGroups, type Skill } from "../types/portfolio";
import type { IconType } from "react-icons";
import { SiNodedotjs, SiAngular, SiExpress, SiDocker, SiGit, SiOpenai, SiC, SiPython } from "react-icons/si";
import { FaBrain, FaRobot, FaNetworkWired, FaCode, FaCommentDots } from "react-icons/fa";

import reactImg from "../images/logoLanguage/react.webp";
import htmlImg from "../images/logoLanguage/html.webp";
import cssImg from "../images/logoLanguage/css.webp";
import jsImg from "../images/logoLanguage/javascript.webp";
import pythonImg from "../images/logoLanguage/python.webp";
import cImg from "../images/logoLanguage/c.webp";
import javaImg from "../images/logoLanguage/java.webp";
import sqlImg from "../images/logoLanguage/sql.webp";
import tsImg from "../images/logoLanguage/typescript.webp";

const imageMap: Record<string, string> = { react: reactImg, html: htmlImg, css: cssImg, javascript: jsImg, python: pythonImg, c: cImg, java: javaImg, sql: sqlImg, typescript: tsImg };

const iconMap: Record<string, IconType> = { c: SiC, python: SiPython, node: SiNodedotjs, angular: SiAngular, express: SiExpress, docker: SiDocker, git: SiGit, "rest-api": FaCode, llm: FaRobot, openai: SiOpenai, nlp: FaCommentDots, "machine-learning": FaBrain, "deep-learning": FaNetworkWired };

function TechGroup({ title, items, index }: { title: string; items: Skill[]; index: number }) {
  const groupRef = useScrollReveal<HTMLElement>();
  if (!items.length) return null;

  return (
    <section className="toolkit-group reveal" ref={groupRef} aria-labelledby={`toolkit-group-${index}`}>
      <h3 id={`toolkit-group-${index}`}>
        <span className="toolkit-number" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
        {title}
      </h3>
      <ul className="toolkit-list">
        {items.map((skill) => {
          const Icon = iconMap[skill.id] ?? FaCode;
          return (
            <li key={skill.id} className="toolkit-item" data-skill={skill.id}>
              <span className="toolkit-icon" aria-hidden="true">
                {skill.image && !["c", "python"].includes(skill.image) ? <img src={imageMap[skill.image] ?? skill.image} alt="" loading="lazy" /> : <Icon />}
              </span>
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

  return (
    <section id="skills" className="section toolkit" aria-labelledby="skills-title">
      <div className="wrap">
        <SectionHead label="toolkit" title="Tools I work with" titleId="skills-title" aside={<DeskBuddy />}>
          Languages, frameworks and tools I've used in coursework, internships and my own projects.
        </SectionHead>
        <div className="toolkit-groups">
          {skillGroups.map((group, index) => (
            <TechGroup key={group} title={group} index={index} items={skills.filter((skill) => skill.group === group)} />
          ))}
        </div>
      </div>
    </section>
  );
}
