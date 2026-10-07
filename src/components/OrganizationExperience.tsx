// src/components/OrganizationExperience.tsx
import ExperienceProjects from "./ExperienceProjects";
import TeamLead from "./TeamLead";
import SectionHead from "./SectionHead";
import { usePortfolioData } from "../context/PortfolioDataContext";
import useScrollReveal from "../hook/useScrollReveal.ts";
import type { CSSProperties } from "react";
import type { OrgExp } from "../types/portfolio";

const si = (i: number) => ({ "--i": i } as CSSProperties & Record<"--i", number>);

function ExperiencePhoto({ experience }: { experience: OrgExp }) {
  if (!experience.image) return null;
  return (
    <figure className={`exp-photo${experience.imageLayout === 'landscape' ? " exp-photo-landscape" : ""}`}>
      <div className="exp-photo-frame">
        <img src={experience.image} alt={experience.imageCaption || `${experience.role || experience.org} experience`} loading="lazy" decoding="async" />
      </div>
      {experience.imageCaption && <figcaption>{experience.imageCaption}</figcaption>}
    </figure>
  );
}

export default function OrganizationExperience() {
  const { organizations } = usePortfolioData();
  // The list staggers its children in as they scroll into view.
  const listRef = useScrollReveal<HTMLOListElement>();

  return (
    <section id="experience" className="section experience" aria-labelledby="experience-title">
      <div className="wrap">
        <SectionHead label="experience" title="Experience" titleId="experience-title" aside={<div className="exp-team-stage"><TeamLead /></div>}>
          Internships and freelance work first, then the clubs and teams I've led or volunteered with.
        </SectionHead>

        <ol className="exp-list reveal-stagger" ref={listRef}>
          {organizations.map((x, idx) => (
            <li key={x.id} className={"exp-item" + (x.projects?.length ? " exp-item-with-projects" : "")} style={si(idx)}>
              <div className="exp-meta">
                <p className="exp-period">{x.period}</p>
                {x.location && <p className="exp-location">{x.location}</p>}
                <ExperiencePhoto experience={x} />
              </div>
              <div className="exp-details">
                <h3 className="exp-role">{x.role || x.org}</h3>
                {x.role && <p className="exp-org">{x.org}</p>}
                {x.summary && <p className="exp-summary">{x.summary}</p>}
                {!!x.stack?.length && <ul className="tag-list" aria-label="Technologies">{x.stack.map((technology) => <li key={technology}>{technology}</li>)}</ul>}
                {!!x.projects?.length && <ExperienceProjects projects={x.projects} organization={x.org} />}
                {x.roles?.map((r) => (
                  <div key={r.title + (r.context || "")} className="exp-subrole">
                    <p className="exp-subtitle">
                      {r.title} {r.context && <span className="exp-context">{r.context}</span>}
                    </p>
                    {r.bullets.length > 0 && <ul className="exp-bullets">{r.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}</ul>}
                  </div>
                ))}
              </div>
            </li>
          ))}
        </ol>
        <div className="exp-team-stage exp-team-finish"><TeamLead finish /></div>
      </div>
    </section>
  );
}
