// src/components/OrganizationExperience.tsx
import ExperienceProjects from "./ExperienceProjects";
import EmphasizedText from "./EmphasizedText";
import TeamLead from "./TeamLead";
import SectionHead from "./SectionHead";
import { usePortfolioData } from "../context/PortfolioDataContext";
import type { OrgExp } from "../types/portfolio";

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

  return (
    <section id="experience" className="section experience" aria-labelledby="experience-title">
      <div className="wrap">
        <SectionHead title="Experience" titleId="experience-title" aside={<div className="exp-team-stage"><TeamLead /></div>}>
          Internships and freelance work first, then the clubs and teams I've led or volunteered with.
        </SectionHead>

        <ol className="exp-list">
          {organizations.map((x) => (
            <li key={x.id} className="exp-item">
              <div className="exp-meta">
                <p className="exp-period">{x.period}</p>
                {x.location && <p className="exp-location">{x.location}</p>}
                <ExperiencePhoto experience={x} />
              </div>
              <div className="exp-details">
                <h3 className="exp-role">{x.role || x.org}</h3>
                {x.role && <p className="exp-org">{x.org}</p>}
                {x.summary && <p className="exp-summary"><EmphasizedText text={x.summary} /></p>}
                {!!x.impact?.length && <div className="exp-impact"><span>Impact</span><ul className="exp-bullets">{x.impact.map((item) => <li key={item}><EmphasizedText text={item} /></li>)}</ul></div>}
                {!!x.stack?.length && <ul className="tag-list" aria-label="Technologies">{x.stack.map((technology) => <li key={technology}>{technology}</li>)}</ul>}
                {!!x.projects?.length && <ExperienceProjects projects={x.projects} organization={x.org} />}
                {x.roles?.map((r) => (
                  <div key={r.title + (r.context || "")} className="exp-subrole">
                    <p className="exp-subtitle">
                      {r.title} {r.context && <span className="exp-context">{r.context}</span>}
                    </p>
                    {r.bullets.length > 0 && <ul className="exp-bullets">{r.bullets.map((bullet) => <li key={bullet}><EmphasizedText text={bullet} /></li>)}</ul>}
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
